#!/usr/bin/env python3
"""監測各銀行信用卡權益頁面是否異動。

從 data.js 讀出每張卡的 officialUrl，抓取頁面純文字內容並計算雜湊，
與 .watch/hashes.json 中上次的紀錄比對。有變動時輸出變動清單
（GitHub Actions 會據此開 Issue 提醒），並更新雜湊紀錄。

只用 Python 標準庫，不需安裝任何套件。
"""

import datetime
import hashlib
import html.parser
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "data.js"
HASH_FILE = ROOT / ".watch" / "hashes.json"
CHANGES_FILE = ROOT / ".watch" / "changes.md"

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


class TextExtractor(html.parser.HTMLParser):
    """去掉 script/style 後抽出頁面純文字，降低動態 nonce 造成的誤判。"""

    SKIP = {"script", "style", "noscript"}

    def __init__(self):
        super().__init__()
        self.parts = []
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data):
        if self._skip_depth == 0:
            self.parts.append(data)


def page_fingerprint(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "zh-TW,zh;q=0.9"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  ⚠️ 抓取失敗 {url}: {e}", file=sys.stderr)
        return None

    parser = TextExtractor()
    try:
        parser.feed(raw)
        text = " ".join(parser.parts)
    except Exception:
        text = raw
    text = re.sub(r"\s+", " ", text).strip()
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_cards():
    """從 data.js 撈出卡片的 bank/name/officialUrl（用 regex，不跑 JS）。"""
    src = DATA_JS.read_text(encoding="utf-8")
    cards = []
    # 每張卡的區塊都有 bank / name / officialUrl 欄位
    pattern = re.compile(
        r'bank:\s*"([^"]+)".*?name:\s*"([^"]+)".*?officialUrl:\s*"([^"]+)"',
        re.DOTALL,
    )
    for bank, name, url in pattern.findall(src):
        cards.append({"bank": bank, "name": name, "url": url})
    return cards


def main() -> None:
    cards = load_cards()
    if not cards:
        print("在 data.js 找不到任何卡片的 officialUrl", file=sys.stderr)
        sys.exit(1)

    old_hashes = {}
    if HASH_FILE.exists():
        old_hashes = json.loads(HASH_FILE.read_text(encoding="utf-8"))

    new_hashes = dict(old_hashes)
    changed, failed = [], []

    for card in cards:
        label = f'{card["bank"]} {card["name"]}'
        print(f"檢查 {label} ...")
        fp = page_fingerprint(card["url"])
        if fp is None:
            failed.append((label, card["url"]))
            continue
        prev = old_hashes.get(card["url"])
        new_hashes[card["url"]] = fp
        if prev is not None and prev != fp:
            changed.append((label, card["url"]))
            print("  🔔 頁面內容有異動！")

    # 每次執行都更新檢查時間，確保每週至少有一個 commit。
    # （GitHub 會停用 60 天無 commit 的 repo 的排程 workflow，這行是保活機制）
    new_hashes["_lastChecked"] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")

    HASH_FILE.parent.mkdir(exist_ok=True)
    HASH_FILE.write_text(json.dumps(new_hashes, indent=2, ensure_ascii=False), encoding="utf-8")

    if changed or failed:
        lines = []
        if changed:
            lines.append("## 🔔 偵測到權益頁面異動\n")
            lines += [f"- **{label}**：<{url}>" for label, url in changed]
            lines.append("\n請到上列官方頁面確認權益是否調整，並更新 `data.js`。")
        if failed:
            lines.append("\n## ⚠️ 以下頁面抓取失敗（網址可能失效）\n")
            lines += [f"- **{label}**：<{url}>" for label, url in failed]
        CHANGES_FILE.write_text("\n".join(lines), encoding="utf-8")
        print(f"\n共 {len(changed)} 頁異動、{len(failed)} 頁抓取失敗，已寫入 {CHANGES_FILE}")
    else:
        if CHANGES_FILE.exists():
            CHANGES_FILE.unlink()
        print("\n✅ 所有權益頁面皆無異動")


if __name__ == "__main__":
    main()
