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

## Triển khai Cloudflare Workers
- Dùng `@opennextjs/cloudflare`. Cấu hình ở `wrangler.jsonc` và `open-next.config.ts`.
- **`name` trong `wrangler.jsonc` phải trùng tên Worker trên dashboard (`savis`)**, và `services[WORKER_SELF_REFERENCE].service` cũng phải là tên đó. Sai một trong hai thì deploy lỗi `10143`.
- Workers Builds: Build command `npm run build`, Deploy command `npx wrangler deploy`; nhánh không phải production dùng `npx wrangler preview` (nên `wrangler.jsonc` có block `previews`). `npm run build` chạy OpenNext để tạo `.open-next/`; OpenNext tự gọi `npm run build:next` (`next build`). Vì vậy chạy `npm run build` tại máy cũng ghi đè `.next`: **tắt `npm run dev` trước khi build**.
- Khai báo biến môi trường ở **Settings → Build → Variables and secrets**: `PAYLOAD_URL`, `NEXT_PUBLIC_SITE_URL`, và `PAYLOAD_API_KEY` (secret, chỉ khi cần Draft). Production để `INSIGHTS_INCLUDE_DRAFTS=false`.
- Kiểm tra cấu hình mà không deploy: `npx wrangler deploy --dry-run`. Chạy thử trong Workers runtime: `npm run preview`.
- **Chưa có incremental cache (R2/KV):** ISR `revalidate = 60` chưa hoạt động. Trang đã prerender (`/vi`, `/en`) chỉ cập nhật khi deploy lại. Cần thêm R2 (hoặc KV) vào `open-next.config.ts` và `wrangler.jsonc` để nội dung CMS tự làm mới.
