# Flashcard Ôn Thi

Ứng dụng ôn thi trắc nghiệm với thuật toán Lặp lại ngắt quãng (SRS), xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## Tính năng

*   **Mô phỏng đề thi:** Cấu trúc câu hỏi giống đề thi trắc nghiệm Việt Nam.
*   **SRS (Spaced Repetition):** Thuật toán SM-2 giúp tối ưu hóa thời gian ôn tập.
*   **Offline-first:** Dữ liệu tiến độ được lưu trong trình duyệt (LocalStorage), không cần đăng nhập.
*   **Tốc độ cao:** Sử dụng Next.js App Router và Tailwind CSS.

## Cài đặt và Chạy

1.  Cài đặt dependencies:
    ```bash
    npm install
    ```

2.  Chạy server development:
    ```bash
    npm run dev
    ```

3.  Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Deploy lên Vercel

Dự án này được tối ưu để deploy lên Vercel.

1.  Đẩy code lên GitHub.
2.  Truy cập [Vercel](https://vercel.com).
3.  Import dự án từ GitHub.
4.  Nhấn **Deploy**.
5.  Không cần cấu hình thêm (Zero Config).

## Cấu trúc dữ liệu

Dữ liệu mẫu nằm trong `src/data/sample.ts`. Bạn có thể thêm đề thi mới bằng cách chỉnh sửa file này hoặc mở rộng logic để tải từ file JSON khác.
