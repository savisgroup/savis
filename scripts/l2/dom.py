"""Mini DOM từ html.parser để đọc các artboard L2."""
from html.parser import HTMLParser
import re

VOID = {"input", "br", "img", "meta", "link", "hr"}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag = tag
        self.attrs = dict(attrs)
        self.parent = parent
        self.kids = []  # Node | str

    @property
    def cls(self):
        return self.attrs.get("class", "").split()

    def has(self, c):
        return c in self.cls

    def text(self):
        out = []
        for k in self.kids:
            out.append(k if isinstance(k, str) else k.text())
        return re.sub(r"\s+", " ", "".join(out)).strip()

    def elems(self):
        return [k for k in self.kids if isinstance(k, Node)]

    def find_all(self, pred):
        res = []
        for k in self.elems():
            if pred(k):
                res.append(k)
            res.extend(k.find_all(pred))
        return res

    def find(self, pred):
        r = self.find_all(pred)
        return r[0] if r else None

    def __repr__(self):
        return f"<{self.tag} {' '.join(self.cls)}>"


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root", {})
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.kids.append(data)


def parse_page(path):
    raw = open(path, "rb").read().decode("utf-8", errors="replace")
    a = raw.index('<x-import component-from-global-scope="SavisWeb.Header"')
    a = raw.index("<section", a)
    b = raw.index('<x-import component-from-global-scope="SavisWeb.Footer"')
    p = P()
    p.feed(raw[a:b])
    return [k for k in p.root.kids if isinstance(k, Node) and k.tag == "section"]
