---
title: "Integration"
version: "Version 0.3"
date: "December 2025"
---

The HAP SDK gives builders a simple way to embed the Human Agency Protocol into any AI system.

It does two things:

1. **Enforces protocol compliance** — Stop → Ask → Confirm → Proceed
2. **Improves local question-asking over time** — without ever leaking content

The SDK ensures that **AI cannot advance** past key direction checkpoints until a human has confirmed or committed to them.

---

## What the SDK Provides

### 1. Protocol Compliance

The SDK handles all communication with a HAP Service Provider:

- requesting **Inquiry Blueprints** for specific ladder stages
- emitting **Feedback** with purely structural fields
- enforcing the **Stop → Ask → Confirm → Proceed** loop in your app

It guarantees that only **structural signals** leave local custody.
All user content (prompts, answers, context) stays local.

### 2. Local Question Optimisation

The SDK also includes a lightweight optimisation helper that lets your system:

- log how often stop-conditions are triggered
- measure how quickly humans resolve checkpoints
- compare question strategies (A/B) locally

All optimisation uses structural results only (e.g., `stop_resolved`, `turns_to_resolution`).
No semantics are ever sent to HAP.

---

## Direction-Aware Architecture

```text
app / platform
   │
   ├── hap-sdk
   │     ├── hap-client         (protocol integration)
   │     ├── types              (structural types for direction)
   │     ├── question-spec      (Blueprint → QuestionSpec mapping)
   │     ├── runtime-guards     (Stop → Ask → Confirm → Proceed)
   │     └── metrics & logging  (local optimisation signals)
   │
   └── local-ai
         ├── stage-detector     (meaning/purpose/commitment/action)
         ├── gap-detector       (detects missing direction)
         ├── question-engine    (LLM / rules)
         └── optimisation layer (integrator-defined)
```

The SDK never handles or transmits:

- user input
- model prompts
- generated answers

It only sees and enforces direction structure.

## Core Concepts in the SDK

### Direction Ladder (in code)

The SDK exposes typed ladder stages:

- `meaning`
- `purpose`
- `commitment`
- `action`

Your system uses these to tell HAP which checkpoint it is enforcing.

### Operational Loop

The SDK helps enforce the runtime loop:

**Stop → Ask → Confirm → Proceed**

- **Stop** — your system detects missing/unclear direction
- **Ask** — SDK fetches an Inquiry Blueprint and helps generate a question
- **Confirm** — user resolves the checkpoint (e.g. clarifies meaning, chooses purpose, or commits)
- **Proceed** — your system resumes only after confirmation

At the **commitment** stage, confirmation means:
_direction chosen, alternatives closed, cost accepted_ (you enforce this locally in your UX).

## SDK Modules

### 4.1 hap-client

**Responsibilities:**

- communicate with the HAP Service Provider
- request Inquiry Blueprints for specific ladder stages
- send Feedback payloads with struct-only fields
- validate payloads against the HAP schema

**Key rule:**
hap-client never handles raw content. Only IDs, flags, counts, and ladder stages.

### 4.2 types

Shared structural types, including:

- `LadderStage = "meaning" | "purpose" | "commitment" | "action"`
- Inquiry Blueprint types (structural only)
- Feedback types (`stop_resolved`, `direction_chosen`, `cost_accepted`, etc.)
- Signal / metric fields (e.g., `turns_to_resolution`)

There are **no text fields** for questions, answers, or context.

### 4.3 question-spec

Converts an Inquiry Blueprint into a QuestionSpec for your local question engine.

**Blueprint in → QuestionSpec out**

QuestionSpec contains structural hints (e.g., `ladder_stage`, `render_hint`, `target_structures`)

Your questionEngine turns that into natural language using local context

This keeps protocol types and local UX concerns clearly separated.

### 4.4 runtime-guards

Runtime Guards help you enforce **Stop → Ask → Confirm → Proceed** in your app.

Typical responsibilities:

- determining whether a stop-condition exists (gap-detector)
- coordinating with hap-client to fetch Inquiry Blueprints
- orchestrating the questioning and confirmation flow
- preventing downstream execution when `stop_resolved = false`

