---
title: "Protocol"
version: "Version 0.3"
date: "December 2025"
---

AI systems increasingly execute tasks, optimize outcomes, and escalate actions without human intervention.
The central risk is no longer misalignment — it is direction drift:

**AI acting without human-defined meaning, purpose, and commitment.**

HAP prevents this by enforcing mandatory direction checkpoints.
Whenever AI detects ambiguity or missing human leadership, it must stop, ask, and wait until direction is re-established.

The Protocol does not produce answers.
It enforces the conditions under which answers may be acted upon.

---

## Why Direction Is the Last Human Scarcity

Automation makes execution abundant.
AI can generate options, simulate outcomes, and run any path.

What AI cannot do is create direction — because direction requires:

- **Meaning** — defining the frame
- **Purpose** — choosing why it matters
- **Commitment** — accepting the cost and responsibility of a chosen path

Commitment is a directional choice made real by cost — selecting one path, closing the others, and accepting responsibility for the consequences.

Only humans can bear the cost of direction.
This triad — **Meaning → Purpose → Commitment** — is the irreducible human scarcity.

HAP exists to protect it.

---

## The Direction Ladder

All productive human decision-making follows the same structural sequence:

### **Meaning — What are we talking about?**
Establishing the shared frame. Without this, AI cannot act.

### **Purpose — Why does this matter now?**
Direction requires prioritization. Every yes is also a no.

### **Commitment — What direction will we choose?**
A choice becomes direction only when cost is accepted and alternatives are closed.

### **Action — Who does what, by when?**
Execution is automated. Responsibility is not.

AI must confirm each stage in order.
No skipping, no inference, no automated assumption of meaning or intent.

---

## Core Protocol Principle

HAP enforces direction before action.

Whenever direction is unclear or incomplete, AI must:

**Stop → Ask → Commit → Proceed**

### **Stop**
AI detects missing or ambiguous meaning, purpose, or commitment.

### **Ask**
A structured Inquiry Blueprint is triggered to obtain missing direction.

### **Confirm**
The human resolves the checkpoint by providing clarity.

### **Proceed**
Only once commitment is resolved and validated may the AI act.

Every checkpoint is enforced.
Every commitment is logged.
Every action traces back to human direction.

---

## Inquiry Blueprints

An Inquiry Blueprint defines how AI must ask for missing direction and when it must pause.

Blueprint fields:

```json
{
  "id": "string",
  "intent": "string",
  "ladder_stage": "meaning|purpose|commitment|action",
  "target_structures": ["..."],
  "constraints": {"tone":"string","addressing":"string"},
  "render_hint": "string",
  "examples": ["string"],
  "stop_condition": "meaning|purpose|commitment"
}
```

Blueprints are not prompts.
They are standardized structures ensuring:

- humans define the frame (Meaning)
- humans choose the priority (Purpose)
- humans choose the direction (Commitment)

Local AIs generate surface language privately; the protocol governs timing and necessity.

---

## Feedback Blueprints

Feedback Blueprints allow systems to report structural outcomes without revealing any semantic content.

Example:

```json
{
  "blueprint_id": "commitment-confirm",
  "ladder_stage": "commitment",
  "direction_selected": true,
  "commitment_recorded": true,
  "stop_resolved": true
}
```

If `stop_resolved` is false, the AI may not proceed.

Feedback is strictly structural — counts, confirmations, transitions — never content.

---

## Signal Detection Guides

Local systems detect when direction is missing or degraded.

Guides define structural indicators such as:

- semantic drift
- contradictory purpose statements
- unresolved alternatives
- lack of explicit commitment
- no responsible owner for action

Example template:

```json
{
  "signal_intent": "unresolved_purpose",
  "observable_structures": ["priority_terms", "conflict_markers"],
  "detection_rules": [
    "priority_terms < 1",
    "conflict_markers >= 1"
  ],
  "confidence_threshold": 0.7,
  "stop_trigger": true
}
```

If a stop-trigger is raised, AI must halt and request direction.

---

## The Direction Loop

1. Stop condition triggered
2. Blueprint requested
3. Human answers the directional question
4. Direction validated (Meaning → Purpose → Commitment)
5. AI proceeds with action
6. Feedback emitted

This ensures every action is traceable to human direction.

---

## Human-Gated Actions

AI may not:

- interpret ambiguous goals
- proceed on inferred purpose
- choose between competing priorities
- decide direction on its own
- execute without explicit commitment

High-risk actions require higher rungs:

- **Meaning-level clarity** for informational tasks
- **Purpose-level clarity** for strategic tasks
- **Commitment-level clarity** for operational execution
- **Action-level responsibility** for publishing, sending, deploying

This enforces human leadership where it matters.

---

## Privacy by Architecture

No semantic content ever leaves local custody.

Protocol data includes only:

- structural transitions
- confirmation counts
- stage completions
- commitment metadata

**No transcripts**
**No intent extraction**
**No user profiling**

The protocol makes authorship verifiable without exposing content.

---

## Service Providers

Service Providers enforce:

- blueprint validation
- schema fidelity
- stop-condition enforcement
- compliance proofs

They cannot access or store user content.
They do not own data or users.

They ensure the protocol is followed — not exploited.

---

## Governance

Governance is federated, lightweight, and proof-based.

A Provider loses qualification if it:

- allows AI to act without commitment
- bypasses required checkpoints
- infers meaning or purpose
- stores content
- trains on user data

Qualification requires:

- schema adherence
- privacy proofs
- stop-condition guarantees
- transparent logs

Direction integrity is enforced, not assumed.

---

## Example Stop Event

**User:** "Help me launch my product."

AI detects: unclear Purpose and no Commitment → **Stop**

**AI (via Blueprint):**
"What outcome matters most right now — revenue, reach, or learning?"

**User:** "Learning. I want to test the core idea."

Purpose confirmed.

**AI:**
"Which path will you commit to for that — and what cost are you willing to accept?"

**User:** "I'll run a small paid test even if it fails."

Commitment recorded → **Proceed**

---

## Summary: What HAP Protects

In an automated world:

- Execution is cheap
- Options are infinite
- **Direction is scarce**

HAP protects the human role in defining direction by enforcing:

- **Meaning** (framing)
- **Purpose** (prioritization)
- **Commitment** (cost-bearing choice)
- **Action** (responsibility)

AI executes.
Humans decide what execution is for.

**HAP ensures automation serves human direction — not the reverse.**


