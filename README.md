# Human Agency Protocol

**Current: v0.2 — January 2026 | Proposal: v0.3**

> AI executes. Humans decide.

A protocol that forces AI to ask humans for meaning and direction before acting.

## What is HAP?

The Human Agency Protocol ensures humans remain in control of high-stakes AI-assisted decisions. It defines **gates** — checkpoints where automation pauses until a human explicitly authorizes the next step.

HAP doesn't evaluate the quality of human decisions. It guarantees that decisions were made by humans, under committed constraints, and creates a verifiable record of who decided what.

## Core Principles

### Human-First Direction
AI may surface information, but humans supply intent. Every commitment — problem statements, objectives, tradeoffs — must originate from human action.

### Verifiable Accountability
Attestations bind human identity to specific decisions. Gate content is hashed at signing time, making published decisions tamper-evident and auditable.

### Privacy by Design
Semantic content stays local. Only structural signals and hashes leave the local environment. The protocol guarantees verifiability without requiring disclosure.

## Documentation

### Current Specification (v0.2)
- **[Protocol](content/0.2/protocol.md)** — Core specification: frames, gates, attestations, profiles
- **[Deploy Gate Profile](content/0.2/deploy-gate-profile.md)** — Reference profile for deployment authorization
- **[Integration](content/0.2/integration.md)** — How to integrate HAP into existing workflows
- **[Service Providers](content/0.2/service.md)** — Service layer specification
- **[Governance](content/0.2/governance.md)** — Protocol governance and evolution

### v0.3 Proposal
- **[v0.3 Review](content/0.2/review.md)** — Multi-domain ownership, execution context binding, agent workflows

### Foundation (v0.1)
- **[Original Protocol](content/0.1/protocol.md)** — Foundational concepts and motivation

## Demo

The **Deploy Gate Demo** shows HAP in action for GitHub PR approvals:
- 6-gate flow: Decision Owner → Frame → Problem → Objective → Tradeoffs → Commitment
- Multi-person approval with domain-scoped attestations
- Cryptographic binding of human decisions to code changes

Visit [humanagencyprotocol.org/demo](https://humanagencyprotocol.org/demo) for the live demo.

## Website

Visit [humanagencyprotocol.org](https://humanagencyprotocol.org) for the complete specification.

To run locally:

```bash
cd website
npm install
npm run dev
```

## Why HAP Exists

AI systems are increasingly capable of autonomous action. The question is no longer "can AI do this?" but "should AI do this without asking?"

HAP answers: **No.** For high-stakes decisions, AI must pause and ask. Humans must explicitly authorize. And that authorization must be verifiable.

This isn't about slowing down AI. It's about ensuring that when AI acts, it acts with human authorization — and that authorization is provable.

## Repository Structure

```
.
├── content/
│   ├── 0.1/               # Foundation specification
│   │   ├── protocol.md
│   │   ├── service.md
│   │   └── governance.md
│   └── 0.2/               # Current specification
│       ├── protocol.md
│       ├── deploy-gate-profile.md
│       ├── integration.md
│       ├── service.md
│       ├── governance.md
│       └── review.md      # v0.3 proposal
├── website/               # humanagencyprotocol.org
└── README.md
```

## Contributing

HAP is open infrastructure. Contributions welcome from:

- Developers integrating HAP into AI systems
- Researchers studying human-AI decision making
- Policy makers working on AI governance
- Organizations needing accountable AI workflows

## License

MIT

---

*The Human Agency Protocol is maintained by stewards, not owners.*
