---
title: "Integration"
version: "Version 0.1"
date: "January 2026"
---

The Integration layer describes how any application—local, cloud, mobile, embedded, or enterprise—implements the Human Agency Protocol.

It does not require using the reference SDK.
Applications may:

- implement the protocol manually
- use the SDK as scaffolding
- run their own certified models locally
- build custom enforcement layers
- integrate HAP into existing assistant architectures

What matters is not how you implement it.
What matters is what must be enforced.

HAP integration means one thing:

**Your application cannot execute, escalate, or access AGI until a human has defined Frame, Problem, Objective, Tradeoff, and (when required) Commitment and Decision Owner.**

Everything else is an implementation detail.

## The Responsibility of Applications

Every HAP-compliant application must implement four structural responsibilities:

### Detect Direction Gaps

Your system must detect when a human decision is missing at any stage:

- unclear Frame
- ambiguous or unprioritized Problem
- undefined Objective
- unaccepted Tradeoff
- unchosen Commitment
- missing or unowned Decision Owner

These gaps are not semantic.
They are structural.

You decide how you detect them:

- rule-based analysis
- metadata from your local model
- heuristics
- UI state
- custom logic

HAP only requires that when the gap exists, execution must stop.

### Enforce Stop → Ask → Confirm → Proceed

Once a direction gap is detected:

**Stop**
- Pause all downstream execution.

**Ask**
- Request an Inquiry Blueprint from a Service Provider.
- Render a question locally (LLM or rule-based).

**Confirm**
- The human clarifies Frame, defines Problem, chooses Objective, accepts Tradeoff, makes Commitment, or assigns Decision Owner.

**Proceed**
- Only then can the application continue.

Applications control:

- the UX
- the language
- how answers modify context
- how commitment is verified and stored

What they may not do is proceed without confirmation.

### Maintain Direction Integrity

Your app must record, track, and enforce the Six Human Gates:

- **Frame** — "What are we deciding?"
- **Problem** — "Why does this matter now?"
- **Objective** — "What outcome do we optimize?"
- **Tradeoff** — "What do we sacrifice?"
- **Commitment** — "What path do we choose, and what cost do we accept?"
- **Decision Owner** — "Who takes responsibility?"
- **Decision Owner Scope** — "the declared authority boundaries of each Decision Owner"

This structure is mandatory.
Your app may extend it, but may not skip or reorder it.

Applications must derive structured execution payloads from the ratified Frame locally, and bind them to the attestation (e.g., via hash inclusion or encryption).
These payloads must not contain natural language or interpretable context.

### Request Direction Tokens Before Accessing AGI

Before calling any remote AGI, the application must request a Direction Token from a Service Provider.

To receive the token, your app must prove (structurally):

- Frame resolved
- Problem resolved
- Objective resolved
- Tradeoff resolved
- Commitment made (if required)
- Decision Owner assigned (if required)
- No unresolved direction gaps

If the token is denied:

- your app must not call any executor
- No execution body is trusted to validate or respect human direction.
All enforcement must occur in the local app and Executor Proxy before any command reaches the executor.

This guarantees executors never interact with users directly and never run without confirmed human direction.

## Integrating the Six Human Gates Into Your Application

HAP doesn't tell you how to implement this.
It tells you what must be true.

Applications decide:

- how to represent Frame
- how to detect Problem conflicts
- how Objective is optimized
- how Tradeoff is accepted
- how commitment is captured
- how Decision Owner is assigned
- how they maintain direction state
- how they surface questions
- how to enforce Blueprint constraints during Frame and Tradeoff resolution
- how to validate that all required_domains have owners before emitting closure signals

The protocol only requires structural compliance.

**Minimal example of internal state tracking:**
```
directionState = {
  frame: { resolved: false, value: null },
  problem: { resolved: false, value: null },
  objective: { resolved: false, value: null },
  tradeoff: { resolved: false, value: null },
  commitment: { resolved: false, value: null },
  decisionOwner: { resolved: false, value: null },
  decisionOwnerScope: { resolved: false, value: null }  // ADD THIS
};
```

**Example gap detector (application-defined):**
```
if (!directionState.frame.resolved) return { gateState: "frame" };
if (!directionState.problem.resolved) return { gateState: "problem" };
if (!directionState.objective.resolved) return { gateState: "objective" };
if (!directionState.tradeoff.resolved) return { gateState: "tradeoff" };
if (!directionState.commitment.resolved) return { gateState: "commitment" };
if (!directionState.decisionOwner.resolved) return { gateState: "decisionOwner" };

return null; // all good
```

Applications define these rules.

HAP only enforces the outcome:
**No progress without resolution.**

## Applications Can Use Their Own Models

Applications may run:

- their own local LLMs
- their own rules engines
- on-device assistants (phones, laptops, wearables)
- small language models customised for the domain

These models are:

- certified by Service Providers
- verified to respect Direction Tokens
- approved to operate in the HAP ecosystem

Local models:

- interact directly with the user
- interpret Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner
- generate questions
- manage context
- enforce the Six Human Gates

