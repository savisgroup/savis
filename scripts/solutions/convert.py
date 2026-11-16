"""Chuyển nội dung trang Solutions & Products trong docx sitemap thành JSON cho src/content/solutions.

Cách dùng (từ thư mục gốc repo):
  python scripts/solutions/convert.py <đường dẫn docx> [file ra, mặc định src/content/solutions/pages.json]

Phạm vi: 5 trang pillar (cấp 3) và các trang sản phẩm (cấp 5) có URL /solutions/... và có khối nội dung trong docx.
Quy tắc:
- Chữ gạch ngang hoặc màu đỏ trong docx là nội dung đã xóa: bỏ.
- Nhãn "To confirm" / "[To confirm per product.]" đã được doanh nghiệp duyệt (14/11/2026): giữ nội dung, bỏ nhãn.
- Phụ đề tiếng Việt (site hiện chỉ có /en) không đưa vào; tên sản phẩm giữ nguyên.
- "Download Brochure" (chưa có tài liệu) và liên kết "See the flow & architecture" (chưa có trang đích) không đưa vào.
Chỉ dùng thư viện chuẩn của Python 3. Gặp bố cục chưa biết thì dừng và báo lỗi, không bỏ qua âm thầm.
"""
import json
import sys as _sys

_sys.stdout.reconfigure(encoding="utf-8")
import os
import re
import sys
import zipfile

DOCX = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "src", "content", "solutions", "pages.json")

RED = re.compile(r'<w:color w:val="(FF0000|C00000|[DE][0-9A-F]0000)"')
STRIKE = re.compile(r"<w:strike[^>]*>")


