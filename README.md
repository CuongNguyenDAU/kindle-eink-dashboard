# Kindle E-Ink Dashboard (Đồng hồ · Thời tiết · Lịch · Pomodoro · Đọc báo RSS)

Ứng dụng web tối ưu chuyên biệt cho màn hình mực điện tử **Amazon Kindle E-Ink** (không cần Jailbreak, chạy trực tiếp trên trình duyệt có sẵn của Kindle bằng mã ES5 thuần, độ tương phản tuyệt đối đen – trắng `#000000` / `#FFFFFF`, tắt toàn bộ hiệu ứng chuyển động).

- **Trang chạy trực tiếp (GitHub Pages):** https://cuongnguyendau.github.io/kindle-eink-dashboard/

---

## Tính năng chính

### 1. Chăm sóc màn hình E-Ink & Hiển thị thông minh
- **Làm mới E-Ink & Tự động khử bóng mờ (Auto Ghost-Cleaning):** Nháy đen–trắng toàn màn hình `200ms` theo thao tác tay hoặc tự động định kỳ `15 / 30 / 60 phút` trong hộp thoại **Cài đặt E-Ink**.
- **Chế độ Toàn màn hình (Zen / Big Clock Mode):** Chạm vào giờ đồng hồ hoặc nút **Toàn màn hình** để phóng to Đồng hồ + Lịch Âm Dương + Thời tiết hiện tại, dễ nhìn từ xa 2–3 mét.
- **Tự động nền tối ban đêm (Auto Night Mode):** Tự động chuyển nền đen – chữ trắng từ `19:00` đến `06:00` sáng hôm sau.
- **Tùy chỉnh cỡ chữ (`A-` / `A+`):** 4 mức tỷ lệ chữ (`90%`, `100%`, `115%`, `130%`) cho toàn trang và cỡ chữ riêng trong trình đọc báo.
- **Ngang / Dọc & Đen / Trắng:** Chuyển nhanh bố cục 1 cột (đặt dọc) và 2 cột (đặt ngang trên giá đỡ), hoặc đảo màu thủ công.

### 2. Đồng hồ, Lịch Âm Dương Việt Nam, Tiết khí & Ngày lễ
- Đồng hồ cỡ lớn chỉ cập nhật mỗi đầu phút để tiết kiệm pin và tránh nháy màn hình E-Ink.
- Tự động tính Âm lịch, Can Chi (Ngày, Tháng, Năm) và **24 Tiết khí** theo múi giờ Việt Nam (`UTC+7`) hoàn toàn offline.
- **Lịch tháng kèm Âm lịch & Ngày lễ:** Mỗi ô lịch hiển thị ngày Dương lịch và Âm lịch, đánh dấu ngày Mùng 1, ngày Rằm (`15`) và các ngày lễ Dương lịch / Âm lịch Việt Nam. Chạm vào bất kỳ ngày nào trên lịch để xem thông tin chi tiết bên dưới.

### 3. Thời tiết, Không khí (AQI / UV) & Biểu đồ 12 giờ (Open-Meteo API)
- Không cần đăng ký API key. Hiển thị nhiệt độ, cảm giác thực, độ ẩm, tốc độ gió, **chỉ số tia UV**, **chỉ số chất lượng không khí (`US AQI` & `PM2.5`)**, **khả năng mưa (%)**, **giờ Mặt trời mọc / lặn**, và dự báo 3 ngày tới bằng icon SVG đơn sắc.
- **Biểu đồ xu hướng 12 giờ tới:** Thanh cột E-Ink đơn sắc biểu diễn nhiệt độ và xác suất mưa theo từng mốc 2 giờ.
- Hỗ trợ chọn nhanh 8 thành phố: Đà Nẵng (mặc định), Hà Nội, TP. Hồ Chí Minh, Huế, Đà Lạt, Cần Thơ, Hải Phòng, Nha Trang. Tự động lưu bộ nhớ tạm vào `localStorage` để xem khi offline.

### 4. Đồng hồ Pomodoro / Đếm ngược tiết học E-Ink
- Các mốc nhanh `25p` (Pomodoro), `5p` (Nghỉ ngắn), `15p` (Nghỉ dài), `45p` (Tiết học) và nút `+5p`.
- Chỉ cập nhật hiển thị mỗi phút một lần để bảo vệ màn hình E-Ink; khi hết giờ tự động **nháy đảo màu màn hình 3 lần** báo hiệu không tiếng ồn.

### 5. Trình đọc Web bất kỳ & Tin tức RSS chuyên sâu cho E-Ink
- **Đọc trang web bất kỳ (E-Ink Web Reader):** Nhập hoặc dán trực tiếp bất kỳ địa chỉ URL nào ở ô **Đọc Web** để loại bỏ quảng cáo/script nặng và chuyển trang web thành giao diện đọc sách E-Ink đen–trắng, hỗ trợ lật trang, chỉnh cỡ chữ `A-` / `A+` và lưu offline.
- **Trích xuất đa tầng & Duyệt liên kết tiếp theo:** Ưu tiên trích xuất qua `r.jina.ai`; nếu trang nguồn chặn hoặc timeout, tự động chuyển sang bộ lọc HTML dự phòng (`AllOrigins`, `CodeTabs`, hoặc `/api/extract` khi chạy LAN Server). Hiển thị danh sách liên kết con bên dưới bài viết để chạm đọc tiếp ở chế độ E-Ink và bấm **Quay lại** dễ dàng.
- **9 nguồn tin RSS tích hợp sẵn** (VnExpress Tin mới/Công nghệ/Giáo dục/Kinh doanh/Thế giới, Tuổi Trẻ, Thanh Niên, Dân Trí, Hacker News) và cho phép **tự thêm/xóa nguồn RSS tùy chỉnh**.
- **Quản lý bài đọc:** Lọc theo **Tất cả / Chưa đọc / Đã lưu (Offline) / Từ PC**, lọc từ khóa, đánh dấu đã đọc và phân trang danh sách tin.

