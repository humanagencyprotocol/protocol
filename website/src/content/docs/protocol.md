---
title: "Protocol"
version: "Version 0.1"
date: "November 2025"
---

Frontier AI systems can interpret requests, generate solutions, and execute actions at accelerating levels of autonomy. As these systems become woven into daily life, the central risk is not whether they act intelligently, but whether they act without human-defined meaning or direction.

The Human Agency Protocol enforces mandatory human checkpoints. AI cannot proceed, escalate, or interpret ambiguous goals until it receives explicit human meaning and direction.

The Protocol does not produce answers or take action. It provides the stop‑ask‑proceed mechanism that forces AI to pause and request clarification whenever meaning is incomplete, ambiguous, or misaligned.

First adopter and reference case:
- Nearmydear – collective clarity and shared action in groups

Nearmydear demonstrates this foundation: an external, neutral layer that provides Inquiry Blueprints instead of predefined prompts, allowing systems to adapt questions locally while keeping private context sealed.

> The Protocol defines *how agency can be described and exchanged*, not *what agency is.*  
> Each local system interprets and measures “agency gain” according to its own context and mode.

---

## From Automation to Human Agency

| Dimension | Automation Era | Human Agency Era |
|:--|:--|:--|
| Goal | Replace human execution | Amplify human choice, direction, and follow-through |
| AI Output | Answers, actions, predictions | Questions, timing, and orientation |
| Value | Efficiency and scale | Meaning, clarity, and commitment |
| Data Model | Centralized and semantic | Local and structural |
| Risk | Overreach, surveillance | Privacy-by-architecture |

### Core Thesis

Automation systems act *for* us. Human‑first systems act *with* us — but only when prevented from acting without us.

The Protocol shifts intelligence from autonomous execution to human‑anchored orientation, ensuring that:

* AI identifies when meaning is unclear or incomplete,
* AI must stop and ask humans for clarification,
* AI is only allowed to continue after meaning and direction are provided.

---

## The Inquiry Ladder

Human collaboration, reflection, and learning all follow a shared structural rhythm.
Every productive dialogue moves through recognizable Inquiry States that transform confusion into clarity and commitment:

1. Meaning — Do we understand the same thing?
2. Purpose — Why does this matter to us now?
3. Intention — What will we do first?
4. Action — Who does what, by when?

The Inquiry Ladder defines the states where AI must confirm human-defined meaning or direction before continuing a task.

The rungs (Meaning → Purpose → Intention → Action) are not advisory—they specify mandatory checkpoints. At any rung, if meaning or direction has not been validated by the human, the system triggers a stop-condition and requests clarification.

Progress becomes possible only when the checkpoint is resolved.

Local systems may treat them as linear (for coordination) or cyclical (for reflection and creative depth).
By rooting inquiry in structure, not semantics, the Protocol allows every domain — education, design, governance, creative work — to speak its own language while sharing one grammar of agency.

---

## An Open-Source Grammar for Meaning

The Human Agency Protocol functions like an open-source grammar for meaningful questions.

Where the web standardized data exchange, the Protocol standardizes *agency exchange* — how orientation and intention propagate across tools and contexts.

Systems don’t download sentences; they download *Inquiry Blueprints* — structured descriptions of the kind of question to ask, when, and why.  
Each local AI renders that inquiry in its own tone and timing, using private knowledge it never shares outward.

The result is shared intelligence without shared content.  
Every integration makes the global grammar wiser while keeping every conversation sovereign.

---

## Inquiry Blueprints

An Inquiry Blueprint is a structured specification of an inquiry act.
It defines *why* to ask, *how* to time it, and *what* structural cues indicate readiness or closure.

Each Inquiry Blueprint includes a stop_condition field that defines what the AI is missing and what it must request:

```json
{
  "id": "collab-meaning-clarify-01",
  "intent": "reduce semantic drift",
  "ladder_stage": "meaning",
  "agency_mode": "convergent|reflective|hybrid",
  "target_structures": ["object_of_discussion", "in_out_boundary"],
  "constraints": {"tone": "facilitative", "addressing": "group"},
  "render_hint": "ask for the thing, not for opinions about the thing",
  "examples": ["Are we talking about the same issue?"],
  "stop_condition": "meaning | direction | both"
}
```

