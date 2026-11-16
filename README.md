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

### 5. Lịch biểu cá nhân & Đồng bộ nhanh
- Quản lý danh sách việc cần làm / lịch hẹn theo giờ lưu trên `localStorage`.
- **Đồng bộ / Nhập nhanh:** Hỗ trợ nạp mẫu lịch trình 1 chạm (Ngày giảng dạy / Làm việc tập trung), dán nhiều dòng theo dạng `HH:MM Nội dung` hoặc JSON, và tải đồng bộ trực tiếp từ URL Raw (như GitHub Gist) để khỏi phải gõ nhiều trên màn hình Kindle.

### 6. Trình đọc tin tức RSS chuyên sâu cho E-Ink
- **9 nguồn tin tích hợp sẵn** (VnExpress Tin mới/Công nghệ/Giáo dục/Kinh doanh/Thế giới, Tuổi Trẻ, Thanh Niên, Dân Trí, Hacker News) và cho phép **tự thêm/xóa nguồn RSS tùy chỉnh**.
- **Quản lý bài đọc:** Lọc theo **Tất cả / Chưa đọc / Đã lưu (Offline)**, lọc từ khóa, đánh dấu đã đọc và phân trang danh sách tin.
- **Chế độ Đọc báo toàn màn hình & Đọc toàn văn kiểu Kindle:** Tự động trích xuất nội dung bài viết sạch quảng cáo, hỗ trợ **lật trang kiểu sách Kindle** (`Trang trước` / `Trang sau`) hoặc cuộn liền mạch, chỉnh cỡ chữ `A-` / `A+` và **Lưu offline** để đọc lại khi tắt Wi-Fi.

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
