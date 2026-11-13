import type { Locale } from "@/lib/i18n";

// Nội dung trang chủ, phương án C (design canvas "SAVIS Website Trang chủ", artboard Main-v3).
// Câu chữ EN lấy từ mockup. Bản VI là bản dịch nháp, cần BA rà soát trước khi công bố.
//
// Cổng duyệt nội dung: design system cấm placeholder và bằng chứng chưa duyệt trên production.
// Các cờ dưới đây mặc định false; chỉ bật khi doanh nghiệp xác nhận được phép công bố.
export const approval = {
  /** Tên khách hàng trong dải logo (NEAC, State Bank of Vietnam, NAPAS, Vietcombank, ...). */
  clientNames: false,
  /** Case study NEAC và hai case phụ (cần xác nhận tên khách hàng và câu bằng chứng PKI quốc gia). */
  caseStudies: false,
} as const;
// Số liệu "[XXX]+ khách hàng chính phủ và doanh nghiệp" trong mockup chưa có số thật nên không đưa vào `stats`.

export type PillarId = "identity" | "cyber" | "gov" | "finance" | "data";
export type CaseItem = { client: string; kicker: string; title: string; text: string };
export type Segment = { label: string; promise: string; proofs: string[]; cta: string };

export type HomeContent = {
  hero: {
    eyebrow: string; titleLead: string; titleAccent: string; lead: string;
    primary: string; secondary: string;
    phone: { title: string; badge: string; file: string; pages: string; kyc: string; kycMethod: string; hint: string; action: string };
    floatA: { title: string; sub: string };
    floatB: { title: string; sub: string };
  };
  stats: { value: string; label: string }[];
  trustedBy: string;
  clients: string[];
  solutions: { eyebrow: string; title: string; navLabel: string };
  pillars: { id: PillarId; eyebrow: string; name: string; text: string; tags: string[]; link: string }[];
  industries: { eyebrow: string; title: string; segments: Segment[] };
  customers: { eyebrow: string; title: string; all: string; read: string; cases: CaseItem[] };
  idFlow: { eyebrow: string; title: string; link: string; steps: { stage: string; title: string; description: string }[] };
  cta: { title: string; primary: string; secondary: string };
};