def docx_lines(path):
    xml = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    out = []
    for para in re.findall(r"<w:p[ >].*?</w:p>", xml, flags=re.S):
        text = ""
        for run in re.findall(r"<w:r[ >].*?</w:r>", para, flags=re.S):
            t = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", run, flags=re.S))
            if not t:
                continue
            st = STRIKE.search(run)
            struck = bool(st) and 'w:val="0"' not in st.group(0)
            if struck or RED.search(run):
                continue
            text += t
        text = re.sub(r"\s+", " ", text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")).strip()
        if text:
            out.append(text)
    return out


MARK = re.compile(r"^\[(Eyebrow|H1[^\]]*|H2|H3|Nút|Thẻ / Card)\]\s*(.*)$")
LABEL = re.compile(r"\s*[·—-]?\s*\b(to confirm|to be confirmed)\b\.?", re.I)


def tokens(lines):
    out = []
    for ln in lines:
        m = MARK.match(ln)
        if not m:
            out.append(("line", ln))
            continue
        kind = m.group(1)
        kind = "h1" if kind.startswith("H1") else {"Eyebrow": "eyebrow", "H2": "h2", "H3": "h3", "Nút": "btn", "Thẻ / Card": "card"}[kind]
        out.append((kind, m.group(2).strip()))
    return out


def page_blocks(lines):
    """Tách các khối trang: mỗi khối bắt đầu ở dòng 'URL' và kết thúc trước 'Mã trang' kế tiếp."""
    starts = [i for i, l in enumerate(lines) if l == "URL" and i + 1 < len(lines) and lines[i + 1].startswith("/solutions/")]
    res = []
    for s in starts:
        e = next((j for j in range(s + 1, len(lines)) if lines[j] == "Mã trang"), len(lines))
        blk = lines[s:e]
        if re.match(r"^\d+\. ", blk[-1]):
            blk = blk[:-1]  # dòng tiêu đề của trang kế tiếp
        res.append(blk)
    return res


def fail(path, msg):
    raise SystemExit(f"[{path}] {msg}")


def clean(text):
    out = re.sub(r"\s+", " ", LABEL.sub("", text)).strip(" ·—-")
    out = re.sub(r"\s*—\s*product scope$", "", out)  # "... — product scope to be confirmed" -> bỏ cả vế đã duyệt
    return out + ("." if text.rstrip().endswith(".") and not out.endswith(".") else "")


def split_pipe(s):
    return [p.strip() for p in s.split("|") if p.strip()]


def badges(line):
    out = []
    for p in split_pipe(line):
        p = re.sub(r"\s*·\s*VERIFY$", "", p)  # nhãn VERIFY của MKT: đã được duyệt
        if re.fullmatch(r"(?i)to confirm", p) or p == "SAVIS":
            continue
        out.append({"text": p, "tone": "new" if p == "New" else "default"})
    return out


def sections_of(tok, path):
    """Chia token thành các khối bắt đầu ở eyebrow cấp section (eyebrow không đứng ngay sau thẻ)."""
    secs, cur = [], None
    for i, (k, v) in enumerate(tok):
        if k == "eyebrow" and not (i > 0 and tok[i - 1][0] == "card"):
            cur = {"name": v, "tok": []}
            secs.append(cur)
        elif cur is None:
            fail(path, f"token trước eyebrow đầu tiên: {k} {v[:40]}")
        else:
            cur["tok"].append((k, v))
    return secs


def cards_of(tok, path):
    """Tách danh sách token thành các thẻ; phần trước thẻ đầu tiên trả về riêng."""
    head, cards = [], []
    for k, v in tok:
        if k == "card":
            cards.append([])
        elif cards:
            cards[-1].append((k, v))
        else:
            head.append((k, v))
    return head, cards


TITLES = {}  # tên sản phẩm -> đường dẫn trang (điền ở bước 1)


def product_card(c, path):
    lines = [v for k, v in c if k == "line"]
    if not lines or any(k != "line" for k, _ in c):
        fail(path, f"thẻ sản phẩm lạ: {c}")
    title, rest = lines[0], lines[1:]
    d = {"t": "card", "title": title}
    desc = [x for x in rest if not re.match(r"^(SAVIS( \||$)|Canonical page in)", x)]
    bdg = [x for x in rest if re.match(r"^SAVIS( \||$)", x)]
    canon = [x for x in rest if x.startswith("Canonical page in")]
    if desc:
        d["text"] = clean(desc[0])
    if bdg:
        d["badges"] = badges(bdg[0])
    if canon:
        d["canonical"] = True
    d["_name"] = title
    return d


def use_case_card(c, path):
    d = {"t": "card"}
    chain = []
    for k, v in c:
        if k == "eyebrow":
            d["eyebrow"] = v
        elif k == "h3":
            d["title"] = v
        elif k == "line" and "→" in v and v.startswith("See the flow"):
            pass  # trang đích (use case cấp 3) chưa dựng
        elif k == "line" and " → " in v:
            chain = [s.strip() for s in v.split("→")]
        elif k == "line" and "text" not in d:
            d["text"] = v
        else:
            fail(path, f"use case card lạ: {k} {v[:50]}")
    if chain:
        d["chain"] = chain
    return d


def parse_pillar(blk, tok, path):
    secs = sections_of(tok, path)
    hero_sec, rest = secs[0], secs[1:]
    page = {"groups": [], "useCases": [], "industries": []}
    page["hero"] = parse_hero(hero_sec, path)
    for s in rest:
        if s["name"] == "L2":
            h3 = [v for k, v in s["tok"] if k == "h3"]
            head, cards = cards_of(s["tok"], path)
            lines = [v for k, v in head if k == "line"]
            note = [x for x in lines[1:]]  # lines[0] là phụ đề tiếng Việt
            page["groups"].append({"title": h3[0], "note": note[0] if note else None, "cards": [product_card(c, path) for c in cards]})
        elif s["name"] == "Use cases":
            head, cards = cards_of(s["tok"], path)
            lines = [v for k, v in head if k == "line"]
            page["useCases"] = {"title": lines[0], "cards": [use_case_card(c, path) for c in cards]}
        elif s["name"] == "Industries":
            lines = [v for k, v in s["tok"] if k == "line"]
            page["industries"] = {"title": lines[0], "items": split_pipe(lines[1])}
        else:
            fail(path, f"section pillar lạ: {s['name']}")
    return page


def parse_hero(sec, path):
    toks = sec["tok"]
    h1 = next(v for k, v in toks if k == "h1")
    lead = next(v for k, v in toks if k == "line")
    btns = [v for k, v in toks if k == "btn"]
    return {"eyebrow": sec["name"], "title": h1, "lead": lead, "buttons": btns}


# Các khối kỹ thuật dài riêng của trang AI Camera Security (bảng thông số, kiến trúc bảo mật...): bảng bị docx làm phẳng nên
# chưa dựng; trang vẫn có đủ khối chuẩn (overview, how it works, kiến trúc logic, use cases, triển khai, ngành, liên quan).
LONGFORM = {"Product family", "Technical specifications", "Industrial design", "Security architecture", "Anti-cloning & device integrity",
            "Deployment design rules", "Compliance & certification", "Why it matters", "Sovereign delivery"}


def parse_product(blk, tok, path):
    secs = sections_of(tok, path)
    hero_sec = secs[0]
    page = {"hero": parse_hero(hero_sec, path)}
    # Overview và Product master record là hai thẻ ngay sau hero (eyebrow của thẻ), nằm trong phần token của hero.
    head, cards = cards_of(hero_sec["tok"], path)
    # Trang TrustCA có thêm khối "Certified & compliant" (chuỗi chứng nhận) đứng trước hai thẻ này.
    cert = next((x for x in secs[1:] if x["name"] == "Certified & compliant"), None)
    if cert:
        head, cards = cards_of(cert["tok"], path)
        claims = [v for k, v in head if k == "line"]
        page["certs"] = split_pipe(claims[0])  # claims[1] là ghi chú nội bộ "to be verified before publication": bỏ
    page["cards"] = []
    for c in cards:
        d = {"t": "card"}
        for k, v in c:
            if k == "eyebrow":
                d["eyebrow"] = v
            elif k == "h3":
                d["title"] = v
            elif k == "line":
                if v.startswith("SAVIS |") or v == "SAVIS":
                    d["brand"] = v
                elif v.endswith("→"):
                    d["more"] = v.rstrip("→ ").strip()
                elif "text" not in d:
                    d["text"] = v
                else:
                    d["text"] += " " + v
            elif k == "btn":
                pass  # nút nhảy tới các phần của trang dài (AI Camera)
            else:
                fail(path, f"thẻ đầu trang lạ: {k}")
        page["cards"].append(d)
    for s in secs[1:]:
        n, t = s["name"], s["tok"]
        lines = [v for k, v in t if k == "line"]
        if n == "Certified & compliant" or n in LONGFORM or n.startswith("SX-"):
            continue
        if n == "How it works":
            steps = []
            for ln in lines[1:]:
                m = re.match(r"^(\d\d) \| (.+?) \| (.+)$", ln)
                if m:
                    steps.append({"t": "step", "num": m.group(1), "title": m.group(2), "text": m.group(3)})
                elif ln.startswith("Full use case"):
                    pass  # liên kết tới trang use case chi tiết chưa dựng
                else:
                    fail(path, f"bước lạ: {ln[:60]}")
            page["how"] = {"title": lines[0], "steps": steps}
        elif n == "Logical architecture":
            title, body = lines[0], lines[1:]
            caption = body.pop() if body and body[-1].startswith("Logical architecture:") else None
            if len(body) % 2:
                fail(path, f"số dòng kiến trúc lẻ: {body}")
            layers = [{"label": body[i], "items": split_pipe(body[i + 1])} for i in range(0, len(body), 2)]
            page["arch"] = {"title": title, "layers": layers, "caption": caption}
        elif n == "Use cases":
            head, cards = cards_of(t, path)
            page["useCases"] = {"title": [v for k, v in head if k == "line"][0], "cards": [use_case_card(c, path) for c in cards]}
        elif n == "Deployment & delivery":
            head, cards = cards_of(t, path)
            note = None
            dep = []
            for c in cards:
                ls = [v for k, v in c if k == "line"]
                h3 = [v for k, v in c if k == "h3"]
                tail = [x for x in ls if x.startswith("Available deployment models")]
                if tail:
                    note = clean(re.sub(r"\[[^\]]*\]", "", tail[0])).strip()
                    ls = [x for x in ls if x not in tail]
                dep.append({"t": "card", "title": h3[0], "text": ls[0]})
            tail_lines = [v for k, v in head if k == "line"]
            page["deploy"] = {"title": tail_lines[0], "cards": dep, "note": note or None}
        elif n == "Industries":
            page["industries"] = {"title": lines[0], "items": split_pipe(lines[1])}
        else:
            # eyebrow = tên nhóm sản phẩm: danh sách sản phẩm liên quan
            head, cards = cards_of(t, path)
            page["related"] = {"group": n, "title": [v for k, v in head if k == "line"][0], "cards": [product_card(c, path) for c in cards]}
    return page


ERRORS = []


def main():
    lines = docx_lines(DOCX)
    pages = {}
    for blk in page_blocks(lines):
        url = blk[1].strip("/")
        path = url.removeprefix("solutions/")
        level = blk[blk.index("Cấp trong sitemap") + 1]
        crumb = blk[blk.index("Breadcrumb") + 1]
        body = blk[blk.index("Trang cha") + 2:]
        tok = tokens(body)
        try:
            data = parse_pillar(blk, tok, path) if level == "L3" else parse_product(blk, tok, path) if level == "L5" else None
        except (SystemExit, KeyError, IndexError, StopIteration) as err:
            ERRORS.append(f"{path}: {err!r}"[:200])
            continue
        if data is None:
            continue  # L2 /solutions đã dựng ở content/pages
        data.update({"path": path, "level": level, "crumb": [c.strip() for c in crumb.split(" / ")]})
        pages[path] = data
    return pages


# ---------- Bước 2: dựng dữ liệu theo mô hình PageData (src/content/pages/types.ts) ----------
def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def tone_cycle(secs):
    """Xen kẽ light/surface; khối "How it works" nền tối."""
    n = 0
    for sec in secs:
        if sec.get("tone") == "dark":
            n = 0
            continue
        sec["tone"] = "light" if n % 2 == 0 else "surface"
        n += 1
    return secs


def card_out(c, hrefs, dark=False):
    d = {k: v for k, v in c.items() if k not in ("_name", "canonical")}
    if c.get("_name") in hrefs:
        d["href"] = "/solutions/" + hrefs[c["_name"]]
    if dark:
        d["dark"] = True
    return d


def trail_of(page):
    crumb, path = page["crumb"][1:-1], page["path"].split("/")
    out = [{"label": crumb[0], "href": "/solutions"}]
    for i, label in enumerate(crumb[1:], start=1):
        out.append({"label": label, **({"href": "/solutions/" + "/".join(path[:i])} if i == 1 else {})})
    return out


def build_product(p, hrefs):
    h = p["hero"]
    secs = []
    first = []
    if p.get("certs"):
        first += [{"t": "head", "eyebrow": "Certified & compliant", "title": "Certified and compliant"}, {"t": "logos", "items": p["certs"]}]
    cards = []
    for c in p["cards"]:
        d = {"t": "card", "eyebrow": c.get("eyebrow"), "title": c.get("title"), "text": c.get("text")}
        if c.get("brand") and "CORE TECHNOLOGY" in c["brand"]:
            d["badges"] = [{"text": "CORE TECHNOLOGY", "tone": "default"}]
        if c.get("more"):
            d["more"], d["href"] = c["more"], "/contact"
        cards.append({k: v for k, v in d.items() if v})
    secs.append({"tone": "light", "blocks": first + [{"t": "grid", "cols": "2", "items": cards}]})
    if p.get("how"):
        secs.append({"tone": "dark", "blocks": [{"t": "head", "eyebrow": "How it works", "title": p["how"]["title"]}, {"t": "grid", "cols": "3", "items": p["how"]["steps"]}]})
    if p.get("arch"):
        blocks = [{"t": "head", "eyebrow": "Logical architecture", "title": p["arch"]["title"]}, {"t": "layers", "items": p["arch"]["layers"]}]
        if p["arch"].get("caption"):
            blocks.append({"t": "note", "text": p["arch"]["caption"]})
        secs.append({"tone": "light", "blocks": blocks})
    if p.get("useCases"):
        secs.append({"tone": "light", "blocks": [{"t": "head", "eyebrow": "Use cases", "title": p["useCases"]["title"]}, {"t": "grid", "cols": "3", "items": p["useCases"]["cards"]}]})
    if p.get("deploy"):
        blocks = [{"t": "head", "eyebrow": "Deployment & delivery", "title": p["deploy"]["title"]}, {"t": "grid", "cols": "4", "items": p["deploy"]["cards"]}]
        if p["deploy"].get("note"):
            blocks.append({"t": "note", "text": p["deploy"]["note"]})
        secs.append({"tone": "light", "blocks": blocks})
    if p.get("industries"):
        secs.append({"tone": "light", "blocks": [{"t": "head", "eyebrow": "Industries", "title": p["industries"]["title"]}, {"t": "logos", "items": p["industries"]["items"]}]})
    if p.get("related"):
        r = p["related"]
        secs.append({"tone": "light", "blocks": [{"t": "head", "eyebrow": r["group"], "title": r["title"]}, {"t": "grid", "cols": "3", "items": [card_out(c, hrefs) for c in r["cards"]]}]})
    return {"slug": p["path"], "hero": {"crumb": h["title"], "trail": trail_of(p), "eyebrow": h["eyebrow"], "title": h["title"], "lead": h["lead"],
            "buttons": [{"label": b, "href": "/contact", "ghost": False} for b in h["buttons"] if b == "Request a Consultation"]}, "sections": tone_cycle(secs)}


def build_pillar(p, hrefs):
    h = p["hero"]
    gid = [slug(g["title"]) for g in p["groups"]]
    secs = []
    for i, g in enumerate(p["groups"]):
        blocks = []
        if i == 0:
            blocks.append({"t": "tabs", "items": [x["title"] for x in p["groups"]], "anchors": gid})
        blocks.append({"t": "head", "title": g["title"], **({"lead": g["note"]} if g.get("note") else {})})
        blocks.append({"t": "grid", "cols": "3", "items": [card_out(c, hrefs) for c in g["cards"]]})
        secs.append({"id": gid[i], "tone": "light", "blocks": blocks})
    uc = p["useCases"]
    secs.append({"tone": "dark", "blocks": [{"t": "head", "eyebrow": "Use cases", "title": uc["title"]}, {"t": "grid", "cols": "3", "items": [{**c, "dark": True} for c in uc["cards"]]}]})
    ind = p["industries"]
    secs.append({"tone": "light", "blocks": [{"t": "head", "eyebrow": "Industries", "title": ind["title"]}, {"t": "logos", "items": ind["items"]}]})
    eyebrow = h["eyebrow"].split(" · ")[0]  # phần sau " · " là tên pillar tiếng Việt
    buttons = [{"label": b, "href": "/contact" if i == 0 else f"/solutions/{p['path']}#{gid[0]}", "ghost": i > 0} for i, b in enumerate(h["buttons"])]
    return {"slug": p["path"], "hero": {"crumb": h["title"], "trail": [{"label": "Solutions & Products", "href": "/solutions"}], "eyebrow": eyebrow, "title": h["title"], "lead": h["lead"], "buttons": buttons},
            "sections": tone_cycle(secs)}


NOTE_RE = re.compile(r"to be (confirmed|verified|finalised)|to confirm|^verify.*before publication", re.I)


def scrub(x):
    """Bỏ ghi chú nội bộ lẫn trong câu: vế "— ... to be confirmed", và cả câu chứa "to be verified/confirmed"."""
    if isinstance(x, str):
        x = re.sub(r"\s*—\s*[^.]*to be confirmed", "", x)
        sentences = re.split(r"(?<=[.?])\s+", x)
        return " ".join(t for t in sentences if not NOTE_RE.search(t)).strip()
    if isinstance(x, dict):
        return {k: scrub(v) for k, v in x.items()}
    if isinstance(x, list):
        return [scrub(v) for v in x]
    return x


def build(raw):
    hrefs = {p["hero"]["title"]: p["path"] for p in raw.values()}
    return {k: scrub(build_pillar(p, hrefs) if p["level"] == "L3" else build_product(p, hrefs)) for k, p in raw.items()}


if __name__ == "__main__":
    raw = build(main())
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        json.dump(raw, f, ensure_ascii=False, indent=1)
        f.write("\n")
    for e in ERRORS:
        print("LỖI", e)
    print(len(raw), "trang:", sum(1 for k in raw if k.count("/") == 0), "pillar,", sum(1 for k in raw if k.count("/") == 2), "sản phẩm")
