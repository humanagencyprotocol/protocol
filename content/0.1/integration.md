---
title: "Integration"
version: "Version 0.1"
date: "November 2025"
---

One SDK for human-aligned AI — with a local optimisation engine inside. The HAP SDK gives builders a simple way to integrate the Human Agency Protocol into any AI system.

It provides two capabilities in one package:

## 1. Protocol Compliance

The SDK handles all communication with a HAP Service Provider — requesting Inquiry Blueprints, emitting structural Feedback, and enforcing Stop → Ask → Proceed.

It guarantees that only structural signals leave local custody, keeping all user content private and ensuring full alignment with the Protocol.

## 2.Local Question Optimisation

The SDK also includes a local optimisation engine that systems can use to improve their own question-asking over time.

Using only structural outcomes — such as whether a stop-condition was resolved or how quickly clarity was reached — the engine helps the AI refine how it asks questions while keeping all semantics local.

---

### SDK Availability

- **[TypeScript SDK (v0.2.0)](/integration/sdk)** — Reference implementation for builders exploring HAP today
  Full documentation for the HAP SDK including installation, quick start guides, metadata helpers, and blueprint selection strategies. The SDK is under active development; other language SDKs (Python, Go, more) will follow the same contract once the spec stabilises.
  **GitHub:** [humanagencyprotocol/hap-sdk-typescript](https://github.com/humanagencyprotocol/hap-sdk-typescript)

---

## High-Level Architecture

```text
app / platform
   │
   ├── hap-sdk
   │     ├── hap-client         (protocol integration)
   │     ├── types              (shared structural types)
   │     ├── question-spec      (Inquiry → QuestionSpec mapping)
   │     ├── runtime-guards     (stop/ask/proceed enforcement)
   │     └── metrics & logging  (local optimisation signals)
   │
   └── local-ai
         ├── rung-detector
         ├── gap-detector
         ├── question-engine    (LLM / rules)
         └── optimisation layer (integrator-defined)
```

The SDK never handles or transmits semantic content (user text, prompts, answers).
It deals only in structured, bounded fields.

---

## Core Modules

### HAP Client

Responsibilities:
- Type-safe client for the HAP Service Provider
- Handles requesting Inquiry Blueprints and sending Feedback
- Validates outgoing payloads so only structural fields are sent

Key rule: All requests and payloads are struct-only.

### Types

All shared structural types live here:

- Ladder stages: meaning, purpose, intention, action
- Agency modes: convergent, reflective, hybrid
- Inquiry Blueprints with stop conditions
- Feedback payloads with structural metrics only

No raw text fields. No user content.

### Question Spec

Converts an Inquiry Blueprint from HAP into a local QuestionSpec that the Question Engine can use.

This keeps protocol types separate from local engine types, while preserving intent.

### Runtime Guards

Provides utilities to enforce Stop → Ask → Proceed in the host app.

The host app:
- Shows the question to the user
- Updates local state after the answer
- Computes `stop_resolved`
- Calls `sendFeedback(...)` with struct-only data

### Metrics (Local Optimisation Helpers)

This package never talks to HAP directly.
It helps integrators log and analyse how well their question engine performs.

Integrators can use these logs to:
- fine-tune their Question Engine
- A/B test prompting styles
- adapt models or heuristics — all locally

---

## Example Integration Flow

```typescript
import { HapClient } from "hap-sdk/hap-client";
import { StopGuard } from "hap-sdk/runtime-guards";
import { QuestionOutcomeLogger } from "hap-sdk/metrics";

// 1. Create HAP client
const hapClient = new HapClient({
  endpoint: process.env.HAP_ENDPOINT!,
  apiKey: process.env.HAP_API_KEY!,
});

// 2. Implement local QuestionEngine
const questionEngine = {
  async generateQuestion(context: any, spec: QuestionSpec): Promise<string> {
    // Call local LLM / rule system using spec + context
    return myLocalLLM.generateQuestion(context, spec);
  },
};

// 3. Compose StopGuard + metrics
const stopGuard = new StopGuard(hapClient, questionEngine);
const metrics = new QuestionOutcomeLogger();

// 4. Use in conversation flow
async function handleUserInput(context: any) {
  const inquiryReq = detectStopCondition(context);

  const { clarified, question } = await stopGuard.ensureClarified(
    context,
    inquiryReq
  );

  if (!clarified && question) {
    // Show question to user, wait for answer, update context
    const answer = await askUser(question);
    const updatedContext = updateContextWithAnswer(context, answer);

    // Send structural feedback to HAP
    await hapClient.sendFeedback({
      blueprintId: "phase-progress",
      stopResolved: outcome.stopResolved,
    });

    // Log locally for optimisation
    metrics.log({
      stopResolved: outcome.stopResolved,
      turnsToResolution: outcome.turnsDelta,
    });
  }
}
```

Key points:
- HAP never sees `context`, `question`, or `answer`
- SDK enforces the structural loop and gives you building blocks for local optimisation

---

## Design Principles

### Strict separation of concerns

- `hap-client` ↔ protocol only (structural)
- `metrics` + `runtime-guards` ↔ local behaviour & optimisation

### No semantic leakage

No raw user content in any SDK type or API.

### Protocol compliance by construction

The easiest way to integrate is also the correct, compliant way.

### Local sovereignty

Integrators own:
- models
- prompts
- optimisation strategy
- any learning loop

### Extensibility

New ladder stages, modes, or blueprint fields can be added without breaking the core abstractions.
