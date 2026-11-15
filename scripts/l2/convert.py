"""Chuyển các artboard "L2 · ..." của canvas thiết kế (Main-*.dc.html) thành JSON cho src/content/pages.

Cách dùng (từ thư mục gốc repo):
  python scripts/l2/convert.py <thư mục project của canvas> [thư mục ra, mặc định src/content/pages]
Thư mục project của canvas có được bằng cách tải các file Main-*.dc.html của artifact thiết kế (action "read" với path).

Quy tắc nội dung:
- Nhãn "To confirm" / "VERIFY" / "to be confirmed" của MKT đã được doanh nghiệp duyệt (14/11/2026): giữ nội dung, bỏ nhãn.
- Placeholder còn thiếu dữ kiện thật ("[Year]", "[Name]", "[Address]", "[X]") bị đánh dấu `pending` và bộ render bỏ qua
  (design system cấm placeholder trên production). Lưới có quá nửa mục như vậy bị bỏ nguyên.
- Ghi chú nội bộ (p-note), nút có đích chưa tồn tại, trang Insights (chạy bằng CMS) không được chuyển.
- Mọi liên kết thẻ trong thiết kế là "#": thẻ hiện là khối thường cho đến khi có trang cấp 3.
Chỉ dùng thư viện chuẩn của Python 3. Gặp cấu trúc chưa biết thì dừng và báo lỗi thay vì bỏ qua âm thầm.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(__file__))
from dom import parse_page

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "..", "..", "src", "content", "pages")
PAGES = ["solutions", "industries", "use-cases", "services", "innovation", "customers", "about", "trust-center", "contact"]

# Chỉ placeholder còn thiếu dữ kiện thật ("[Year]", "[Name]", "[X]") mới bị coi là chưa duyệt. Nhãn "To confirm" / "VERIFY"
# của MKT đã được doanh nghiệp duyệt (14/11/2026): giữ nội dung, bỏ nhãn.
PENDING_RE = re.compile(r"\[[^\]]+\]")
LABEL_RE = re.compile(r"\s*[·—-]?\s*\b((?i:to confirm|to be confirmed)|VERIFY)\b\.?")


def pending(text):
    return bool(PENDING_RE.search(text))


def clean(text):
    out = re.sub(r"\s+", " ", LABEL_RE.sub("", text)).strip(" ·—-")
    # Câu đã cắt cụm "to be confirmed" cần dấu chấm kết (vd "... government apps — product scope" -> bỏ cả vế).
    return re.sub(r"\s*—\s*product scope$", "", out) + ("." if text.rstrip().endswith(".") and not out.endswith(".") else "")


def tone_of(sec):
    st = sec.attrs.get("style", "")
    if "sw-on-band" in sec.cls:
        return "dark"
    if "var(--surface)" in st:
        return "surface"
    return "light"


def link_dest(label):
    """Nút trong thiết kế đều href="#". Gán đích theo nhãn; không có đích thì bỏ nút."""
    l = label.lower()
    if re.search(r"talk to|discuss|contact savis|enquir|request compliance|expert|become", l):
        return "/contact"
    return None


def card(n):
    kids = n.elems()
    d = {"t": "card"}
    for k in kids:
        if k.has("p-badge"):
            d.setdefault("badges", []).append({"text": clean(k.text()), "tone": "new" if k.has("new") else "default"})
        elif k.has("sw-eyebrow"):
            d["eyebrow"] = k.text()
        elif k.tag == "h3":
            d["title"] = k.text()
        elif k.tag == "p":
            d["text"] = clean(k.text())
        elif k.tag == "ul":
            d["list"] = [li.text() for li in k.elems()]
        elif k.has("p-chain"):
            d["chain"] = [s.text() for s in k.elems() if s.tag == "span"]
        elif k.has("more"):
            d["more"] = k.text().rstrip(" →").strip()
        elif k.tag == "div" and "[PHOTO]" in k.text():
            d["photo"] = True
        else:
            raise SystemExit(f"card child lạ: {k} {k.text()[:60]}")
    if n.has("dk"):
        d["dark"] = True
    if n.tag == "a":
        d["linked"] = True  # mọi href="#": đích L3 chưa thiết kế -> render không phải link
    blob = " ".join([d.get("title", ""), d.get("text", ""), d.get("eyebrow", "")] + [b["text"] for b in d.get("badges", [])])
    if d.get("photo") or pending(blob):
        d["pending"] = True
    return d


def step(n):
    d = {"t": "step"}
    ks = n.elems()
    for k in ks:
        if k.tag == "b":
            d["num"] = k.text()
        elif k.tag == "h3":
            d["title"] = k.text()
        elif k.tag == "p":
            d["text"] = k.text()
        else:
            raise SystemExit(f"step child lạ {k}")
    if pending(d.get("text", "") + d.get("title", "")):
        d["pending"] = True
    return d


def office(n):
    ks = n.elems()
    d = {"t": "office", "region": ks[0].text(), "name": ks[1].text(), "lines": [k.text() for k in ks[2:]]}
    if n.has("hq"):
        d["hq"] = True
    if pending(" ".join(d["lines"])):
        # Địa chỉ chưa có (vd "[Address]"): giữ văn phòng nhưng bỏ dòng placeholder.
        d["lines"] = [l for l in d["lines"] if not pending(l)]
    return d


def item(n):
    if n.has("p-card"):
        return card(n)
    if n.has("p-step"):
        return step(n)
    if n.has("c-office"):
        return office(n)
    raise SystemExit(f"item lạ {n}")


def hero(sec):
    cp = sec.find(lambda x: x.has("c-copy"))
    crumb = cp.find(lambda x: x.has("p-bc")).elems()[-1].text()
    h = {"crumb": crumb, "eyebrow": cp.find(lambda x: x.has("sw-eyebrow")).text(), "title": cp.find(lambda x: x.tag == "h1").text(),
         "lead": cp.find(lambda x: x.tag == "p").text(), "buttons": []}
    bar = cp.elems()[-1]
    for a in bar.elems():
        label = a.text()
        d = link_dest(label)
        if d:
            h["buttons"].append({"label": label, "href": d, "ghost": a.has("sw-btn-ghost")})
        else:
            h["dropped"] = h.get("dropped", []) + [label]
    return h


def grid_cols(g):
    return "4" if g.has("g4") else "2" if g.has("g2") else "3"


def head_of(div):
    """div chứa eyebrow + h2 (+ lead) -> dict, hoặc None."""
    eb = div.find(lambda x: x.has("sw-eyebrow"))
    h2 = div.find(lambda x: x.tag == "h2")
    if not h2:
        return None
    d = {"title": h2.text()}
    if eb:
        d["eyebrow"] = eb.text()
    lead = div.find(lambda x: x.has("p-lead"))
    if lead:
        d["lead"] = lead.text()
    return d


def blocks_of(wrap, sec_id_counter):
    out = []
    for k in wrap.elems():
        if k.has("p-tabs"):
            out.append({"t": "tabs", "items": [a.text() for a in k.elems()], "active": next((i for i, a in enumerate(k.elems()) if a.has("on")), None)})
        elif k.has("p-sub"):
            out.append({"t": "sub", "title": k.text()})
        elif k.has("p-grid"):
            items = [item(i) for i in k.elems()]
            out.append({"t": "grid", "cols": grid_cols(k), "items": items})
        elif k.has("p-note"):
            continue  # ghi chú nội bộ của thiết kế ("to confirm"): không đưa lên production
        elif k.has("p-tl"):
            tl = []
            for e in k.elems():
                b = e.find(lambda x: x.tag == "b")
                year = b.text() if b else ""
                text = e.text()[len(year):].strip()
                tl.append({"year": year, "text": text, **({"pending": True} if pending(year + text) else {})})
            out.append({"t": "timeline", "items": tl})
        elif k.has("p-logos"):
            out.append({"t": "logos", "items": [s.text() for s in k.elems()]})
        elif k.tag == "p":
            a = k.find(lambda x: x.has("c-link"))
            plain = k.text() if not a else k.text().replace(a.text(), "").strip()
            if plain and not pending(plain):
                out.append({"t": "text", "text": plain})
            if a:
                out.append({"t": "link", "label": a.text().rstrip(" →").strip(), "href": "/trust-center" if "Trust" in a.text() else None})
        elif k.tag == "div":
            es = k.elems()
            if k.has("c-row"):
                out.append(split(k))
            elif es and all(e.tag == "div" and e.find(lambda x: x.has("p-num")) for e in es):
                out.append({"t": "stats", "items": [{"value": e.find(lambda x: x.has("p-num")).text(), "label": e.elems()[-1].text()} for e in es]})
            elif es and es[0].has("sw-eyebrow") and k.find(lambda x: x.has("p-logos")):
                eb = es[0].text()
                lg = k.find(lambda x: x.has("p-logos"))
                extra = [e.text() for e in es if e.tag == "p"]
                out.append({"t": "logos", "label": eb, "items": [s.text() for s in lg.elems()], **({"text": extra[0]} if extra else {}), **({"gate": "clientNames"} if CUR == "customers" else {})})
            elif es and es[0].tag == "div" and head_of(es[0]) and es[-1].has("c-link"):
                hd = head_of(es[0])
                eb = hd.get("eyebrow", "")
                href = f"/solutions#pillar-{eb.split()[1]}" if eb.upper().startswith("PILLAR ") else "/contact" if "Contact" in es[-1].text() else None
                out.append({"t": "head", **hd, "link": es[-1].text().rstrip(" →").strip(), "href": href})
            elif head_of(k) and not k.find(lambda x: x.tag == "a" and x.has("sw-btn")):
                out.append({"t": "head", **head_of(k)})
            elif (k.find(lambda x: x.tag == "a" and x.has("sw-btn")) and head_of(k)):
                out.append(cta(k))
            else:
                raise SystemExit(f"div lạ: {[repr(e) for e in es][:4]} {k.text()[:80]}")
        elif k.tag == "a" and k.has("p-feat"):
            continue  # chỉ có ở Insights (bài nổi bật dùng CMS)
        else:
            raise SystemExit(f"block lạ {k}")
    return out


def cta(k):
    h = head_of(k)
    btns = []
    for a in k.find_all(lambda x: x.tag == "a" and x.has("sw-btn")):
        d = link_dest(a.text())
        if d:
            btns.append({"label": a.text(), "href": d, "ghost": a.has("sw-btn-ghost")})
    return {"t": "cta", "title": h["title"], "lead": h.get("lead", ""), "buttons": btns}


def split(k):
    es = k.elems()
    if es[0].tag == "form":
        side = [card(c) for c in es[1].elems()]
        fields = []
        for lab in es[0].find_all(lambda x: x.has("p-field")):
            kind = "textarea" if lab.find(lambda x: x.tag == "textarea") else "select" if lab.find(lambda x: x.tag == "select") else "text"
            opt = lab.find(lambda x: x.tag == "option")
            fields.append({"label": lab.kids[0].strip() if isinstance(lab.kids[0], str) else lab.text(), "kind": kind, **({"placeholder": opt.text()} if opt else {})})
        send = es[0].find(lambda x: x.has("sw-btn")).text()
        return {"t": "contact", "fields": fields, "send": send, "side": side}
    # Khối "câu chuyện": cột chữ + cột thẻ
    h = head_of(es[0])
    return {"t": "split", **h, "cards": [card(c) for c in es[1].elems()]}


def drop_mostly_pending(blocks):
    """Bỏ lưới có quá nửa mục chưa duyệt; trong lưới còn lại bỏ các mục chưa duyệt."""
    res = []
    for b in blocks:
        if b["t"] == "grid":
            its = b["items"]
            bad = sum(1 for i in its if i.get("pending"))
            if bad > len(its) / 2:
                b = {**b, "dropped": bad, "items": []}
            else:
                b = {**b, "dropped": bad, "items": [i for i in its if not i.get("pending")]}
            if not b["items"]:
                continue
        elif b["t"] == "timeline":
            b = {**b, "items": [i for i in b["items"] if not i.get("pending")]}
        res.append(b)
    return res


CUR = ""


def convert(slug):
    global CUR
    CUR = slug
    secs = parse_page(os.path.join(SRC, f"Main-{slug}.dc.html"))
    page = {"slug": slug, "hero": hero(secs[0]), "sections": []}
    pillar_n = 0
    for s in secs[1:]:
        wrap = s.elems()[0]
        sec = {"tone": tone_of(s), "blocks": blocks_of(wrap, None)}
        sec["blocks"] = drop_mostly_pending(sec["blocks"])
        # Khối chỉ còn rác (rỗng sau khi lọc) thì bỏ.
        if not sec["blocks"] or all(b["t"] in ("head", "sub") for b in sec["blocks"]):
            page.setdefault("droppedSections", []).append(s.text()[:50])
            continue
        # CTA nằm một mình trong section tối
        if len(sec["blocks"]) == 1 and sec["blocks"][0]["t"] == "cta":
            sec["cta"] = sec["blocks"].pop()
        hd = next((b for b in sec["blocks"] if b["t"] == "head"), None)
        if hd and hd.get("eyebrow", "").upper().startswith("PILLAR "):
            pillar_n += 1
            sec["id"] = f"pillar-{hd['eyebrow'].split()[1]}"
        page["sections"].append(sec)
    # Tab "01 · ..." trỏ tới section pillar-0N theo thứ tự
    for sec in page["sections"]:
        for b in sec["blocks"]:
            if b["t"] == "tabs" and slug in ("solutions", "use-cases"):
                b["anchors"] = [f"pillar-{i + 1:02d}" for i in range(len(b["items"]))]
    return page


os.makedirs(OUT, exist_ok=True)
for slug in PAGES:
    p = convert(slug)
    with open(os.path.join(OUT, f"{slug}.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(p, f, ensure_ascii=False, indent=1)
        f.write("\n")
    nb = sum(len(s["blocks"]) for s in p["sections"])
    drop = [d for s in p["sections"] for b in s["blocks"] if b["t"] == "grid" and b.get("dropped") for d in [b["dropped"]]]
    print(slug, "sections", len(p["sections"]), "blocks", nb, "dropped-items", sum(drop), p["hero"].get("dropped", ""), p.get("droppedSections", ""))
