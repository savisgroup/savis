import type { Locale } from "@/lib/i18n";
import { homeContent, type PillarId } from "@/content/home";

// Mega menu theo "SAVIS Web V3 – Sitemap & nội dung" (bản 13/11/2026), phần 2.2.
// Đã bỏ các mục gạch đỏ trong tài liệu: Open Finance API, GO Invoice, SAVIS Media Hub, nhóm Digital Radio & Broadcasting.
// URL lấy đúng theo cây trang (không có dấu "/" cuối). Trang chưa dựng thì dùng `fallback` (neo trên trang chủ) nếu có,
// nếu không thì mục hiện dạng chữ, không phải link, để không dẫn vào 404. Dựng xong trang nào thì thêm đường dẫn vào BUILT_PATHS.
// Bản tiếng Việt của nhãn nhóm, mô tả là bản nháp, cần BA duyệt. Tên sản phẩm giữ nguyên tiếng Anh.

type Text = Record<Locale, string>;
const same = (s: string): Text => ({ en: s, vi: s });

export type NavItem = { label: Text; desc?: Text; path: string; fallback?: string };
export type ProductGroup = { label: string; items: NavItem[] };
export type PillarMenu = { id: PillarId; desc: Text; path: string; fallback: string; groups: ProductGroup[] };
export type SimpleMenu = { id: string; label: Text; eyebrow: Text; title: Text; cta: NavItem; items: NavItem[] };

const BUILT_PATHS = new Set<string>(["/insights"]);