const en: HomeContent = {
  hero: {
    eyebrow: "Trusted digital infrastructure for a smarter world",
    titleLead: "Identity, trust and secure platforms",
    titleAccent: "for nations and enterprises.",
    lead: "Five solution pillars, delivered end to end — from consulting and integration to 24/7 operations — on core technology we design and build ourselves.",
    primary: "Explore Solutions",
    secondary: "Talk to an Expert",
    phone: { title: "Sign document", badge: "TrustCA", file: "Document.pdf", pages: "3 pages", kyc: "Smart eKYC", kycMethod: "Face + ID", hint: "Confirm with your fingerprint", action: "Sign with legal effect" },
    floatA: { title: "Identity verified", sub: "Smart eKYC: document and face" },
    floatB: { title: "Certificate valid", sub: "Remote Signing and Timestamp" },
  },
  stats: [
    { value: "5", label: "SAVIS solution pillars" },
    { value: "10", label: "offices worldwide" },
    { value: "22", label: "years of digital trust" },
  ],
  trustedBy: "Trusted by",
  clients: ["NEAC", "State Bank of Vietnam", "NAPAS", "Vietcombank", "Agribank", "VPBank", "Sacombank", "VIB"],
  solutions: { eyebrow: "Solutions & Products", title: "Five pillars. One trust ecosystem.", navLabel: "Solution pillars" },
  pillars: [
    { id: "identity", eyebrow: "Định danh số & Dịch vụ tin cậy", name: "Digital Identity & Trust", text: "Verify people, authenticate access and sign with legal certainty — from onboarding to qualified signatures.", tags: ["Digital ID", "National PKI", "TrustCA", "eSignature"], link: "Explore Digital Identity & Trust" },
    { id: "cyber", eyebrow: "An ninh mạng & Hạ tầng an toàn lượng tử", name: "Cybersecurity & Quantum-Safe Infrastructure", text: "Monitor threats, protect keys and data, and prepare cryptography for the post-quantum era.", tags: ["SOC", "GP HSM", "Zero Trust", "PQC"], link: "Explore Cybersecurity" },
    { id: "gov", eyebrow: "Chính phủ số & Hạ tầng thông minh", name: "Digital Government & Smart Infrastructure", text: "One-stop public services, citizen touchpoints and connected city infrastructure.", tags: ["mGov SuperApp", "eGate", "Smart City", "AI Camera"], link: "Explore Digital Government" },
    { id: "finance", eyebrow: "Tài chính mở & Giao dịch số an toàn", name: "Open Finance & Secure Digital Transactions", text: "Open APIs, customer consent and payment security for banks and financial institutions.", tags: ["Open Banking Suite", "Digital Banking", "eWallet", "eContract"], link: "Explore Open Finance" },
    { id: "data", eyebrow: "AI, Dữ liệu & Nền tảng số", name: "AI, Data & Digital Platforms", text: "Data platforms, trusted archives, intelligent documents and AI-native media operations.", tags: ["Data Lake", "Archive", "OCR", "CMS"], link: "Explore AI, Data & Platforms" },
  ],
  industries: {
    eyebrow: "Industries", title: "Built for the sectors that cannot fail.",
    segments: [
      { label: "Government & Public Sector", promise: "National PKI, citizen identity, digital public services and trusted records for ministries and provinces.", proofs: ["National PKI", "Digital ID Mobile Platform", "Digital ID Wallet"], cta: "Explore your industry" },
      { label: "Banking, Financial Services & Insurance", promise: "Bank CAs, onboarding, authentication, open APIs and payment security for regulated institutions.", proofs: ["PKI in a Box", "Signing Gateway", "TrustCA Remote Signing"], cta: "Explore your industry" },
    ],
  },
  customers: { eyebrow: "Customers", title: "Trust, deployed in production.", all: "View Success Stories", read: "Read the case study",
    cases: [
      { client: "NEAC", kicker: "National Trust Infrastructure", title: "Building Vietnam’s national PKI", text: "SAVIS designed and delivered the national public key infrastructure that anchors trust for Vietnam’s public digital signature ecosystem." },
      { client: "State Bank of Vietnam", kicker: "National Trust Infrastructure", title: "Root CA and issuing CA for the national payment system", text: "SAVIS built the Root CA and intermediate CA that secure interbank and national payment transactions for Vietnam’s central bank." },
      { client: "NEAC", kicker: "National Trust Infrastructure", title: "An international, WebTrust-grade CA for cross-border trust", text: "An international certification authority built to WebTrust requirements, so Vietnamese certificates can be recognised by Microsoft, Apple, Adobe and EU trust programmes." },
    ],
  },
  idFlow: {
    eyebrow: "Digital ID Mobile Platform", title: "From an ID card to a trusted identity on every phone.", link: "Explore the platform",
    steps: [
      { stage: "01 · ENROL", title: "Verify remotely", description: "Smart eKYC checks the document and the face." },
      { stage: "02 · ISSUE", title: "Put the ID on the phone", description: "Digital ID Wallet and Mobile Identity PKI." },
      { stage: "03 · AUTHENTICATE", title: "Log in without passwords", description: "IAM & CIAM, TrustPass and strong authentication." },
      { stage: "04 · SIGN", title: "Sign with legal effect", description: "TrustCA Remote Signing and Timestamp." },
    ],
  },
  cta: { title: "Talk to an Expert", primary: "Contact us", secondary: "Explore Solutions" },
};

