import type { Locale } from "@/lib/i18n";

// Nội dung trang chủ, phương án C (design canvas "SAVIS Website Trang chủ", artboard Main-v3, bản cập nhật 14/11/2026).
// Câu chữ EN lấy từ mockup. Bản VI là bản dịch nháp, cần BA rà soát trước khi công bố.
//
// Cổng duyệt nội dung: design system cấm placeholder và bằng chứng chưa duyệt trên production.
// Cờ dưới đây mặc định false; chỉ bật khi doanh nghiệp xác nhận được phép công bố.
export const approval = {
  /** Case study NEAC và hai case phụ. Đã bật theo yêu cầu của DN ngày 14/11/2026 (hiển thị khối "Trusted partnerships, proven results"). */
  caseStudies: true,
} as const;

export type PillarId = "identity" | "cyber" | "gov" | "finance" | "data";
export type CaseItem = { client: string; clientFull?: string; kicker: string; title: string; text: string };
export type FeaturedIndustry = { path: string; name: string; pitch: string; products: string[] };

export type HomeContent = {
  hero: {
    eyebrow: string; primary: string; secondary: string;
    carousel: { label: string; slide: string; pause: string; play: string };
    main: { title: string };
    egov: { title: string; accent: string; sub: string; chip: string; visualTitle: string };
    trustca: { title: string; accent: string; lead: string; sub: string; chips: string[]; visualLines: string[] };
    phone: { title: string; badge: string; file: string; pages: string; kyc: string; kycMethod: string; hint: string; action: string };
    floatA: { title: string; sub: string };
    floatB: { title: string; sub: string };
  };
  stats: { value: string; label: string }[];
  solutions: { eyebrow: string; title: string; navLabel: string };
  /** `link` là nhãn CTA của thẻ trụ cột trong mega menu. */
  pillars: { id: PillarId; name: string; text: string; tags: string[]; link: string }[];
  industries: { eyebrow: string; title: string; all: string; cardCta: string; other: string; featured: FeaturedIndustry[] };
  presence: { eyebrow: string; title: string; about: string };
  customers: { eyebrow: string; title: string; all: string; read: string; cases: CaseItem[] };
};

