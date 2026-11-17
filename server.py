#!/usr/bin/env python3
"""
Local LAN Web Server cho Kindle E-Ink Dashboard.
Phục vụ file tĩnh và cung cấp API truyền Link / File (PC <-> Kindle)
cũng như proxy trích xuất trang web trong mạng Wi-Fi nội bộ.
Chỉ sử dụng thư viện chuẩn Python 3.
"""

import base64
import datetime
import html as html_lib
import io
import json
import mimetypes
import os
import re
import ssl
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
import xml.etree.ElementTree as ET
import zipfile
from http.server import SimpleHTTPRequestHandler

try:
    from http.server import ThreadingHTTPServer as BaseHTTPServer
except ImportError:
    from http.server import HTTPServer as BaseHTTPServer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
INBOX_FILE = os.path.join(BASE_DIR, "shared_inbox.json")
MAX_INBOX_ITEMS = 50
MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB

INBOX_LOCK = threading.Lock()


def ensure_storage():
    if not os.path.isdir(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)


def load_inbox():
    with INBOX_LOCK:
        if not os.path.isfile(INBOX_FILE):
            return []
        try:
            with open(INBOX_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data if isinstance(data, list) else []
        except Exception:
            return []


def save_inbox(items):
    with INBOX_LOCK:
        trimmed = items[:MAX_INBOX_ITEMS]
        tmp_path = INBOX_FILE + ".tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(trimmed, f, ensure_ascii=False, indent=2)
        os.replace(tmp_path, INBOX_FILE)
        return trimmed


def sanitize_filename(name):
    raw = os.path.basename(str(name or "file.bin")).strip()
    if not raw:
        raw = "file.bin"
    base, ext = os.path.splitext(raw)
    safe_base = re.sub(r"[^A-Za-z0-9._-]+", "_", base).strip("._")
    if not safe_base:
        safe_base = "file"
    safe_ext = re.sub(r"[^A-Za-z0-9.]+", "", ext)[:12]
    stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{stamp}_{safe_base[:60]}{safe_ext}"


def text_lines_to_blocks(text, max_blocks=800):
    blocks = []
    for raw_line in str(text or "").splitlines():
        line = re.sub(r"\s+", " ", raw_line).strip()
        if not line:
            continue
        is_heading = False
        if line.startswith("#"):
            line = re.sub(r"^#+\s*", "", line).strip()
            is_heading = True
        if not line:
            continue
        blocks.append({"type": "h" if is_heading else "p", "text": line})
        if len(blocks) >= max_blocks:
            break
    return blocks


def extract_docx_blocks(raw_bytes):
    blocks = []
    try:
        with zipfile.ZipFile(io.BytesIO(raw_bytes), "r") as zf:
            if "word/document.xml" not in zf.namelist():
                return blocks
            xml_bytes = zf.read("word/document.xml")
        root = ET.fromstring(xml_bytes)
        w_ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
        for p_el in root.iter(w_ns + "p"):
            texts = []
            for t_el in p_el.iter(w_ns + "t"):
                if t_el.text:
                    texts.append(t_el.text)
            line = re.sub(r"\s+", " ", "".join(texts)).strip()
            if not line:
                continue
            is_heading = False
            p_style = p_el.find(f".//{w_ns}pStyle")
            if p_style is not None:
                val = p_style.attrib.get(w_ns + "val", "") or p_style.attrib.get("val", "")
                if "heading" in val.lower() or "title" in val.lower():
                    is_heading = True
            blocks.append({"type": "h" if is_heading else "p", "text": line})
            if len(blocks) >= 1200:
                break
    except Exception:
        return []
    return blocks


def extract_html_blocks(html_text):
    cleaned = re.sub(r"<(script|style|noscript)[^>]*>[\s\S]*?</\1>", " ", html_text, flags=re.I)
    cleaned = re.sub(r"</(p|div|li|h1|h2|h3|h4|tr|br)\s*>", "\n", cleaned, flags=re.I)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = html_lib.unescape(cleaned)
    return text_lines_to_blocks(cleaned)


def extract_file_blocks(filename, raw_bytes):
    ext = os.path.splitext(filename.lower())[1]
    if ext == ".docx":
        return extract_docx_blocks(raw_bytes)
    if ext in (".txt", ".md", ".csv", ".json", ".log"):
        text = raw_bytes.decode("utf-8-sig", errors="replace")
        return text_lines_to_blocks(text)
    if ext in (".html", ".htm"):
        text = raw_bytes.decode("utf-8-sig", errors="replace")
        return extract_html_blocks(text)
    return []


def build_ssl_context():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def format_now_text():
    return datetime.datetime.now().strftime("%H:%M · %d/%m")


class KindleDashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-File-Name")
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_request_body(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_UPLOAD_BYTES:
            return None, length
        return self.rfile.read(length), length

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/ping":
            self.send_json(200, {"ok": True, "mode": "lan", "time": int(time.time())})
            return

        if path == "/api/inbox":
            items = load_inbox()
            self.send_json(200, {"ok": True, "items": items})
            return

        if path == "/api/extract":
            self.handle_extract(parsed.query)
            return

        # Không phục vụ trực tiếp file cấu hình/inbox nội bộ qua static handler
        low_path = path.lower()
        if low_path in ("/shared_inbox.json", "/server.py", "/.gitignore") or low_path.startswith("/.git"):
            self.send_error(403, "Forbidden")
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/inbox":
            self.handle_post_inbox()
            return

        if path == "/api/inbox/clear":
            save_inbox([])
            self.send_json(200, {"ok": True, "items": []})
            return

        if path == "/api/upload":
            self.handle_upload()
            return

        self.send_json(404, {"ok": False, "error": "Endpoint not found"})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/api/inbox":
            self.send_json(404, {"ok": False, "error": "Endpoint not found"})
            return

        qs = urllib.parse.parse_qs(parsed.query)
        target_id = qs.get("id", [""])[0]
        if not target_id:
            save_inbox([])
            self.send_json(200, {"ok": True, "items": []})
            return

        items = load_inbox()
        remaining = [it for it in items if str(it.get("id", "")) != str(target_id)]
        remaining = save_inbox(remaining)
        self.send_json(200, {"ok": True, "items": remaining})

    def handle_post_inbox(self):
        raw, length = self.read_request_body()
        if raw is None:
            self.send_json(400, {"ok": False, "error": f"Invalid body length: {length}"})
            return

        try:
            item = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            self.send_json(400, {"ok": False, "error": f"Invalid JSON: {exc}"})
            return

        if not isinstance(item, dict):
            self.send_json(400, {"ok": False, "error": "Payload must be a JSON object"})
            return

        if not item.get("id"):
            item["id"] = f"pc-{int(time.time() * 1000)}-{uuid.uuid4().hex[:6]}"
        if not item.get("pubText"):
            item["pubText"] = format_now_text()
        if not item.get("sourceName"):
            item["sourceName"] = "Từ PC (LAN)"

        items = load_inbox()
        items = [it for it in items if str(it.get("id", "")) != str(item["id"])]
        items.insert(0, item)
        saved = save_inbox(items)
        self.send_json(200, {"ok": True, "item": item, "items": saved})

    def handle_upload(self):
        ensure_storage()
        raw, length = self.read_request_body()
        if raw is None:
            self.send_json(400, {"ok": False, "error": f"File quá lớn hoặc rỗng ({length} bytes)"})
            return

        content_type = (self.headers.get("Content-Type") or "").lower()
        orig_name = ""
        file_bytes = b""

        if "application/json" in content_type:
            try:
                payload = json.loads(raw.decode("utf-8"))
                orig_name = str(payload.get("fileName") or "file.bin")
                b64_data = str(payload.get("dataBase64") or "")
                if "," in b64_data and b64_data.startswith("data:"):
                    b64_data = b64_data.split(",", 1)[1]
                file_bytes = base64.b64decode(b64_data)
            except Exception as exc:
                self.send_json(400, {"ok": False, "error": f"Invalid JSON upload: {exc}"})
                return
        else:
            header_name = self.headers.get("X-File-Name", "")
            orig_name = urllib.parse.unquote(header_name) if header_name else "file.bin"
            file_bytes = raw

        if not file_bytes:
            self.send_json(400, {"ok": False, "error": "Nội dung file rỗng"})
            return

        safe_name = sanitize_filename(orig_name)
        dest_path = os.path.join(UPLOAD_DIR, safe_name)
        with open(dest_path, "wb") as f:
            f.write(file_bytes)

        blocks = extract_file_blocks(orig_name, file_bytes)
        snippet = " ".join(b["text"] for b in blocks[:3])[:220] if blocks else f"File {orig_name} ({len(file_bytes)} bytes)"
        file_url = "/uploads/" + urllib.parse.quote(safe_name)

        self.send_json(
            200,
            {
                "ok": True,
                "fileName": os.path.basename(orig_name),
                "savedName": safe_name,
                "fileUrl": file_url,
                "size": len(file_bytes),
                "fullParagraphs": blocks if blocks else None,
                "snippet": snippet,
            },
        )

    def handle_extract(self, query_str):
        qs = urllib.parse.parse_qs(query_str)
        target_url = (qs.get("url", [""])[0] or "").strip()
        if not target_url:
            self.send_json(400, {"ok": False, "error": "Missing url parameter"})
            return

        parsed_target = urllib.parse.urlparse(target_url)
        if parsed_target.scheme not in ("http", "https") or not parsed_target.netloc:
            self.send_json(400, {"ok": False, "error": "URL phải bắt đầu bằng http:// hoặc https://"})
            return

        req = urllib.request.Request(
            target_url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
            },
        )

        try:
            ssl_ctx = build_ssl_context()
            with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
                final_url = resp.geturl() or target_url
                raw_bytes = resp.read(5 * 1024 * 1024)
                charset = resp.headers.get_content_charset() or "utf-8"
                try:
                    html_text = raw_bytes.decode(charset, errors="replace")
                except LookupError:
                    html_text = raw_bytes.decode("utf-8", errors="replace")
            self.send_json(200, {"ok": True, "url": final_url, "html": html_text})
        except urllib.error.HTTPError as exc:
            self.send_json(502, {"ok": False, "error": f"HTTP {exc.code}: {exc.reason}"})
        except Exception as exc:
            self.send_json(502, {"ok": False, "error": str(exc)})


def main():
    ensure_storage()
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            port = 8080

    BaseHTTPServer.allow_reuse_address = True
    server = BaseHTTPServer(("0.0.0.0", port), KindleDashboardHandler)
    print(f"Kindle E-Ink Dashboard LAN Server dang chay tai http://0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDa tat server.")
        server.server_close()


if __name__ == "__main__":
    main()
