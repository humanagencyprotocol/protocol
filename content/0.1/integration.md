---
title: "Integration"
version: "Version 0.3"
date: "December 2025"
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

**Your application cannot execute, escalate, or access AGI until a human has defined Meaning, Purpose, and (when required) Commitment.**

Everything else is an implementation detail.

## The Responsibility of Applications

Every HAP-compliant application must implement four structural responsibilities:

### Detect Direction Gaps

Your system must detect when a human decision is missing at any stage:

- unclear Meaning
- ambiguous or unprioritized Purpose
- unchosen Commitment
- missing or unowned Action

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
- The human clarifies Meaning, chooses Purpose, or commits to a direction.

**Proceed**
- Only then can the application continue.

Applications control:

- the UX
- the language
- how answers modify context
- how commitment is verified and stored

What they may not do is proceed without confirmation.

### Maintain Direction Integrity

Your app must record, track, and enforce the Direction Ladder:

- **Meaning** — "What are we talking about?"
- **Purpose** — "Why does this matter now?"
- **Commitment** — "What direction do we choose, and what cost do we accept?"
- **Action** — "Who takes responsibility?"

This structure is mandatory.
Your app may extend it, but may not skip or reorder it.

### Request Direction Tokens Before Accessing AGI

Before calling any remote AGI, the application must request a Direction Token from a Service Provider.

To receive the token, your app must prove (structurally):

- Meaning resolved
- Purpose resolved
- Commitment made (if required)
- No unresolved direction gaps

If the token is denied:

- your app must not call AGI
- the AGI model will reject calls without a valid token

This guarantees AGI never interacts with users directly and never runs without confirmed human direction.

## Integrating the Direction Ladder Into Your Application

HAP doesn't tell you how to implement this.
It tells you what must be true.

Applications decide:

- how to represent Meaning
- how to detect Purpose conflicts
- how commitment is captured
- how responsibility is assigned
- how they maintain direction state
- how they surface questions

The protocol only requires structural compliance.

**Minimal example of internal state tracking:**
```
directionState = {
  meaning: { resolved: false, value: null },
  purpose: { resolved: false, value: null },
  commitment: { resolved: false, value: null },
  action: { resolved: false, value: null },
};
```

**Example gap detector (application-defined):**
```
if (!directionState.meaning.resolved) return { ladderStage: "meaning" };
if (!directionState.purpose.resolved) return { ladderStage: "purpose" };
if (high_stakes && !directionState.commitment.resolved)
    return { ladderStage: "commitment" };

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
- interpret meaning, purpose, commitment
- generate questions
- manage context
- enforce the Ladder

AGI is only called after Direction Token issuance, and never directly by the user.

## Accessing AGI Safely: The Direction Token Flow

The Direction Token is the cryptographic enforcement layer.

When your app wants AGI:
1. Check Direction
2. All required stages resolved
3. Request Direction Token from Service Provider
4. Service Provider validates your structure
5. Token issued
6. Call AGI with token
7. AGI executes within the token's scope

When direction is unresolved:

- token is denied
- AGI will not accept tokenless calls
- your app must continue clarifying direction

This architecture guarantees:

- AGI never touches the user directly
- No AGI execution without human direction
- Local systems remain sovereign
- Applications maintain responsibility

## Local vs. Remote Execution

Applications control what runs locally vs. remotely:

**Local execution:**

- question generation
- meaning detection
- purpose evaluation
- commitment capturing
- context management
- small-model execution
- storing direction state

**Remote execution (AGI):**

- only after Direction Token
- only within defined scope
- only after commitment

AGI cannot escalate, expand scope, or reinterpret direction.

## Application Integration Checklist

Every HAP-compliant app must:

### Required

- [x] Detect direction gaps
- [x] Implement Stop → Ask → Confirm → Proceed
- [x] Preserve the Direction Ladder
- [x] Maintain direction state
- [x] Block execution on unresolved direction
- [x] Request Direction Tokens before AGI calls
- [x] Reject AGI responses without valid tokens
- [x] Keep all user content local
- [x] Send only structural feedback

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
- enforces Meaning → Purpose → Commitment → Action
- blocks automated drift
- protects human agency
- acts as the only interface between user and AGI
- ensures AI cannot define, assume, or override direction
- preserves privacy by design
- uses Service Providers for structural validation
- uses Direction Tokens to safely call AGI

Your implementation can be:

- lightweight
- custom
- model-agnostic
- device-native
- built on your own stack

HAP defines only the structure — you invent everything else.
