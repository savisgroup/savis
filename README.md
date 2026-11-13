# SAVIS Website V3 — Next.js + Payload

Stack: **Next.js 16 (App Router) · Tailwind v4 · shadcn/ui kiểu Radix (Button/Badge/Card) · Framer Motion · Payload CMS**.
Design token lấy nguyên từ mockup genAI (`src/app/globals.css`).

## Chạy
```bash
npm install
cp .env.example .env.local      # điền PAYLOAD_URL (mặc định cms.savis-group.com)
npm run dev                     # http://localhost:3000  → tự chuyển sang /vi
npm run build && npm start      # production
```

## Biến môi trường
| Biến | Ý nghĩa |
|---|---|
| `PAYLOAD_URL` | URL Payload CMS |
| `PAYLOAD_API_KEY` | API key user editor (chỉ phía server). Chỉ cần để xem bản Draft |
| `INSIGHTS_INCLUDE_DRAFTS` | `true` = hiện cả bài Draft (dev/preview). **Production để `false`** — khi đó chỉ bài Published hiện ra |
| `NEXT_PUBLIC_SITE_URL` | Domain site (canonical, Open Graph) |

## Cấu trúc
- `src/lib/payload/client.ts` — gọi REST API Payload (locale vi/en, lọc danh mục, bài theo slug), cache 60 giây (ISR).
- `src/lib/payload/types.ts` — kiểu dữ liệu theo collection `insights`, `insight-categories`, `media`.
- `src/components/lexical/RichText.tsx` — render thân bài Lexical: đoạn, tiêu đề, danh sách, trích dẫn, liên kết, định dạng chữ, ảnh (upload), bảng.
- `src/app/[locale]/…` — `/vi|en`, `/insights` (lọc `?category=slug`), `/insights/[slug]`.
- `src/lib/i18n.ts` — nhãn giao diện VI/EN. Nội dung bài lấy từ CMS theo locale.

## Việc còn lại / lưu ý
- Trang chủ hiện chỉ là bản tạm (để minh họa khối Insights). Các trang khác (Solutions, Industries, About…) dựng tiếp bám mockup.
- Logo hiện là chữ; thay bằng file logo chính thức.
- Media/ảnh đại diện đọc từ `cms.savis-group.com/api/media/file/...`; nếu dùng domain khác cho CMS, đổi `PAYLOAD_URL`.
- Nội dung mới trên CMS xuất hiện sau tối đa 60 giây. Muốn tức thì: thêm webhook gọi `revalidateTag("payload")`.
- Không commit `.env.local`.