Execution is only performed after Attestation issuance, and never directly by the user.

## Accessing Execution Safely: The Attestation Flow

The Attestation is the cryptographic enforcement layer.

When your app wants to execute:
1. Check Direction
2. All required stages resolved
3. Request Attestation from Service Provider
4. Service Provider validates your structure
5. Attestation issued
6. Execute with attestation
7. Executor operates within the attestation's scope

When direction is unresolved:

- attestation is denied
- No execution body is trusted to validate attestations
- All enforcement must occur in the local app and Executor Proxy
- your app must continue clarifying direction

This architecture guarantees:

- Executors never touch the user directly
- No execution without human direction
- Local systems remain sovereign
- Applications maintain responsibility

## Local vs. Remote Execution

Applications control what runs locally vs. remotely:

**Local execution:**

- question generation
- Frame detection
- Problem evaluation
- Objective setting
- Tradeoff acceptance
- commitment capturing
- Decision Owner assignment
- context management
- small-model execution
- storing direction state

**Remote execution:**

- only after Attestation
- only within defined scope
- only after commitment

Executors cannot escalate, expand scope, or reinterpret direction.

## Application Integration Checklist

Every HAP-compliant app must:

### Required

- [x] Detect direction gaps
- [x] Implement Stop → Ask → Confirm → Proceed
- [x] Preserve the Six Human Gates
- [x] Maintain direction state
- [x] Block execution on unresolved direction
- [x] Request Direction Tokens before AGI calls
- [x] Reject AGI responses without valid tokens
- [x] Keep all user content local
- [x] Send only structural feedback
- [x] Enforce Blueprint-defined required_domains and stop_conditions
- [x] Validate local compliance with Blueprint constraints before resolving gates
- [x] Derive minimal execution payloads without semantic leakage
- [x] Support combined SP+Proxy deployments (e.g., local HAP gateway)
- [x] Validate Decision Owner Scope against declared consequences before emitting closure signals

### Optional but encouraged

- [ ] Use the reference SDK
- [ ] Use the metrics helper for question optimisation
- [ ] Run on-device certified models
- [ ] Implement direction visualizations for clarity

## Developer Autonomy

HAP is not a framework.
It is not an API-first product.
It is a structural contract between:

- applications
- users
- AI systems
- Service Providers
- AGI models

Applications are free to:

- invent their own UX patterns
- design their own logic
- develop their own tools and models
- manage direction in any way they see fit

As long as the application satisfies:

- No AI execution without human-defined direction.
- No AGI without a Direction Token.
- No content leaving local custody.

It is fully compliant.

## Summary

Integrating HAP means your application:

- keeps direction human
- enforces Frame → Problem → Objective → Tradeoff → Commitment → Decision Owner
- blocks automated drift
- protects human agency
- acts as the only interface between user and executors
- ensures AI cannot define, assume, or override direction
- preserves privacy by design
- uses Service Providers for structural validation
- uses Attestations to safely call executors

Your implementation can be:

- lightweight
- custom
- model-agnostic
- device-native
- built on your own stack

HAP defines only the structure — you invent everything else.

## Multi-Participant Decision Coordination

When an application participates in a shared decision instance (e.g., team planning, joint purchase, couple's agreement), it must:

### 1. Maintain Local Direction State Per Domain
Each materially affected domain (e.g., user.wellbeing, user.time) is resolved entirely locally. No semantic content leaves the device.

Also maintain decision_owner_scope per owner. This structure must be included in structural emissions if required by the Blueprint.

### 2. Publish Only Structural Domain Status
When participating in a shared decision, the app may emit:

```json
{
  "decision_id": "uuid",
  "frame_hash": "sha256:...",
  "domain": "wellbeing",
  "resolved_gates": ["problem", "tradeoff", "commitment"],
  "resolved": true,
  "owner_scope": {  // OPTIONAL, if required
    "domains": ["wellbeing"],
    "constraints": {}
  }
}
```
→ Never include Problem text, Tradeoff description, or reasoning.

### 3. Consume Structural Signals from Other Participants
The app may receive similar structural signals from other certified participants. It must not:

- Reconstruct intent from patterns
- Infer missing content
- Display anything beyond: "Domain X: resolved/unresolved"

### 4. Block Shared Execution Until All Required Domains Are Closed
Before enabling joint action (e.g., sending a calendar invite, transferring funds), the app must verify:

- All domains declared in the Frame's scope
- Have emitted resolved: true from a certified participant
- With matching frame_hash

### 5. Treat Frame Drift as a Stop Condition
If any participant's frame_hash differs from the declared Frame, the app must halt and signal: "Direction conflict: Frames do not align."

### 6. Handle Divergence with Generative Prompts
When structural signals reveal irreconcilable directions (e.g., mismatched frame_hash or tradeoffs that imply mutually exclusive actions), the app must not simulate agreement.

Instead, it should offer a clear, non-coercive path forward:

"Your directions diverge. Would you like to initiate a new decision?"

This transforms potential conflict into explicit, ratifiable next steps—keeping agency human and collaboration honest.