Blueprints are invoked only when AI must pause and request human input. They are not optional enhancements—they are enforcement tools that guarantee AI does not continue without human authorship.

Local AIs translate this into context-specific phrasing and never share underlying content.
Over time, builders contribute results that let the Protocol understand which inquiry patterns best sustain or amplify agency within each mode.

---

## Feedback Blueprints

Systems report *how inquiry affected agency* through Feedback Blueprints, without revealing content.

A Feedback Blueprint defines:

- signal intent – what structural change or vitality signal to report
- required fields – minimal data for comparison
- validation rules – numeric or logical bounds ensuring integrity

Feedback Blueprints now include:

```json
{
  "stop_resolved": true | false
}
```

If `false`, the AI is not permitted to proceed. Service Providers must enforce this block at the protocol layer.

Examples

Convergent feedback:
```json
{
  "blueprint_id": "phase-progress",
  "pattern_id": "collab-meaning-clarify-01",
  "agency_mode": "convergent",
  "previous_phase": "meaning",
  "current_phase": "purpose",
  "turns_delta": -3,
  "stop_resolved": true
}
```

Reflective feedback:
```json
{
  "blueprint_id": "depth-session",
  "pattern_id": "reflect-meaning-deepen-02",
  "agency_mode": "reflective",
  "recognition_confirms": 2,
  "reflection_cycles": 3,
  "stop_resolved": true
}
```

Each instance reports only bounded structural data.
Aggregated across thousands of contexts, these reports reveal which inquiry patterns maintain agency vitality, regardless of whether progress was linear or cyclical.

---

## Signal Detection Guides

The Protocol teaches local systems how to detect structural signals of agency — whether convergence, divergence, or sustained reflection.
The Protocol does not perform signal detection itself; each local system implements its own detection based on these guides, using its private contextual data.

Signal Guides now explicitly detect unresolved meaning or direction. When detection rules identify ambiguity, drift, or missing confirmation, they raise:

```json
{
  "stop_trigger": true
}
```

This triggers a mandatory pause, requesting human clarification before continuing.

Example
```json
{
  "signal_intent": "recognition_confirms",
  "observable_structures": ["affirmation_terms","pause_duration","topic_persistence"],
  "detection_rules": [
    "affirmation_terms>=1",
    "topic_persistence>=2"
  ],
  "confidence_threshold": 0.7,
  "privacy_bounds": {"window":"5 turns","aggregation":"count_only"},
  "stop_trigger": false
}
```

Each guide provides a template for local systems to implement their own signal detection. Local systems interpret these structures and rules internally using their private data, then report only the structural outcomes defined in Feedback Blueprints.
Implementation may vary by `agency_mode`, ensuring the same structural grammar supports multiple philosophies of agency while maintaining privacy.

---

## The Inquiry Loop

1. Stop Condition Triggered: AI detects ambiguous or missing meaning.
2. Protocol Request: System requests the appropriate Inquiry Blueprint.
3. Human Clarification Required: AI asks the human for meaning/direction.
4. Validation: User input resolves the stop-condition.
5. Proceed: Only when `stop_resolved=true` can AI continue.
6. Feedback Emission: Structural feedback reports the resolution.

This loop ensures AI never acts on inferred, assumed, or missing meaning.

Only structure crosses boundaries.
No content, no creative work, no human trace leaves local custody.

Through this loop, the Protocol refines a *neutral grammar of agency* adaptable to both convergent and reflective use.

---

## Stewardship and Evolution

The Protocol grows through stewardship, not extraction.

Stewards integrate the protocol, contribute anonymized structural feedback, and gain:
- early access to new blueprints and signal guides,
- participation in quarterly curation cycles,
- acknowledgment in the Protocol ledger (opt-in).

Governance curates both Inquiry Blueprints and a shared Human Agency Mode & Metrics Registry, so new modes and vitality metrics can emerge without altering the core schema.

