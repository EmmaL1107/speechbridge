# Coding Style Rules

## General Rules

* Write clear, maintainable, production-oriented code.
* Prefer simple code over clever code.
* Use meaningful names.
* Avoid deeply nested logic.
* Avoid duplicated code.
* Add comments only when they explain non-obvious decisions.
* Do not over-engineer V1.
* Keep future scalability in mind.

## TypeScript Rules

* Use TypeScript strictly.
* Avoid `any` unless absolutely necessary.
* Define shared types for API responses.
* Keep components typed.
* Use clear file names.
* Prefer named exports for shared components and utilities.

## React / Next.js Rules

* Keep UI components pure when possible.
* Keep side effects in hooks or service calls.
* Do not mix API logic and UI rendering.
* Do not create giant page files.
* Break complex UI into components.
* Use loading, success, error, and empty states.

## Python Rules

* Use type hints.
* Use Pydantic schemas for API validation.
* Use clear service classes or functions.
* Keep functions small and testable.
* Avoid global mutable state.
* Handle exceptions explicitly.
* Use logging carefully.

## Formatting Rules

* Keep consistent formatting.
* Use Prettier for frontend.
* Use Ruff or Black for Python if configured.
* Do not introduce unnecessary dependencies.

## Testing Rules

* Add basic tests for utility functions.
* Add API tests for backend endpoints when possible.
* Add mock tests for AI service wrappers.
* Do not require real paid API calls in tests.
* Use mock responses for LLM tests.

## Git Rules

* Make small commits.
* Commit after each meaningful milestone.
* Use clear commit messages.
* Do not commit secrets.
* Do not commit large audio datasets.

## Documentation Rules

* Update docs when architecture changes.
* Keep API response examples updated.
* Keep prompt templates in `prompts/` rather than hardcoding them.

---

Code quality matters because this project will evolve over multiple phases.
