# Kindle E-Ink Dashboard (Đồng hồ · Thời tiết · Lịch biểu)

Ứng dụng web tối ưu chuyên biệt cho màn hình mực điện tử **Amazon Kindle E-Ink** (không cần Jailbreak, chạy trực tiếp trên trình duyệt có sẵn của Kindle).

## Tính năng chính

- **Đồng hồ & Lịch Âm Dương Việt Nam:**
  - Đồng hồ cỡ lớn chỉ cập nhật mỗi đầu phút để tiết kiệm pin và tránh nháy màn hình E-Ink.
  - Tự động tính ngày Âm lịch và Can Chi (Ngày, Tháng, Năm) theo múi giờ Việt Nam (`UTC+7`) hoàn toàn offline.
- **Thời tiết thực tế (Open-Meteo API):**
  - Không cần đăng ký API key. Hiển thị nhiệt độ, cảm giác thực, độ ẩm, tốc độ gió và dự báo 3 ngày tới bằng bộ icon SVG đơn sắc nét đậm.
  - Hỗ trợ chọn nhanh 8 thành phố: Đà Nẵng (mặc định), Hà Nội, TP. Hồ Chí Minh, Huế, Đà Lạt, Cần Thơ, Hải Phòng, Nha Trang.
  - Tự động lưu bản ghi cuối cùng vào `localStorage` để vẫn xem được khi tắt Wi-Fi.
- **Lịch tháng & Lịch biểu cá nhân:**
  - Bảng lịch tháng (Thứ 2 – Chủ Nhật) đánh dấu nổi bật ngày hôm nay.
  - Danh sách việc cần làm / lịch hẹn theo giờ lưu trên máy (`localStorage`), chạm để đánh dấu hoàn thành hoặc xóa.
- **Thanh công cụ chuyên dụng cho E-Ink:**
  - **Làm mới E-Ink:** Nháy đen–trắng toàn màn hình 200ms giúp xóa bóng mờ (*ghosting*).
  - **Ngang / Dọc:** Chuyển đổi nhanh giữa bố cục 1 cột (đặt dọc) và 2 cột (đặt ngang trên giá đỡ).
  - **Đen / Trắng:** Đảo màu nền đen – chữ trắng để dùng ban đêm.

---

## 1. Cách chạy thử trên máy tính và mạng Wi-Fi nội bộ (LAN)

1. Nhấp đúp vào file `run_server.bat` trong thư mục dự án (hoặc chạy `python -m http.server 8080 --bind 0.0.0.0` trong Terminal).
2. Trên máy tính, mở trình duyệt vào địa chỉ `http://localhost:8080`.
3. Trên **Kindle E-Ink** (kết nối cùng mạng Wi-Fi với máy tính):
   - Mở biểu tượng menu `⋮` (góc trên bên phải) $\rightarrow$ chọn **Web Browser** (hoặc *Experimental Browser*).
   - Nhập địa chỉ `http://<IP_MAY_TINH>:8080` mà `run_server.bat` in ra trên màn hình (ví dụ: `http://192.168.1.15:8080`).
   - Lưu lại trang vào **Bookmarks** của trình duyệt Kindle để mở lại chỉ với 1 lần chạm.

> **Lưu ý tường lửa Windows:** Nếu Kindle không tải được trang qua Wi-Fi nội bộ, hãy kiểm tra Windows Defender Firewall đã cho phép Python/cổng `8080` trong mạng *Private* chưa.

---

## 2. Cách đưa lên GitHub Pages (Không cần bật máy tính)

Vì toàn bộ ứng dụng chỉ gồm các file tĩnh (`index.html`, `styles.css`, `app.js`), bạn có thể đưa lên **GitHub Pages**, **Cloudflare Pages**, hoặc **Vercel** hoàn toàn miễn phí:

- **Link GitHub Pages trực tiếp của dự án:** https://cuongnguyendau.github.io/kindle-eink-dashboard/

1. Tạo một repository công khai trên GitHub và đẩy 3 file `index.html`, `styles.css`, `app.js` lên nhánh `main`.
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
