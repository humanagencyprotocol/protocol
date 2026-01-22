---
title: "Integration"
version: "Version 0.2"
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

**Your application cannot execute irreversible actions without a valid human attestation conforming to a trusted HAP Profile.**

Everything else is an implementation detail.

---

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
- Trigger a structured inquiry to obtain missing direction.
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

### Request Attestations Before Execution

Before executing any irreversible action, the application must request an Attestation from a Service Provider.

To receive the attestation, your app must prove (structurally):

- Frame resolved
- Problem resolved
- Objective resolved
- Tradeoff resolved
- Commitment made (if required by Profile)
- Decision Owner assigned (if required by Profile)
- No unresolved direction gaps
- Decision Owner Scopes satisfy Profile requirements

If the attestation is denied:

- your app must not call any executor
- No execution body is trusted to validate or respect human direction
- All enforcement must occur in the local app and Executor Proxy before any command reaches the executor

This guarantees executors never interact with users directly and never run without confirmed human direction.

---

## Frame Construction (v0.2)

In v0.2, Frames are key-value maps with deterministic canonicalization. Your application must:

1. **Include all required keys** defined by the Profile
2. **Order keys** according to Profile specification (or lexicographically by default)
3. **Encode values** correctly (percent-encode `=` and non-printable ASCII)
4. **Compute frame_hash** as SHA-256 of the canonical frame string

**Example (Deploy Gate Profile):**

```
repo=org/service
sha=abc123def456
env=prod
profile=deploy-gate@0.2
path=deploy-prod-canary
disclosure_hash=sha256:789...
```

### Disclosure Hash

Disclosure represents what the human actually reviewed. Your application must:

1. Construct a disclosure object containing review context
2. Canonicalize according to Profile rules (sorted keys, no whitespace, set fields sorted)
3. Compute `disclosure_hash` as SHA-256 of canonical JSON
4. Include `disclosure_hash` in the Frame

---

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
- how to enforce Profile constraints during Frame and Tradeoff resolution
- how to validate that all required Decision Owner Scopes are present before requesting attestations

The protocol only requires structural compliance.

**Minimal example of internal state tracking:**
```javascript
directionState = {
  frame: { resolved: false, hash: null },
  problem: { resolved: false },
  objective: { resolved: false },
  tradeoff: { resolved: false },
  commitment: { resolved: false },
  decisionOwner: { resolved: false, did: null },
  decisionOwnerScope: { resolved: false, scope: null }
};
```

**Example gap detector (application-defined):**
```javascript
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

---

## Applications Can Use Their Own Models

Applications may run:

- their own local LLMs
- their own rules engines
- on-device assistants (phones, laptops, wearables)
- small language models customised for the domain

These models are:

- certified by Service Providers
- verified to respect Attestations
- approved to operate in the HAP ecosystem

Local models:

- interact directly with the user
- interpret Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner
- generate questions
- manage context
- enforce the Six Human Gates

Execution is only performed after Attestation issuance, and never directly by the user.

---

## Accessing Execution Safely: The Attestation Flow

The Attestation is the cryptographic enforcement layer.

When your app wants to execute:
1. Check Direction — all required stages resolved
2. Construct canonical Frame per Profile
3. Compute frame_hash and disclosure_hash
4. Request Attestation from Service Provider
5. Service Provider validates your structure against Profile
6. Attestation issued (or rejected with error code)
7. Execute with attestation via Executor Proxy
8. Executor operates within the attestation's scope

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

---

## Handling Attestation Errors

Executor Proxies return structured errors when validation fails:

| Error | Meaning | Application Response |
|-------|---------|---------------------|
| `INVALID_SIGNATURE` | Attestation signature failed | Check SP key configuration |
| `EXPIRED` | TTL exceeded | Request new attestation |
| `FRAME_MISMATCH` | Hash doesn't match | Verify frame construction |
| `PATH_MISMATCH` | Wrong execution path | Match path to attestation |
| `SCOPE_INSUFFICIENT` | Missing required scopes | Add required Decision Owners |
| `MALFORMED_ATTESTATION` | Structure invalid | Check attestation format |

---

## Local vs. Remote Execution

Applications control what runs locally vs. remotely:

**Local execution:**

- question generation
- Frame detection and construction
- Problem evaluation
- Objective setting
- Tradeoff acceptance
- commitment capturing
- Decision Owner assignment
- context management
- small-model execution
- storing direction state
- hash computation

**Remote execution:**

- only after Attestation
- only within defined scope
- only after commitment

Executors cannot escalate, expand scope, or reinterpret direction.

---

## Application Integration Checklist

Every HAP-compliant app must:

### Required

- [x] Detect direction gaps
- [x] Implement Stop → Ask → Confirm → Proceed
- [x] Preserve the Six Human Gates
- [x] Maintain direction state
- [x] Block execution on unresolved direction
- [x] Construct canonical Frames per Profile specification
- [x] Compute frame_hash and disclosure_hash correctly
- [x] Request Attestations before execution
- [x] Reject execution without valid attestation
- [x] Keep all user content local
- [x] Send only structural data (hashes, gate status)
- [x] Enforce Profile-defined requirements
- [x] Validate Decision Owner Scope against Profile requirements
- [x] Support combined SP+Proxy deployments (e.g., local HAP gateway)
- [x] Handle Executor Proxy errors gracefully

### Optional but encouraged

- [ ] Use the reference SDK
- [ ] Run on-device certified models
- [ ] Implement direction visualizations for clarity
- [ ] Support multiple Profiles

---

## Developer Autonomy

HAP is not a framework.
It is not an API-first product.
It is a structural contract between:

- applications
- users
- AI systems
- Service Providers
- Executors

Applications are free to:

- invent their own UX patterns
- design their own logic
- develop their own tools and models
- manage direction in any way they see fit

As long as the application satisfies:

- No AI execution without human-defined direction.
- No execution without a valid Attestation.
- No semantic content leaving local custody.

It is fully compliant.

---

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

---

## Multi-Participant Decision Coordination

When an application participates in a shared decision instance (e.g., team planning, joint purchase, couple's agreement), it must:

### 1. Maintain Local Direction State Per Domain
Each materially affected domain (e.g., user.wellbeing, user.time) is resolved entirely locally. No semantic content leaves the device.

Also maintain decision_owner_scope per owner. This structure must be included in structural emissions if required by the Profile.

### 2. Publish Only Structural Domain Status
When participating in a shared decision, the app may emit:

```json
{
  "decision_id": "uuid",
  "frame_hash": "sha256:...",
  "domain": "wellbeing",
  "resolved_gates": ["problem", "tradeoff", "commitment"],
  "resolved": true,
  "owner_scope": {
    "did": "did:key:...",
    "domain": "wellbeing",
    "env": "personal"
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