### 6. Gửi Link & File từ PC tới Kindle (PC ↔ Kindle Bridge)
- **Không cần cài đặt khi dùng GitHub Pages (Cloud Relay):** Mở mục **Gửi/Nhận PC**, đặt cùng một **Mã kết nối (Room Code)** trên cả PC và Kindle Scribe (VD: `cuong-kindle`). Từ PC dán đường dẫn web, đoạn ghi chú hoặc chọn file (`.txt`, `.md`, `.html`, `.docx`, `.pdf`, `.epub`...) để gửi sang Kindle; trên Kindle tự động đồng bộ mỗi 30 giây hoặc bấm **Làm mới hộp thư** / mở tab **Từ PC**.
- **Chế độ mạng LAN nội bộ (`server.py` / `run_server.bat`):** Khi chạy `run_server.bat` trên PC, ứng dụng tự động dùng LAN Server (`http://<IP>:8080`) để truyền file dung lượng lớn (tối đa 50 MB) và trích xuất trang web ngay trong mạng Wi-Fi nội bộ.
- **Đọc trực tiếp file tài liệu trên E-Ink:** Các file `.txt`, `.md`, `.html`, `.docx` được trích xuất sẵn thành các đoạn văn để đọc lật trang ngay trên Kindle mà không cần tải app ngoài; các file `.pdf`, `.epub`, `.mobi` kèm nút tải file về máy.

---

## 1. Cách chạy thử trên máy tính và mạng Wi-Fi nội bộ (LAN)

1. Nhấp đúp vào file `run_server.bat` trong thư mục dự án (sẽ khởi chạy `server.py` ở cổng `8080`, hỗ trợ cả gửi/nhận Link & File trong LAN).
2. Trên máy tính, mở trình duyệt vào địa chỉ `http://localhost:8080`.
3. Trên **Kindle E-Ink** (kết nối cùng mạng Wi-Fi với máy tính):
   - Mở biểu tượng menu `⋮` (góc trên bên phải) $\rightarrow$ chọn **Web Browser** (hoặc *Experimental Browser*).
   - Nhập địa chỉ `http://<IP_MAY_TINH>:8080` mà `run_server.bat` in ra trên màn hình (ví dụ: `http://192.168.1.15:8080`).
   - Lưu lại trang vào **Bookmarks** của trình duyệt Kindle để mở lại chỉ với 1 lần chạm.

> **Lưu ý tường lửa Windows:** Nếu Kindle không tải được trang qua Wi-Fi nội bộ, hãy kiểm tra Windows Defender Firewall đã cho phép Python/cổng `8080` trong mạng *Private* chưa.

---

## 2. Cách đưa lên GitHub Pages (Không cần bật máy tính)

Vì toàn bộ ứng dụng vẫn chạy thuần tĩnh (`index.html`, `styles.css`, `app.js`), bạn có thể đưa lên **GitHub Pages**, **Cloudflare Pages**, hoặc **Vercel** hoàn toàn miễn phí (tính năng **Đọc trang web bất kỳ** và **Gửi Link/File qua Mã kết nối** đều hoạt động trực tiếp trên trình duyệt):

- **Link GitHub Pages trực tiếp của dự án:** https://cuongnguyendau.github.io/kindle-eink-dashboard/

1. Tạo một repository công khai trên GitHub và đẩy toàn bộ file (`index.html`, `styles.css`, `app.js`...) lên nhánh `main`.
2. Vào **Settings $\rightarrow$ Pages**, chọn Source là **Deploy from a branch** (`main` / `/ (root)`).
3. Mở đường dẫn `https://<ten-tai-khoan>.github.io/<ten-repo>/` trên trình duyệt của Kindle và lưu Bookmark.

---

## 3. Mẹo `~ds`: Biến Kindle thành màn hình để bàn luôn sáng

Mặc định Kindle sẽ tự khóa màn hình sau khoảng 5–10 phút không chạm. Để giữ Dashboard hiển thị liên tục suốt ngày:

1. Ở màn hình chính (**Home**) của Kindle, chạm vào thanh **Search (Tìm kiếm)** phía trên.
2. Gõ chính xác 3 ký tự sau rồi nhấn Enter:
   ```text
   ~ds
   ```
   *(Lệnh tắt trình bảo vệ màn hình — Disable Screensaver).*
3. Mở lại **Web Browser** và mở Dashboard. Kindle sẽ không tự tắt màn hình nữa (bạn vẫn có thể chỉnh độ sáng đèn nền thủ công về mức thấp hoặc tắt đèn nếu đặt ở nơi đủ sáng).
4. **Cách khôi phục lại bình thường:** Giữ nút nguồn khoảng 7–10 giây và chọn **Restart (Khởi động lại)**; sau khi khởi động lại, chế độ tự ngủ sẽ hoạt động bình thường trở lại.
