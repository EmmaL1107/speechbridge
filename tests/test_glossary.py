"""词汇表测试"""

from src.speechbridge.rag.glossary import Glossary, GlossaryEntry, GlossaryManager


def test_glossary_lookup():
    """测试词汇查找"""
    glossary = Glossary(
        name="test",
        entries=[
            GlossaryEntry(
                term="hypertension",
                aliases=["hyper tension", "high blood pressure"],
                category="medical",
            ),
        ],
    )

    assert glossary.lookup("hypertension") is not None
    assert glossary.lookup("hyper tension") is not None
    assert glossary.lookup("HYPERTENSION") is not None  # 大小写不敏感
    assert glossary.lookup("unknown") is None


def test_glossary_correct_text():
    """测试文本纠正"""
    glossary = Glossary(
        name="test",
        entries=[
            GlossaryEntry(
                term="Kubernetes",
                aliases=["kubernets", "k8s"],
                category="tech",
            ),
        ],
    )

    text = "We use kubernets for deployment"
    corrected, corrections = glossary.correct_text(text)

    assert "Kubernetes" in corrected
    assert len(corrections) == 1
    assert corrections[0]["original"] == "kubernets"
    assert corrections[0]["corrected"] == "Kubernetes"


def test_glossary_manager_multiple():
    """测试多词汇表管理"""
    manager = GlossaryManager()

    g1 = Glossary(
        name="medical",
        entries=[GlossaryEntry(term="diabetes", aliases=["diabetis"], category="medical")],
    )
    g2 = Glossary(
        name="tech",
        entries=[GlossaryEntry(term="API", aliases=["a p i"], category="tech")],
    )

    manager.add_glossary(g1)
    manager.add_glossary(g2)

    assert len(manager.list_glossaries()) == 2

    corrected, corrections = manager.correct_text("The diabetis patient needs a p i access")
    assert "diabetes" in corrected
    assert "API" in corrected


def test_glossary_manager_from_dir(tmp_path):
    """测试从目录加载词汇表"""
    import json

    glossary_data = {
        "name": "test",
        "entries": [
            {"term": "PostgreSQL", "aliases": ["postgres"], "category": "tech"},
        ],
    }

    path = tmp_path / "test.json"
    path.write_text(json.dumps(glossary_data))

    manager = GlossaryManager(tmp_path)
    assert "test" in manager.glossaries
    assert len(manager.glossaries["test"].entries) == 1


def test_glossary_preserves_punctuation():
    """测试保留标点符号"""
    glossary = Glossary(
        name="test",
        entries=[
            GlossaryEntry(term="Kubernetes", aliases=["kubernets"], category="tech"),
        ],
    )

    text = "kubernets is great!"
    corrected, _ = glossary.correct_text(text)
    assert corrected == "Kubernetes is great!"
