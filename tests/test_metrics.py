"""评估指标测试"""

from src.speechbridge.evaluation.metrics import (
    compute_entity_f1,
    compute_wer,
    evaluate,
)


def test_wer_perfect():
    """完全匹配时 WER = 0"""
    assert compute_wer("hello world", "hello world") == 0.0


def test_wer_one_substitution():
    """一个替换错误"""
    wer = compute_wer("hello world", "hello word")
    assert 0 < wer <= 1.0


def test_wer_empty_reference():
    """空参考文本"""
    assert compute_wer("", "hello") == 1.0
    assert compute_wer("", "") == 0.0


def test_wer_completely_wrong():
    """完全错误"""
    wer = compute_wer("hello world", "foo bar baz")
    assert wer > 0


def test_entity_f1_perfect():
    """完全匹配时 F1 = 1.0"""
    pred = [{"name": "John", "type": "person"}]
    ref = [{"name": "John", "type": "person"}]
    assert compute_entity_f1(pred, ref) == 1.0


def test_entity_f1_empty():
    """两者都为空时 F1 = 1.0"""
    assert compute_entity_f1([], []) == 1.0


def test_entity_f1_no_match():
    """无匹配时 F1 = 0.0"""
    pred = [{"name": "John"}]
    ref = [{"name": "Jane"}]
    assert compute_entity_f1(pred, ref) == 0.0


def test_entity_f1_partial():
    """部分匹配"""
    pred = [{"name": "John"}, {"name": "Alice"}]
    ref = [{"name": "John"}, {"name": "Bob"}]
    f1 = compute_entity_f1(pred, ref)
    assert 0 < f1 < 1.0


def test_evaluate():
    """综合评估"""
    result = evaluate(
        reference_text="I want to go to the airport tomorrow",
        hypothesis_text="I want to go to the arport tomorow",
        reference_intent="travel_request",
        hypothesis_intent="travel_request",
        reference_entities=[{"name": "airport", "type": "place"}],
        hypothesis_entities=[{"name": "arport", "type": "place"}],
        latency=1.5,
    )

    assert 0 < result.wer < 1.0
    assert result.intent_correct is True
    assert result.latency == 1.5