const en: HomeContent = {
  hero: {
    eyebrow: "Trusted digital infrastructure for a smarter world",
    primary: "Explore Solutions",
    secondary: "Talk to our Expert",
    carousel: { label: "Highlights", slide: "Slide", pause: "Pause slides", play: "Play slides" },
    main: { title: "SAVIS delivers Make-in-Vietnam technology that meets the world’s most rigorous standards" },
    egov: { title: "SAVIS eGov Super App - Smart City", accent: "ASOCIO Award Winner", sub: "A leading smart city solution provider in Vietnam", chip: "ASOCIO Award", visualTitle: "SAVIS eGov Super App" },
    trustca: {
      title: "TrustCA Remote Signing and", accent: "TrustCA Timestamp",
      lead: "Officially meet the latest eIDAS 2.0 and NIS2 requirements",
      sub: "SAVIS reaffirms its pioneering role in delivering digital trust services in Vietnam",
      chips: ["eIDAS 2.0", "NIS2"], visualLines: ["TrustCA Remote Signing", "TrustCA Timestamp"],
    },
    phone: { title: "Sign document", badge: "TrustCA", file: "Document.pdf", pages: "3 pages", kyc: "Smart eKYC", kycMethod: "Face + ID", hint: "Confirm with your fingerprint", action: "Sign with legal effect" },
    floatA: { title: "Identity verified", sub: "Smart eKYC: document and face" },
    floatB: { title: "Certificate valid", sub: "Remote Signing and Timestamp" },
  },
  stats: [
    { value: "22+", label: "years" },
    { value: "200+", label: "international partners" },
    { value: "5,000+", label: "customers" },
  ],
  solutions: { eyebrow: "Solutions & Products", title: "SAVIS - Your Trusted Partner", navLabel: "Solution pillars" },
  pillars: [
    { id: "identity", name: "Digital Identity & Trust", text: "Verify people, authenticate access and sign with legal certainty — from onboarding to qualified signatures.", tags: ["Digital ID", "ID Verification", "FIDO2", "National PKI", "TrustCA", "eSignature", "Fraud"], link: "Explore Digital Identity & Trust" },
    { id: "cyber", name: "Cybersecurity & Quantum-Safe Infrastructure", text: "Monitor threats, protect keys and data, and prepare cryptography for the post-quantum era.", tags: ["SOC", "GP HSM", "KMS", "Zero Trust", "Enterprise Browser", "Quantum Safe Gateway", "Crypto Agility", "PQC"], link: "Explore Cybersecurity" },
    { id: "gov", name: "Digital Government & Smart Infrastructure", text: "One-stop public services, citizen touchpoints and connected city infrastructure.", tags: ["mGov SuperApp", "eGate", "Smart Kiosk", "Smart City", "AI Camera", "IoT Security"], link: "Explore Digital Government" },
    { id: "finance", name: "Open Finance & Secure Digital Transactions", text: "Open APIs, customer consent and payment security for banks and financial institutions.", tags: ["Open Banking Suite", "Digital Banking", "eWallet", "Transaction Signing", "3DS", "Tokenization", "eContract"], link: "Explore Open Finance" },
    { id: "data", name: "AI, Data & Digital Platforms", text: "Data platforms, trusted archives, intelligent documents and AI-native media operations.", tags: ["Data Lake", "Archive", "OCR", "BPM", "CMS AI", "MAM", "Healthcare", "Cloud"], link: "Explore AI, Data & Platforms" },
  ],
  industries: {
    eyebrow: "Industries", title: "Driving Digital Transformation Across Every Sector",
    all: "Explore your industry", cardCta: "Explore this industry", other: "Other industries",
    featured: [
      { path: "/industries/government", name: "Government & Public Sector", pitch: "National PKI, citizen identity, digital public services and trusted records for ministries and provinces.", products: ["National PKI", "Digital ID Mobile Platform", "Digital ID Wallet"] },
      { path: "/industries/bfsi", name: "Banking, Financial Services & Insurance", pitch: "Bank CAs, onboarding, authentication, open APIs and payment security for regulated institutions.", products: ["PKI in a Box", "Signing Gateway", "TrustCA Remote Signing"] },
    ],
  },
  presence: { eyebrow: "Global presence", title: "Ten offices across four continents. One trust ecosystem.", about: "About SAVIS" },
  customers: { eyebrow: "Trusted partnerships, proven results", title: "Success Stories from SAVIS Customers", all: "View Success Stories", read: "Read the case study",
    cases: [
      { client: "NEAC", clientFull: "National Electronic Authentication Centre, Vietnam", kicker: "National Trust Infrastructure", title: "Vietnam National Root CA", text: "SAVIS designed and delivered the Vietnam National Root CA — the root of trust that anchors every public digital signature certificate in the country." },
      { client: "NEAC", kicker: "National Trust Infrastructure", title: "An international, WebTrust-grade CA for cross-border trust", text: "An international certification authority built to WebTrust requirements, so Vietnamese certificates can be recognised by Microsoft, Apple, Adobe and EU trust programmes." },
      { client: "State Bank of Vietnam", kicker: "National Trust Infrastructure", title: "Root CA and issuing CA for the national payment system", text: "SAVIS built the Root CA and intermediate CA that secure interbank and national payment transactions for Vietnam’s central bank." },
    ],
  },
};