/** Trả về href đầy đủ theo ngôn ngữ, hoặc null nếu trang đích chưa có. */
export function resolveHref(locale: Locale, item: Pick<NavItem, "path" | "fallback">): string | null {
  const base = item.path.split(/[?#]/)[0];
  if (BUILT_PATHS.has(base)) return `/${locale}${item.path}`;
  return item.fallback ? `/${locale}${item.fallback}` : null;
}

// ---------- Solutions & Products ----------
type P = [name: string, slug: string];
const group = (pillar: string, slug: string, label: string, products: P[], extra: NavItem[] = []): ProductGroup => ({
  label,
  items: [...products.map(([name, s]) => ({ label: same(name), path: `/solutions/${pillar}/${slug}/${s}` })), ...extra],
});

const ID = "digital-identity-trust";
const CY = "cybersecurity-quantum-safe";
const GOV = "digital-government-smart-infrastructure";
const FIN = "open-finance-secure-transactions";
const AI = "ai-data-platforms";

const smartKiosk: NavItem = { label: same("Smart Kiosk"), path: `/solutions/${GOV}/citizen-services/smart-kiosk` };

export const pillarMenus: PillarMenu[] = [
  {
    id: "identity", path: `/solutions/${ID}`, fallback: "#pillar-identity",
    desc: { en: "Verify, authenticate and sign with legal certainty.", vi: "Xác minh, xác thực và ký số có giá trị pháp lý." },
    groups: [
      group(ID, "digital-identity", "Digital Identity & Verification", [
        ["Digital ID Mobile Platform", "digital-id-mobile"], ["ID Verification", "id-verification"], ["Smart eKYC", "smart-ekyc"],
        ["VNeID Integration", "vneid-integration"], ["Digital ID Wallet", "digital-id-wallet"],
        ["Decentralized Identity (DID)", "decentralized-identity"], ["Mobile Identity PKI", "mobile-pki-identity"],
      ], [smartKiosk]),
      group(ID, "authentication-access", "Authentication & Access", [
        ["FIDO2 Passwordless Identity", "passwordless"], ["Mobile Identity SCA", "mobile-identity-sca"], ["SmartOTP+", "smart-otp-plus"],
        ["IAM & CIAM", "iam-ciam"], ["Credential Management", "credential-management"], ["TrustPass Authentication", "trustpass"],
      ]),
      group(ID, "secure-credentials", "Secure Credentials & Tokens", [
        ["PKI Token", "pki-token"], ["Smart Card PIV", "smart-card-piv"], ["Crypto Bio Token", "crypto-bio-token"], ["Smart Virtual Card", "smart-virtual-card"],
      ]),
      group(ID, "pki-infrastructure", "PKI Infrastructure", [
        ["National PKI", "national-pki"], ["PKI in a Box", "pki-in-a-box"], ["Timestamp Authority (TSA)", "timestamp-tsa"],
        ["Signing Gateway", "signing-gateway"], ["Signing Server", "signing-server"],
      ]),
      group(ID, "trust-services", "Trust Services · TrustCA QTSP eIDAS 2.0", [
        ["TrustCA Remote Signing", "remote-signing"], ["TrustCA Timestamp", "trustca-timestamp"], ["TrustCA HSM Certificate", "hsm-certificate"],
        ["TrustCA eKYC Biometric", "trustca-ekyc-biometric"], ["SAVIS ePaperless", "epaperless"], ["TrustCA VA/RA", "trustca-va-ra"], ["SAVIS eCertify", "ecertify"],
      ]),
      group(ID, "trust-readiness", "Trust Compliance & Readiness", [["WebTrust Readiness", "webtrust-readiness"], ["eIDAS 2.0 Readiness", "eidas-readiness"]]),
      group(ID, "fraud-app-protection", "Fraud & App Protection", [
        ["Fraud Prevention & Risk Management", "fraud-prevention"], ["Device Intelligence", "device-intelligence"],
        ["Device Fingerprint SDK", "device-fingerprint-sdk"], ["RASP+", "rasp-plus"], ["TrustShield", "trustshield"],
      ]),
    ],
  },
  {
    id: "cyber", path: `/solutions/${CY}`, fallback: "#pillar-cyber",
    desc: { en: "SOC, key management, zero trust and post-quantum.", vi: "SOC, quản lý khoá, zero trust và hậu lượng tử." },
    groups: [
      group(CY, "security-operations", "Security Operations", [["SAVIS SOC", "savis-soc"], ["SAVIS Cyber Security", "cyber-security"]]),
      group(CY, "key-management", "Cryptography & Key Management", [
        ["SAM Appliance", "sam-appliance"], ["GP HSM", "gp-hsm"], ["Key Management System (KMS)", "kms"], ["HSM as a Service", "hsm-as-a-service"],
      ]),
      group(CY, "zero-trust", "Zero Trust & Network Security", [["Zero Trust Gateway Appliance", "zero-trust-gateway"], ["Secure Enterprise Browser", "secure-enterprise-browser"]]),
      group(CY, "quantum-safe", "Quantum-Safe Security", [
        ["Quantum Safe Gateway", "quantum-safe-gateway"], ["Quantum Vault", "quantum-vault"], ["Quantum Safe Storage", "quantum-safe-storage"],
        ["Crypto Agility", "crypto-agility"], ["Quantum Readiness Program", "quantum-readiness"], ["PQC Suite", "pqc-suite"],
        ["QKD", "qkd"], ["Quantum Communication", "quantum-communication"],
      ]),
      group(CY, "data-security", "Data Security", [["Data Encryption & Protection", "data-encryption"]]),
    ],
  },
  {
    id: "gov", path: `/solutions/${GOV}`, fallback: "#pillar-gov",
    desc: { en: "Public services, citizen touchpoints, smart city.", vi: "Dịch vụ công, điểm chạm người dân, đô thị thông minh." },
    groups: [
      group(GOV, "digital-government", "Digital Government Platforms", [
        ["SAVIS eGate", "egate"], ["SAVIS DEP", "dep"], ["Super App Mobile Gov", "super-app-mobile-gov"], ["One-Stop-Shop", "one-stop-shop"],
      ]),
      group(GOV, "citizen-services", "Citizen Service Touchpoints", [["Smart Kiosk", "smart-kiosk"]]),
      group(GOV, "smart-city", "Smart City", [["Smart City Solution", "smart-city"], ["AI Camera Security", "ai-camera"]]),
      group(GOV, "iot", "IoT, Mobility & Connected Devices", [["IoT Devices", "iot-devices"], ["IoT Device Security", "iot-device-security"], ["Digital Car Key", "digital-car-key"]]),
    ],
  },
  {
    id: "finance", path: `/solutions/${FIN}`, fallback: "#pillar-finance",
    desc: { en: "Open APIs, customer consent and payment security.", vi: "API mở, quản lý đồng ý và bảo mật thanh toán." },
    groups: [
      group(FIN, "open-finance", "Open Banking Suite", [
        ["API Management Suite", "api-management-suite"], ["Enterprise DMS", "enterprise-dms"], ["Open Banking Portal", "open-banking-portal"],
        ["Consent Management", "consent-management"], ["TPP Manager", "tpp-manager"],
      ]),
      group(FIN, "payment-security", "Payment & Transaction Security", [
        ["API Security & Transaction Signing", "api-security-transaction-signing"], ["3D Secure 2.0", "3d-secure"], ["Tokenization", "tokenization"],
        ["Payment HSM", "payment-hsm"], ["Palm Biometric Payment", "palm-biometric-payment"],
      ]),
      group(FIN, "digital-banking", "Digital Banking", [["Digital Banking Platform", "digital-banking-platform"], ["Mobile eWallet", "mobile-ewallet"]]),
      group(FIN, "digital-agreements", "Digital Agreements", [["Smart eContract", "econtract"]]),
      group(FIN, "digital-assets", "Digital Assets", [
        ["Blockchain Framework", "blockchain-framework"], ["Stablecoin Platform", "stablecoin"], ["CBDC Platform", "cbdc"],
        ["RWA Tokenization", "rwa-tokenization"], ["Crypto Wallet & Custody", "crypto-custody"],
      ]),
    ],
  },
  {
    // Trang chủ chưa có hàng riêng cho trụ cột 5 nên neo về đầu khối giải pháp.
    id: "data", path: `/solutions/${AI}`, fallback: "#solutions",
    desc: { en: "Data, archives, intelligent documents and AI media.", vi: "Dữ liệu, lưu trữ, tài liệu thông minh và truyền thông AI." },
    groups: [
      group(AI, "data-analytics", "Data & Analytics", [["Data Lake & BI", "data-lake-bi"], ["AI KPI", "ai-kpi"], ["CDP 360 Big Data", "cdp-360"], ["SAVIS MDM", "savis-mdm"]]),
      group(AI, "records-archiving", "Records & Archiving", [["Trusted Archive 2.0", "trusted-archive"], ["eArchive Box", "earchive-box"]]),
      group(AI, "intelligent-documents", "Intelligent Documents", [
        ["Smart OCR", "smart-ocr"], ["BPM Paperless", "bpm-paperless"], ["Smart eForm", "smart-eform"], ["AI & Intelligent Automation", "ai-automation"],
      ]),
      group(AI, "media-platforms", "Media Platforms", [
        ["MRP AI", "mrp-ai"], ["CMS AI Hub", "cms-ai-hub"], ["MAM Intelligent Automation", "mam-intelligent-automation"], ["PPM Media", "ppm-media"],
        ["Converged Newsroom", "converged-newsroom"], ["Smart Virtual Studio", "virtual-studio"], ["Media SuperApp & Mini Apps", "media-superapp"],
        ["Playout & CG", "playout-cg"], ["Forensic Watermarking & Multi-DRM", "forensic-watermarking"],
      ]),
      group(AI, "healthcare-cloud", "Healthcare & Cloud Platforms", [["SAVIS Open Healthcare", "savis-open-healthcare"], ["Cloud Application Platform", "cloud-app-platform"]]),
    ],
  },
];

export const solutionsMenu = {
  label: { en: "Solutions & Products", vi: "Giải pháp & Sản phẩm" } as Text,
  catalogue: { label: { en: "All solutions & product catalogue", vi: "Toàn bộ giải pháp & danh mục sản phẩm" }, path: "/solutions", fallback: "#solutions" } as NavItem,
};

/** Tên, mô tả dài và nhãn CTA của trụ cột lấy từ nội dung trang chủ để hai nơi không lệch nhau. */
export const pillarCopy = (locale: Locale, id: PillarId) => {
  const p = homeContent[locale].pillars.find((x) => x.id === id);
  if (!p) throw new Error(`Missing pillar copy: ${id}`);
  return p;
};

// ---------- Các menu đơn ----------
const item = (en: string, vi: string, descEn: string, descVi: string, path: string, fallback?: string): NavItem => ({
  label: { en, vi }, desc: { en: descEn, vi: descVi }, path, fallback,
});

export const simpleMenus: SimpleMenu[] = [
  {
    id: "industries", label: { en: "Industries", vi: "Lĩnh vực" }, eyebrow: { en: "Industries", vi: "Lĩnh vực" },
    title: { en: "Solutions shaped by sector.", vi: "Giải pháp theo từng lĩnh vực." },
    cta: { label: { en: "Explore your industry", vi: "Tìm lĩnh vực của bạn" }, path: "/industries", fallback: "#industries" },
    items: [
      item("Government & Public Sector", "Chính phủ & Khu vực công", "National PKI, citizen identity, public services", "PKI quốc gia, định danh công dân, dịch vụ công", "/industries/government", "#industries"),
      item("Banking, Financial Services & Insurance", "Ngân hàng, Tài chính & Bảo hiểm", "Bank CAs, onboarding, open APIs, payment security", "CA ngân hàng, eKYC, API mở, bảo mật thanh toán", "/industries/bfsi", "#industries"),
      item("Trust Service Providers & CAs", "Nhà cung cấp dịch vụ tin cậy & CA", "CA, RA, VA, TSA, remote signing, audit readiness", "CA, RA, VA, TSA, ký số từ xa, sẵn sàng kiểm định", "/industries/trust-providers"),
      item("Payments & Fintech", "Thanh toán & Fintech", "Open banking hubs, tokenization, payment HSMs", "Open banking hub, token hoá, HSM thanh toán", "/industries/payments"),
      item("Telecommunications", "Viễn thông", "Mobile PKI, subscriber signing, SIM-swap defence", "PKI di động, ký số thuê bao, chống chiếm SIM", "/industries/telco"),
      item("Enterprise", "Doanh nghiệp", "Zero-trust access, signing, security operations", "Truy cập zero trust, ký số, vận hành an ninh", "/industries/enterprise"),
      item("Energy & Utilities", "Năng lượng & Tiện ích", "Smart meters, OT networks, quantum-safe links", "Công tơ thông minh, mạng OT, kết nối an toàn lượng tử", "/industries/energy-utilities"),
      item("Automotive & Mobility", "Ô tô & Di chuyển", "Digital car keys, vehicle PKI, secure OTA", "Chìa khoá số, PKI phương tiện, cập nhật OTA an toàn", "/industries/automotive"),
      item("Transport & Logistics", "Giao thông & Logistics", "Checkpoint identity, AI cameras, e-documents", "Định danh tại điểm kiểm soát, camera AI, chứng từ số", "/industries/transport"),
      item("Retail & eCommerce", "Bán lẻ & Thương mại điện tử", "Fraud-resistant checkout, wallets, biometric pay", "Thanh toán chống gian lận, ví, thanh toán sinh trắc", "/industries/retail"),
      item("Education", "Giáo dục", "Student ID, digital diplomas, campus access", "Thẻ sinh viên số, văn bằng số, ra vào khuôn viên", "/industries/education"),
      item("Healthcare", "Y tế", "Signed medical records, protected patient data", "Bệnh án ký số, bảo vệ dữ liệu bệnh nhân", "/industries/healthcare"),
      item("Media & Broadcasting", "Truyền thông & Phát thanh truyền hình", "AI-native newsrooms and broadcast platforms", "Toà soạn ứng dụng AI và nền tảng phát sóng", "/industries/media"),
    ],
  },
  {
    id: "use-cases", label: { en: "Use Cases", vi: "Tình huống ứng dụng" }, eyebrow: { en: "Use cases", vi: "Tình huống ứng dụng" },
    title: { en: "See how it works, step by step.", vi: "Xem giải pháp vận hành, từng bước." },
    cta: { label: { en: "All use cases", vi: "Tất cả tình huống" }, path: "/use-cases" },
    items: [
      item("Remote customer onboarding", "Mở tài khoản từ xa", "Chip-verified ID and live selfie in minutes.", "Xác thực CCCD gắn chip và selfie trong vài phút.", "/use-cases/remote-onboarding"),
      item("Sign a contract remotely", "Ký hợp đồng từ xa", "Qualified signatures from any phone.", "Chữ ký số đủ điều kiện ngay trên điện thoại.", "/use-cases/remote-signing"),
      item("National root of trust", "Hạ tầng tin cậy quốc gia", "Root CA, RA, VA and TSA operations.", "Vận hành Root CA, RA, VA và TSA.", "/use-cases/national-root-ca"),
      item("Open banking with consent", "Open banking có sự đồng ý", "Circular 64 and PSD2 third-party access.", "Truy cập bên thứ ba theo Thông tư 64 và PSD2.", "/use-cases/open-banking"),
      item("Zero-trust access", "Truy cập zero trust", "Verify user, device and policy every time.", "Kiểm tra người dùng, thiết bị, chính sách mỗi lần.", "/use-cases/zero-trust"),
      item("Post-quantum migration", "Chuyển đổi hậu lượng tử", "Discover, rank and migrate to hybrid PQC.", "Kiểm kê, ưu tiên và chuyển sang PQC lai.", "/use-cases/pqc-migration"),
    ],
  },
  {
    id: "services", label: { en: "Services", vi: "Dịch vụ" }, eyebrow: { en: "Services", vi: "Dịch vụ" },
    title: { en: "From strategy to 24/7 operations.", vi: "Từ chiến lược đến vận hành 24/7." },
    cta: { label: { en: "Talk to an expert", vi: "Trao đổi với chuyên gia" }, path: "/contact", fallback: "#contact" },
    items: [
      item("Consulting", "Tư vấn", "Regulation, architecture and trust roadmaps.", "Quy định, kiến trúc và lộ trình tin cậy số.", "/services"),
      item("Readiness Programs", "Chương trình sẵn sàng", "WebTrust, eIDAS 2.0 and quantum readiness.", "Sẵn sàng WebTrust, eIDAS 2.0 và lượng tử.", `/solutions/${ID}`, "#pillar-identity"),
      item("System Integration", "Tích hợp hệ thống", "Connect identity, PKI and platforms to core systems.", "Kết nối định danh, PKI, nền tảng với hệ thống lõi.", "/services"),
      item("Software Engineering", "Phát triển phần mềm", "Custom platforms built on SAVIS technology.", "Nền tảng riêng trên công nghệ SAVIS.", "/services"),
      item("Data Centre & Infrastructure", "Trung tâm dữ liệu & Hạ tầng", "Design, build, migrate and operate data centres.", "Thiết kế, xây dựng, chuyển đổi, vận hành TTDL.", "/services"),
      item("Digitisation & Data", "Số hoá & Dữ liệu", "Digitise archives; extract and protect data.", "Số hoá lưu trữ, trích xuất và bảo vệ dữ liệu.", "/services"),
      item("Managed Services", "Dịch vụ vận hành", "Operate and support critical services 24/7.", "Vận hành, hỗ trợ dịch vụ trọng yếu 24/7.", "/services"),
    ],
  },
  {
    id: "innovation", label: { en: "Innovation", vi: "Đổi mới sáng tạo" }, eyebrow: { en: "Innovation", vi: "Đổi mới sáng tạo" },
    title: { en: "Building the trust layer for the next decade.", vi: "Xây dựng tầng tin cậy cho thập kỷ tới." },
    cta: { label: { en: "Explore innovation", vi: "Khám phá đổi mới" }, path: "/innovation" },
    items: [
      item("Quantum PQC Lab", "Quantum PQC Lab", "Test PQC algorithms and hybrid certificates.", "Thử nghiệm thuật toán PQC và chứng thư lai.", "/innovation/quantum-pqc-lab"),
      item("Quantum Readiness", "Sẵn sàng lượng tử", "Assess cryptography and plan the PQC move.", "Đánh giá mật mã, lập kế hoạch chuyển PQC.", `/solutions/${CY}/quantum-safe/quantum-readiness`),
      item("Digital Trust", "Tin cậy số", "Identity and evidence that hold across borders.", "Định danh và bằng chứng có giá trị xuyên biên giới.", "/innovation"),
      item("AI", "AI", "AI in fraud prevention, documents and media.", "AI cho chống gian lận, tài liệu và truyền thông.", "/innovation"),
      item("R&D", "R&D", "Research programmes with our engineers.", "Chương trình nghiên cứu cùng đội kỹ sư.", "/innovation"),
      item("Technology Partnerships", "Hợp tác công nghệ", "Alliances with global technology vendors.", "Liên minh với các hãng công nghệ toàn cầu.", "/innovation"),
    ],
  },
  {
    // Mô tả không nêu tên khách hàng: tên khách hàng chưa được duyệt công bố (xem approval trong content/home.ts).
    id: "customers", label: { en: "Customers", vi: "Khách hàng" }, eyebrow: { en: "Customers", vi: "Khách hàng" },
    title: { en: "Trusted by governments and enterprises.", vi: "Được chính phủ và doanh nghiệp tin dùng." },
    cta: { label: { en: "View success stories", vi: "Xem câu chuyện thành công" }, path: "/customers" },
    items: [
      item("National Trust Infrastructure", "Hạ tầng tin cậy quốc gia", "Root CA, mobile PKI, TSA and VA programmes.", "Root CA, PKI di động, TSA và VA.", "/customers/neac-national-pki"),
      item("Bank CAs & Signing", "CA ngân hàng & Ký số", "Qualified CAs and remote signing for banks.", "CA đủ điều kiện và ký số từ xa cho ngân hàng.", "/customers/remote-signing-vneid"),
      item("Open Banking", "Open Banking", "Circular 64 platforms and open banking hubs.", "Nền tảng theo Thông tư 64 và open banking hub.", "/customers/vcb-open-banking"),
    ],
  },
  {
    // Tài liệu trỏ tới 4 bài cụ thể; site lọc theo danh mục CMS nên dùng danh mục tương ứng.
    id: "insights", label: { en: "Insights", vi: "Insights" }, eyebrow: { en: "Insights", vi: "Insights" },
    title: { en: "Regulation, technology and trust, explained.", vi: "Quy định, công nghệ và tin cậy số, giải thích rõ ràng." },
    cta: { label: { en: "Read insights", vi: "Đọc Insights" }, path: "/insights" },
    items: [
      item("News", "Tin tức", "Company announcements and product news.", "Thông báo công ty và tin sản phẩm.", "/insights"),
      item("Regulation", "Quy định", "What new rules mean for banks and CAs.", "Quy định mới tác động tới ngân hàng và CA.", "/insights?category=regulation"),
      item("Insight", "Góc nhìn", "Post-quantum, identity and trust explained.", "Hậu lượng tử, định danh và tin cậy số.", "/insights?category=insight"),
      item("Company", "Công ty", "Milestones, people and offices.", "Cột mốc, con người và văn phòng.", "/insights?category=company"),
    ],
  },
  {
    id: "about", label: { en: "About Us", vi: "Về chúng tôi" }, eyebrow: { en: "About SAVIS Group", vi: "Về SAVIS Group" },
    title: { en: "Make in Vietnam. Trusted worldwide.", vi: "Make in Vietnam. Tin cậy toàn cầu." },
    cta: { label: { en: "Contact SAVIS", vi: "Liên hệ SAVIS" }, path: "/contact", fallback: "#contact" },
    items: [
      item("Group", "Tập đoàn", "22 years building digital trust infrastructure.", "22 năm xây dựng hạ tầng tin cậy số.", "/about"),
      item("Leadership", "Ban lãnh đạo", "Our management team.", "Đội ngũ quản lý.", "/about"),
      item("Global Presence", "Hiện diện toàn cầu", "Ten offices across four continents.", "Mười văn phòng trên bốn châu lục.", "/about"),
      item("Partners", "Đối tác", "Resellers, integrators and alliances.", "Đại lý, nhà tích hợp và liên minh.", "/about/partners"),
      item("Contact", "Liên hệ", "Talk to a solution expert near you.", "Trao đổi với chuyên gia gần bạn.", "/contact", "#contact"),
      item("Careers", "Tuyển dụng", "Join the S-ers.", "Gia nhập đội ngũ S-ers.", "/about/careers"),
    ],
  },
];

// ---------- Menu mobile: mỗi menu L1 là một mục thu gọn; Solutions chỉ liệt kê trụ cột (sản phẩm nằm ở trang trụ cột). ----------
export type MobileLink = { label: string; href: string | null };
export type MobileSection = { id: string; label: string; links: MobileLink[] };

export function mobileSections(locale: Locale): MobileSection[] {
  const link = (it: NavItem): MobileLink => ({ label: it.label[locale], href: resolveHref(locale, it) });
  return [
    {
      id: "solutions",
      label: solutionsMenu.label[locale],
      links: [
        ...pillarMenus.map((p) => ({ label: pillarCopy(locale, p.id).name, href: resolveHref(locale, p) })),
        link(solutionsMenu.catalogue),
      ],
    },
    ...simpleMenus.map((m) => ({ id: m.id, label: m.label[locale], links: m.items.map(link) })),
  ];
}

export const contactFeature: { eyebrow: Text; title: Text; text: Text; cta: NavItem } = {
  eyebrow: same("SAVIS Group"),
  title: { en: "Talk to a solution expert", vi: "Trao đổi với chuyên gia giải pháp" },
  text: {
    en: "From consulting and integration to 24/7 managed operations, with ten offices worldwide.",
    vi: "Từ tư vấn, tích hợp đến vận hành 24/7, với mười văn phòng trên thế giới.",
  },
  cta: { label: { en: "Contact us", vi: "Liên hệ" }, path: "/contact", fallback: "#contact" },
};