const vi: HomeContent = {
  hero: {
    eyebrow: "Hạ tầng số tin cậy cho một thế giới thông minh hơn",
    titleLead: "Định danh, niềm tin và nền tảng an toàn",
    titleAccent: "cho quốc gia và doanh nghiệp.",
    lead: "Năm trụ cột giải pháp, triển khai trọn vẹn từ tư vấn, tích hợp đến vận hành 24/7, trên công nghệ lõi do chính SAVIS thiết kế và xây dựng.",
    primary: "Khám phá giải pháp",
    secondary: "Trao đổi với chuyên gia",
    phone: { title: "Ký tài liệu", badge: "TrustCA", file: "Document.pdf", pages: "3 trang", kyc: "Smart eKYC", kycMethod: "Khuôn mặt + CCCD", hint: "Xác nhận bằng vân tay", action: "Ký có giá trị pháp lý" },
    floatA: { title: "Đã xác minh danh tính", sub: "Smart eKYC: giấy tờ và khuôn mặt" },
    floatB: { title: "Chứng thư hợp lệ", sub: "Ký từ xa và dấu thời gian" },
  },
  stats: [
    { value: "5", label: "trụ cột giải pháp SAVIS" },
    { value: "10", label: "văn phòng trên thế giới" },
    { value: "22", label: "năm xây dựng niềm tin số" },
  ],
  trustedBy: "Được tin dùng bởi",
  clients: en.clients,
  solutions: { eyebrow: "Giải pháp & Sản phẩm", title: "Năm trụ cột. Một hệ sinh thái tin cậy.", navLabel: "Các trụ cột giải pháp" },
  pillars: [
    { id: "identity", eyebrow: "Digital Identity & Trust", name: "Định danh số & Dịch vụ tin cậy", text: "Xác minh con người, xác thực truy cập và ký với giá trị pháp lý, từ đăng ký khách hàng đến chữ ký số công cộng.", tags: en.pillars[0].tags, link: "Khám phá Định danh số & Dịch vụ tin cậy" },
    { id: "cyber", eyebrow: "Cybersecurity & Quantum-Safe", name: "An ninh mạng & Hạ tầng an toàn lượng tử", text: "Giám sát mối đe dọa, bảo vệ khoá và dữ liệu, chuẩn bị mật mã cho kỷ nguyên hậu lượng tử.", tags: en.pillars[1].tags, link: "Khám phá An ninh mạng" },
    { id: "gov", eyebrow: "Digital Government & Smart Infrastructure", name: "Chính phủ số & Hạ tầng thông minh", text: "Dịch vụ công một cửa, điểm chạm với người dân và hạ tầng đô thị kết nối.", tags: en.pillars[2].tags, link: "Khám phá Chính phủ số" },
    { id: "finance", eyebrow: "Open Finance & Secure Transactions", name: "Tài chính mở & Giao dịch số an toàn", text: "API mở, quản lý sự đồng ý của khách hàng và bảo mật thanh toán cho ngân hàng và tổ chức tài chính.", tags: en.pillars[3].tags, link: "Khám phá Tài chính mở" },
    { id: "data", eyebrow: "AI, Data & Digital Platforms", name: "AI, Dữ liệu & Nền tảng số", text: "Nền tảng dữ liệu, lưu trữ tin cậy, tài liệu thông minh và vận hành truyền thông ứng dụng AI.", tags: en.pillars[4].tags, link: "Khám phá AI, Dữ liệu & Nền tảng" },
  ],
  industries: {
    eyebrow: "Lĩnh vực", title: "Dành cho những lĩnh vực không được phép gián đoạn.",
    segments: [
      { label: "Chính phủ & Khu vực công", promise: "PKI quốc gia, định danh công dân, dịch vụ công số và hồ sơ tin cậy cho các bộ ngành và địa phương.", proofs: en.industries.segments[0].proofs, cta: "Khám phá lĩnh vực" },
      { label: "Ngân hàng, Tài chính & Bảo hiểm", promise: "CA ngân hàng, định danh khách hàng, xác thực, API mở và bảo mật thanh toán cho các tổ chức chịu quản lý chặt chẽ.", proofs: en.industries.segments[1].proofs, cta: "Khám phá lĩnh vực" },
    ],
  },
  customers: { eyebrow: "Khách hàng", title: "Niềm tin được triển khai trong thực tế.", all: "Xem các câu chuyện thành công", read: "Đọc case study",
    cases: [
      { client: "NEAC", kicker: "Hạ tầng tin cậy quốc gia", title: "Xây dựng PKI quốc gia của Việt Nam", text: "SAVIS thiết kế và triển khai hạ tầng khoá công khai quốc gia, làm điểm neo niềm tin cho hệ sinh thái chữ ký số công cộng của Việt Nam." },
      { client: "Ngân hàng Nhà nước Việt Nam", kicker: "Hạ tầng tin cậy quốc gia", title: "Root CA và CA cấp phát cho hệ thống thanh toán quốc gia", text: "SAVIS xây dựng Root CA và CA trung gian bảo mật các giao dịch liên ngân hàng và thanh toán quốc gia của ngân hàng trung ương." },
      { client: "NEAC", kicker: "Hạ tầng tin cậy quốc gia", title: "CA quốc tế đạt chuẩn WebTrust cho niềm tin xuyên biên giới", text: "CA quốc tế xây dựng theo yêu cầu WebTrust để chứng thư số Việt Nam được các chương trình tin cậy của Microsoft, Apple, Adobe và EU công nhận." },
    ],
  },
  idFlow: {
    eyebrow: "Digital ID Mobile Platform", title: "Từ thẻ căn cước đến danh tính tin cậy trên mọi chiếc điện thoại.", link: "Khám phá nền tảng",
    steps: [
      { stage: "01 · ĐĂNG KÝ", title: "Xác minh từ xa", description: "Smart eKYC kiểm tra giấy tờ và khuôn mặt." },
      { stage: "02 · CẤP PHÁT", title: "Đưa danh tính lên điện thoại", description: "Digital ID Wallet và Mobile Identity PKI." },
      { stage: "03 · XÁC THỰC", title: "Đăng nhập không cần mật khẩu", description: "IAM & CIAM, TrustPass và xác thực mạnh." },
      { stage: "04 · KÝ", title: "Ký có giá trị pháp lý", description: "TrustCA Remote Signing và Timestamp." },
    ],
  },
  cta: { title: "Trao đổi với chuyên gia", primary: "Liên hệ", secondary: "Khám phá giải pháp" },
};

export const homeContent: Record<Locale, HomeContent> = { en, vi };
