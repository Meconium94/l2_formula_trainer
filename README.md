# Finance Formula Trainer

A free, open-source flashcard app for finance formula practice. Built around a spaced-repetition engine: formulas you struggle with appear more often, formulas you've mastered are tested less frequently — but never dropped entirely.

**This is a personal study tool shared as-is with the community.** It is not exhaustive, not officially vetted, and makes no claim of accuracy or completeness. Use it as a complement to your own materials, not as a substitute for them.

---

## Features

- **Mastery system (Leitner-style)**: each concept has a level from 0 (struggling) to 7 (solid). Wrong answer → −2 levels. Correct → +1. Every concept stays in the pool permanently.
- **Weighted shuffle**: weak concepts cluster toward the start of each session, but mastered ones are still tested throughout via probabilistic interleaving.
- **Sprint Sur-Mesure**: dedicated mode that focuses exclusively on concepts below mastery level 3.
- **Master List**: full formula reference with live mastery badges per concept.
- **Persistent memory**: progress is saved to `localStorage` — no account needed.
- **KaTeX rendering**: all formulas are rendered via KaTeX for clean mathematical notation.

## Topics covered

- Quantitative Methods & Economics
- Financial Statement Analysis (FSA)
- Corporate Issuers
- Equity Valuation
- Fixed Income
- Derivatives
- Alternative Investments
- Portfolio Management

## Getting started

```bash
# In a React project (Vite, CRA, etc.)
cp formula_trainer.jsx src/App.jsx
npm run dev
```

Requires React 18+. KaTeX is loaded via CDN at runtime — no extra install needed.

## Tech stack

- React (hooks only, no external state library)
- Tailwind CSS (via CDN or your own setup)
- KaTeX (CDN)

---

## Licenses

**Code** — MIT License. Do whatever you want with it. See `LICENSE`.

**Content** (formula selection, notes, topic structure, written explanations) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

If you reuse or redistribute the content, attribution is appreciated:

> *Finance Formula Trainer — content by [your name/handle], code MIT, content CC BY 4.0.*

---

## Honest notes

- Built with Claude. Content curation, formula selection and notes are mine.
- The formula database reflects my own study choices — some topics may be more detailed than others.
- There are likely errors or omissions. If you spot one, feel free to open an issue or submit a PR.
- This project has no affiliation with any professional certification body, publisher, or financial institution.

---

## Contributing

Pull requests welcome. If you want to add formulas, fix a typo, or improve the mastery algorithm, go for it. Keep the MIT/CC-BY split in mind when contributing content vs. code.
