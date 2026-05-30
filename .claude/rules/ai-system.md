# AI System Rules

## System Goal

This AI system transforms non-standard speech into accurate, understandable, standard expression.

It supports:

* accented speech correction
* speech-impaired user communication assistance
* standard text output
* standard voice output

## Core AI Pipeline

```
Audio → ASR → Uncertainty Detection → Semantic Repair → Standard Expression Generation → TTS → Feedback Logging → Lightweight Adaptation
```

## ASR Rules

* Use faster-whisper as the main controllable ASR baseline in V1.
* Do not train ASR from scratch in V1.
* Do not replace the whole pipeline with a single black-box model.
* ASR output is not final output.
* ASR output is an intermediate representation for repair.
* Preserve ASR segments and timestamps when available.

## Uncertainty Rules

The system must identify high-risk regions such as:

* low-confidence spans
* unclear words
* named entities
* numbers
* technical terms
* possible substitutions
* speech disfluency
* repeated fragments
* incomplete phrases

Uncertainty output should be structured as JSON.

## Semantic Repair Rules

* Use LLM for constrained repair.
* LLM must not freely rewrite the entire transcript.
* Only modify uncertain or high-risk spans unless explicitly instructed.
* Preserve high-confidence text.
* Prefer semantic consistency over literal acoustic similarity.
* Prefer domain lexicon and context memory when available.
* Avoid hallucinated content.
* If uncertain, provide alternatives or mark uncertainty instead of inventing.
* Keep repaired output faithful to the speaker's intended meaning.
* For speech-impaired users, produce standard expression without changing intended meaning.

## Standard Output Rules

The system should produce:

* raw ASR text
* repaired text
* standard expression text
* optional explanation of edits
* TTS-ready text
* final voice output reference

## TTS Rules

* TTS converts standard expression text into understandable speech.
* V1 can use a generic standard voice.
* Future versions may support personalized voice or user-preferred voice.
* TTS should not change content meaning.

## Feedback and Learning Rules

* Errors are data, not failures.
* Store correction examples.
* Store user feedback.
* Store raw text, repaired text, final corrected text, and error type.
* Use feedback to update:
  * lexicon
  * entity cache
  * confusion pairs
  * repair rules
  * prompts

## Lightweight Adaptation Rules

* Do not retrain large models in V1.
* Use lexicon updates, cache updates, rules, and prompt refinement first.
* Consider small reranker or fine-tuning only after enough high-quality data exists.

## Prompt Management Rules

* Store repair prompts in `prompts/repair_prompt.md`.
* Store uncertainty prompts in `prompts/uncertainty_prompt.md` if needed.
* Do not hardcode long prompts inside service code.
* Version important prompts.

## Safety and Ethics Rules

* Do not frame accents as wrong or inferior.
* Use respectful language.
* Do not claim to diagnose speech disorders.
* This system assists communication; it is not a medical diagnosis tool.
* Preserve user intent.
* Protect audio privacy.

---

When implementing AI features, prioritize faithfulness, controllability, transparency, and user dignity.