const vi: HomeContent = {
  hero: {
    eyebrow: "Hạ tầng số tin cậy cho một thế giới thông minh hơn",
    primary: "Khám phá giải pháp",
    secondary: "Trao đổi với chuyên gia",
    carousel: { label: "Nổi bật", slide: "Banner", pause: "Tạm dừng banner", play: "Chạy banner" },
    main: { title: "SAVIS mang đến công nghệ Make in Vietnam đáp ứng những tiêu chuẩn khắt khe nhất thế giới" },
    egov: { title: "SAVIS eGov Super App - Smart City", accent: "Giải thưởng ASOCIO", sub: "Nhà cung cấp giải pháp đô thị thông minh hàng đầu tại Việt Nam", chip: "Giải thưởng ASOCIO", visualTitle: "SAVIS eGov Super App" },
    trustca: {
      title: "TrustCA Remote Signing và", accent: "TrustCA Timestamp",
      lead: "Chính thức đáp ứng các yêu cầu mới nhất của eIDAS 2.0 và NIS2",
      sub: "SAVIS khẳng định vai trò tiên phong trong cung cấp dịch vụ tin cậy số tại Việt Nam",
      chips: en.hero.trustca.chips, visualLines: en.hero.trustca.visualLines,
    },
    phone: { title: "Ký tài liệu", badge: "TrustCA", file: "Document.pdf", pages: "3 trang", kyc: "Smart eKYC", kycMethod: "Khuôn mặt + CCCD", hint: "Xác nhận bằng vân tay", action: "Ký có giá trị pháp lý" },
    floatA: { title: "Đã xác minh danh tính", sub: "Smart eKYC: giấy tờ và khuôn mặt" },
    floatB: { title: "Chứng thư hợp lệ", sub: "Ký từ xa và dấu thời gian" },
  },
  stats: [
    { value: "22+", label: "năm" },
    { value: "200+", label: "đối tác quốc tế" },
    { value: "5.000+", label: "khách hàng" },
  ],
  solutions: { eyebrow: "Giải pháp & Sản phẩm", title: "SAVIS - Đối tác tin cậy của bạn", navLabel: "Các trụ cột giải pháp" },
  pillars: [
    { id: "identity", name: "Định danh số & Dịch vụ tin cậy", text: "Xác minh con người, xác thực truy cập và ký với giá trị pháp lý, từ đăng ký khách hàng đến chữ ký số công cộng.", tags: en.pillars[0].tags, link: "Khám phá Định danh số & Dịch vụ tin cậy" },
    { id: "cyber", name: "An ninh mạng & Hạ tầng an toàn lượng tử", text: "Giám sát mối đe dọa, bảo vệ khoá và dữ liệu, chuẩn bị mật mã cho kỷ nguyên hậu lượng tử.", tags: en.pillars[1].tags, link: "Khám phá An ninh mạng" },
    { id: "gov", name: "Chính phủ số & Hạ tầng thông minh", text: "Dịch vụ công một cửa, điểm chạm với người dân và hạ tầng đô thị kết nối.", tags: en.pillars[2].tags, link: "Khám phá Chính phủ số" },
    { id: "finance", name: "Tài chính mở & Giao dịch số an toàn", text: "API mở, quản lý sự đồng ý của khách hàng và bảo mật thanh toán cho ngân hàng và tổ chức tài chính.", tags: en.pillars[3].tags, link: "Khám phá Tài chính mở" },
    { id: "data", name: "AI, Dữ liệu & Nền tảng số", text: "Nền tảng dữ liệu, lưu trữ tin cậy, tài liệu thông minh và vận hành truyền thông ứng dụng AI.", tags: en.pillars[4].tags, link: "Khám phá AI, Dữ liệu & Nền tảng" },
  ],
  industries: {
    eyebrow: "Lĩnh vực", title: "Thúc đẩy chuyển đổi số trên mọi lĩnh vực",
    all: "Tìm lĩnh vực của bạn", cardCta: "Khám phá lĩnh vực này", other: "Lĩnh vực khác",
    featured: [
      { path: "/industries/government", name: "Chính phủ & Khu vực công", pitch: "PKI quốc gia, định danh công dân, dịch vụ công số và hồ sơ tin cậy cho các bộ ngành và địa phương.", products: en.industries.featured[0].products },
      { path: "/industries/bfsi", name: "Ngân hàng, Tài chính & Bảo hiểm", pitch: "CA ngân hàng, định danh khách hàng, xác thực, API mở và bảo mật thanh toán cho các tổ chức chịu quản lý chặt chẽ.", products: en.industries.featured[1].products },
    ],
  },
  presence: { eyebrow: "Hiện diện toàn cầu", title: "Mười văn phòng trên bốn châu lục. Một hệ sinh thái tin cậy.", about: "Về SAVIS" },
  customers: { eyebrow: "Hợp tác tin cậy, kết quả đã được chứng minh", title: "Câu chuyện thành công từ khách hàng của SAVIS", all: "Xem các câu chuyện thành công", read: "Đọc case study",
    cases: [
      { client: "NEAC", clientFull: "Trung tâm Chứng thực điện tử quốc gia, Việt Nam", kicker: "Hạ tầng tin cậy quốc gia", title: "Root CA quốc gia của Việt Nam", text: "SAVIS thiết kế và triển khai Root CA quốc gia của Việt Nam, gốc tin cậy cho mọi chứng thư chữ ký số công cộng trong nước." },
      { client: "NEAC", kicker: "Hạ tầng tin cậy quốc gia", title: "CA quốc tế đạt chuẩn WebTrust cho niềm tin xuyên biên giới", text: "CA quốc tế xây dựng theo yêu cầu WebTrust để chứng thư số Việt Nam được các chương trình tin cậy của Microsoft, Apple, Adobe và EU công nhận." },
      { client: "Ngân hàng Nhà nước Việt Nam", kicker: "Hạ tầng tin cậy quốc gia", title: "Root CA và CA cấp phát cho hệ thống thanh toán quốc gia", text: "SAVIS xây dựng Root CA và CA trung gian bảo mật các giao dịch liên ngân hàng và thanh toán quốc gia của ngân hàng trung ương." },
    ],
  },
};

export const homeContent: Record<Locale, HomeContent> = { en, vi };