You own the UX; runtime-guards ensures it remains protocol-compliant.

### 4.5 metrics (local optimisation)

A helper module for local-only analysis:

- logs number of stops, resolution times, unresolved cases
- lets you A/B test different question patterns
- helps you tune your own questionEngine

This module never communicates with HAP directly.
It is purely for your local models and systems.

## Example Integration Flow

TypeScript-style pseudo-code, aligned with v0.3:

```typescript
import { HapClient } from "hap-sdk/hap-client";
import { StopGuard } from "hap-sdk/runtime-guards";
import { QuestionOutcomeLogger } from "hap-sdk/metrics";
import { LadderStage } from "hap-sdk/types";

const hapClient = new HapClient({
  endpoint: process.env.HAP_ENDPOINT!,
  apiKey: process.env.HAP_API_KEY!,
});

// Local question engine (you own this)
const questionEngine = {
  async generateQuestion(context: any, spec: QuestionSpec): Promise<string> {
    // Call local LLM / rule system using spec + context
    return myLocalLLM.generateQuestion(context, spec);
  },
};

const stopGuard = new StopGuard(hapClient, questionEngine);
const metrics = new QuestionOutcomeLogger();

async function handleUserInput(context: any) {
  // 1. Detect whether a direction gap exists
  const stopCondition = detectStopCondition(context);
  // e.g. { ladderStage: "purpose", reason: "conflicting priorities" }

  if (!stopCondition) {
    return continueNormalFlow(context);
  }

  // 2. Enforce Stop → Ask → Confirm → Proceed
  const { resolved, question, blueprintId } =
    await stopGuard.ensureDirection(context, stopCondition);

  if (!resolved && question) {
    // 3. Show question to user
    const answer = await askUser(question);

    // 4. Update local context (you own interpretation)
    const updatedContext = updateContextWithAnswer(context, answer);

    // 5. Compute structural outcome
    const outcome = evaluateResolution(updatedContext, stopCondition);

    // 6. Send structural feedback to HAP
    await hapClient.sendFeedback({
      blueprintId,
      ladderStage: stopCondition.ladderStage as LadderStage,
      stopResolved: outcome.stopResolved,
      directionChosen: outcome.directionChosen ?? false,
      costAccepted: outcome.costAccepted ?? false,
    });

    // 7. Log locally for optimisation
    metrics.log({
      ladderStage: stopCondition.ladderStage,
      stopResolved: outcome.stopResolved,
      turnsToResolution: outcome.turnsDelta,
    });

    if (!outcome.stopResolved) {
      // still unresolved → do not proceed
      return;
    }

    // 8. With direction now confirmed, continue
    return continueNormalFlow(updatedContext);
  }
}
```

**Key invariants:**

- HAP never sees context, question, or answer.
- Your system decides how to ask, how to interpret, and how to verify cost/commitment.
- HAP only sees that a direction checkpoint was:
  - triggered
  - questioned
  - resolved or not

## Design Principles

### 6.1 Strict Separation of Concerns

**Protocol layer** (hap-client):
structure, schemas, compliance, enforcement

**Local layer** (question-engine + optimisation):
prompts, models, UX, learning

### 6.2 No Semantic Leakage

The SDK doesn't know:

- what users said
- why they chose something
- what the content is about

It only knows which stage of the Direction Ladder was enforced and whether it was resolved.

### 6.3 Direction Integrity by Construction

Done correctly:

- Every critical action is preceded by Meaning, Purpose, and (when required) Commitment.
- AI never runs ahead on inferred or missing direction.
- Direction always leads back to a human.

### 6.4 Local Sovereignty

You own:

- your models
- your prompts
- your heuristics
- your logs
- your optimisation strategy

HAP only ensures you don't accidentally remove humans from the loop where it matters.

## SDK Availability

**TypeScript SDK (v0.3.x)** — reference implementation

- Installation, quick-start, and examples
- Direction Ladder types
- Runtime guards for Stop → Ask → Confirm → Proceed

Other language SDKs (Python, Go, etc.) will follow once the core spec stabilizes.

**GitHub** (example):
humanagencyprotocol/hap-sdk-typescript
