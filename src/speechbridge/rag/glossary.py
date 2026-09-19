"""领域词汇表管理 — RAG 纠正"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class GlossaryEntry:
    """词汇表条目"""
    term: str               # 标准术语
    aliases: list[str]      # 常见误识别变体
    category: str           # 类别 (medical, tech, legal, etc.)
    description: str = ""   # 描述


@dataclass
class Glossary:
    """领域词汇表"""
    name: str
    entries: list[GlossaryEntry] = field(default_factory=list)
    _alias_map: dict[str, GlossaryEntry] = field(default_factory=dict, repr=False)

    def __post_init__(self):
        self._build_index()

    def _build_index(self):
        """构建别名索引"""
        self._alias_map = {}
        for entry in self.entries:
            # 标准术语本身也加入索引
            self._alias_map[entry.term.lower()] = entry
            for alias in entry.aliases:
                self._alias_map[alias.lower()] = entry

    def lookup(self, word: str) -> GlossaryEntry | None:
        """查找词汇"""
        return self._alias_map.get(word.lower())

    def correct_text(self, text: str) -> tuple[str, list[dict]]:
        """
        纠正文本中的术语.

        Returns:
            (corrected_text, corrections)
        """
        corrections = []
        corrected = text

        # 先处理多词别名 (从长到短)
        multi_word_entries = []
        for entry in self.entries:
            for alias in entry.aliases:
                if " " in alias:
                    multi_word_entries.append((alias, entry))
        # 按长度降序排列, 优先匹配更长的短语
        multi_word_entries.sort(key=lambda x: len(x[0]), reverse=True)

        for alias, entry in multi_word_entries:
            if alias.lower() in corrected.lower():
                # 找到匹配, 替换
                import re
                pattern = re.compile(re.escape(alias), re.IGNORECASE)
                match = pattern.search(corrected)
                if match:
                    old_text = match.group()
                    corrected = pattern.sub(entry.term, corrected, count=1)
                    corrections.append({
                        "original": old_text,
                        "corrected": entry.term,
                        "term": entry.term,
                        "category": entry.category,
                    })

        # 再处理单词别名
        words = corrected.split()
        for i, word in enumerate(words):
            clean_word = word.strip(".,!?;:\"'()[]{}").lower()
            entry = self.lookup(clean_word)
            if entry and clean_word != entry.term.lower():
                old_word = words[i]
                # 保持原始标点
                prefix = ""
                suffix = ""
                for ch in old_word:
                    if ch.isalpha():
                        break
                    prefix += ch
                for ch in reversed(old_word):
                    if ch.isalpha():
                        break
                    suffix = ch + suffix

                new_word = prefix + entry.term + suffix
                words[i] = new_word
                corrections.append({
                    "original": old_word,
                    "corrected": new_word,
                    "term": entry.term,
                    "category": entry.category,
                })

        corrected = " ".join(words)
        return corrected, corrections


class GlossaryManager:
    """词汇表管理器"""

    def __init__(self, glossary_dir: str | Path | None = None):
        self.glossaries: dict[str, Glossary] = {}
        if glossary_dir:
            self.load_from_dir(glossary_dir)

    def load_from_dir(self, directory: str | Path):
        """从目录加载所有词汇表"""
        directory = Path(directory)
        if not directory.exists():
            logger.warning(f"词汇表目录不存在: {directory}")
            return

        for path in directory.glob("*.json"):
            try:
                self.load_file(path)
            except Exception as e:
                logger.error(f"加载词汇表失败 {path}: {e}")

    def load_file(self, path: str | Path):
        """加载单个词汇表文件"""
        path = Path(path)
        with open(path) as f:
            data = json.load(f)

        entries = []
        for item in data.get("entries", []):
            entries.append(GlossaryEntry(
                term=item["term"],
                aliases=item.get("aliases", []),
                category=item.get("category", "general"),
                description=item.get("description", ""),
            ))

        glossary = Glossary(name=data.get("name", path.stem), entries=entries)
        self.glossaries[glossary.name] = glossary
        logger.info(f"加载词汇表: {glossary.name} ({len(entries)} 条)")

    def add_glossary(self, glossary: Glossary):
        """添加词汇表"""
        self.glossaries[glossary.name] = glossary

    def correct_text(self, text: str, glossary_names: list[str] | None = None) -> tuple[str, list[dict]]:
        """
        使用词汇表纠正文本.

        Args:
            text: 原始文本
            glossary_names: 指定使用的词汇表 (None = 全部)

        Returns:
            (corrected_text, all_corrections)
        """
        all_corrections = []
        corrected = text

        glossaries = self.glossaries.values()
        if glossary_names:
            glossaries = [self.glossaries[n] for n in glossary_names if n in self.glossaries]

        for glossary in glossaries:
            corrected, corrections = glossary.correct_text(corrected)
            all_corrections.extend(corrections)

        return corrected, all_corrections

    def list_glossaries(self) -> list[dict]:
        """列出所有词汇表"""
        return [
            {"name": g.name, "entries": len(g.entries)}
            for g in self.glossaries.values()
        ]