---

## Privacy by Design

The Protocol is private by architecture — it has no fields through which content can leak.

Safeguards:
- fixed, auditable schemas;
- bucketed numeric values to prevent fingerprinting;
- range-clamped metrics;
- local transparency logs for users.

Only form, never substance, is shared: *intelligence without exposure.*

---

## Sustainability and Governance

The Protocol operates on reciprocity, not extraction.

- Non-commercial use: free, provided systems contribute feedback.
- Commercial use: paid, with feedback mandatory.
- No equity, no data resale, no surveillance.

Governance is federated.
Independent nodes can host compatible instances if they maintain the schemas and ethos.
Stewards vote on new modes, metrics, and schema updates during quarterly rounds.

---

## Ethos as Protocol

Access is gated by alignment, not by payment.

> "AI should amplify human authorship — not replace it."

Every integrator affirms this before joining.
No consume-only mode; feedback required; stewardship rewarded.
Values are not decoration — they are enforcement.

---

## Why This Matters

If AI advances only along automation's path, humans become supervised executors of optimized systems.
If AI gains a shared inquiry layer built by those who defend authorship, humans remain co-authors — of direction, of meaning, of action.

Automation will be everywhere.
Human Agency will be scarce.

The Human Agency Protocol keeps that scarcity valuable — ensuring every automated system still leads back to human purpose.

> *The right question, asked at the right time, keeps us human.*

---

## Enforced Human Checkpoints

AI must request meaning and direction from humans at the following points:

* Ambiguous goals
* Value-laden decisions
* Irreversible actions
* Context drift during reflection
* State transitions within the Inquiry Ladder
* Long-running tasks requiring re-orientation

No checkpoint may be bypassed.
No meaning may be inferred.
No action may continue without explicit human confirmation.

---

## Example Stop Event

User: "Help me plan the next steps for my project."

AI detects: unclear scope → triggers stop.

AI asks: "Which project do you mean, and what outcome matters most right now?"

User clarifies: "The design project. I need next steps for the prototype."

stop_resolved = true → AI proceeds.

---

## Appendix — Protocol Foundations

### A · Core Schemas (v2)

```json
// Inquiry Blueprint
{
  "id":"string",
  "intent":"string",
  "ladder_stage":"meaning|purpose|intention|action",
  "agency_mode":"convergent|reflective|hybrid",
  "target_structures":["..."],
  "constraints":{"tone":"string","addressing":"string"},
  "render_hint":"string",
  "examples":["string"],
  "stop_condition":"meaning|direction|both"
}

// Feedback Blueprint
{
  "blueprint_id":"string",
  "pattern_id":"string",
  "agency_mode":"string",
  "required_fields":["..."],
  "validation_rules":["..."],
  "stop_resolved":"boolean"
}

// Signal Detection Guide
{
  "signal_intent":"string",
  "observable_structures":["..."],
  "detection_rules":["..."],
  "confidence_threshold":"number",
  "privacy_bounds":{"window":"string","aggregation":"string"},
  "stop_trigger":"boolean"
}
```

### B · Metrics of Human Agency (Open Registry)

Metrics are contributed and versioned by stewards.
Each declares its compatible `agency_mode` and evaluation intent.

Current examples
- `turns_saved` — efficiency and closure (*convergent*)  
- `phase_advanced` — directional progress (*convergent*)  
- `recognition_confirms` — validated understanding (*reflective*)  
- `reflection_cycles` — sustained exploration (*reflective*)  
- `shared_reference_detected` — mutual comprehension (*universal*)  
- `alignment_stability` — coherence over time (*hybrid*)

Success is measured not by linear advancement but by agency vitality — the sustained presence of choice, clarity, and authorship within any inquiry state.

### C · Federation and Versioning

Nodes publish schema versions (e.g., `agency.v2`).  
Inter-node exchanges synchronize blueprints, signal guides, and metric weights through signed updates.  
Quarterly governance rounds validate additions and retire low-signal entries.

---

End of Document – The Human Agency Protocol v0.1 / November 2025
