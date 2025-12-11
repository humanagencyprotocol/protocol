---
title: "Service Providers"
version: "Version 0.3"
date: "December 2025"
---

A HAP Service Provider is the enforcement backbone of the Human Agency Protocol.
It ensures that **any AI model or system participating in the ecosystem remains subordinate to human direction** — not through promise, but through verifiable protocol behavior.

Service Providers do not run user-facing AI.
They run the *infrastructure that guarantees AI cannot act without human meaning, purpose, and commitment*.

They enforce:

**Stop → Ask → Confirm → Proceed**
at every rung of the Direction Ladder:

1. Meaning
2. Purpose
3. Commitment
4. Action

No bypass. No inference. No silent automation.

---

## Why Service Providers Exist

AI systems execute faster than humans can think.
Without enforced direction checkpoints, models will:

- infer meaning,
- invent purpose,
- fabricate intentions,
- and proceed without human commitment.

A Service Provider prevents that.

It stands between **AI execution** and **human decision-making**, ensuring:

- direction comes from humans,
- commitment must be explicitly confirmed,
- every action is traceable to a human-defined checkpoint.

It is the mechanical guarantee that **AI never runs ahead of human authorship**.

---

##  What Service Providers Do

| Role | Description |
|------|-------------|
| **Protocol Custodian** | Implements APIs for Inquiry Blueprints and Feedback. Enforces Stop → Ask → Confirm → Proceed. |
| **Privacy Guardian** | Ensures only structural data travels through the protocol — never content, prompts, or answers. |
| **Schema Enforcer** | Validates all incoming/outgoing payloads against HAP schemas (direction ladder, stop conditions, structural fields). |
| **Execution Gatekeeper** | Blocks any downstream AI action when `stop_resolved=false`. Rejects any attempt to skip a checkpoint. |
| **Model Certification Authority** | Audits and certifies AI models as "HAP-compliant." Ensures models cannot bypass direction enforcement. |
| **Registry Steward** | Maintains Inquiry Blueprints and Direction Signal Guides. Publishes signed updates and protocol improvements. |
| **Ecosystem Governance Participant** | Provides verifiable proofs of compliance. Can challenge or revoke non-compliant peers. |

Service Providers act as a distributed trust network.
They do **not** own data, users, or models.
They enforce **conditions** under which AI is allowed to operate.

---

##  New: Model Certification Layer

To guarantee that direction cannot be bypassed, Service Providers must **approve AI models** before they can be used inside HAP-secured systems.

A certified model must:

- obey Stop → Ask → Confirm → Proceed when prompted by the SDK,
- never issue downstream actions without a confirmed checkpoint,
- never fabricate missing meaning/purpose/commitment,
- never self-resolve a stop-condition,
- never infer human intent when none was provided.

Certification involves:

1. **Static checks** — model call structure, tool-calling behavior, action-routing capabilities.
2. **Dynamic compliance tests** — simulated tasks where the model attempts to proceed; SP verifies it halts.
3. **Backdoor detection** — ensuring no jailbreak, prompt injection, or hidden parameter can circumvent direction enforcement.

Once certified, a model receives a **Provider-Signed Capability Token**.

Local systems can check:
*"Is this model safe to use inside HAP?"*

---

##  New: Local Personal Assistants as Mandatory Intermediaries

Users **never** interact directly with frontier AGI models.

Instead, Service Providers certify a class of **Local Personal Assistants (LPAs)**:

- small language models running on-device (phone, laptop, home hub),
- or regional models running inside sovereign, audited environments.

LPAs act as:

- **buffer** (protecting the user),
- **guardian** (ensforcing HAP checkpoints),
- **translator** (mapping user context to structural direction),
- **firewall** (sanitizing queries before they reach AGI models).

The AGI only receives:

- the structural summary of user decisions,
- the confirmed direction (meaning/purpose/commitment),
- and the allowed scope of execution.

The AGI never sees user content or private prompts.

The LPA enforces the Direction Ladder locally, long before anything touches a powerful model.

---

##  System Overview

### Core Components

1. **Inquiry API** — Delivers validated Inquiry Blueprints.
2. **Feedback API** — Receives structural resolution reports (`stop_resolved`, `direction_chosen`, `cost_accepted`).
3. **Certification Registry** — Stores signed records of which AI models are HAP-compliant.
4. **Governance Engine** — Enforces protocol rules, prevents schema drift, revokes violators.
5. **Direction Enforcement Layer** — Ensures no model proceeds without human-confirmed checkpoints.

---

# Updated Supported Modes

HAP now uses a **single mode**:
**Convergent Direction Mode**

Its goal:
Move interactions from uncertainty → meaning → purpose → commitment → action.

Metrics include:

- `shared_reference_detected`
- `phase_advanced`
- `turns_to_resolution`
- `commitment_confirmed`
- `scope_defined`

---

# How the Service Provider Works in Practice

1. A local system detects missing meaning/purpose/commitment.
2. It calls the Inquiry API with the needed ladder stage.
3. The SP sends a Blueprint describing the question to ask.
4. The local system generates the natural-language question using private context.
5. The human answers; local system interprets the answer.
6. The SP receives structural feedback stating whether the checkpoint was resolved.
7. If unresolved → **action blocked**.
8. If resolved → **execution allowed**.

AGI models cannot override or skip this sequence.
They receive *only the allowed action*, never raw human input.

---

# Privacy & Trust by Architecture

Service Providers guarantee:

- No user text or content ever leaves the device.
- Only structural metadata is transmitted (stage, metric counts, boolean flags).
- No training occurs on any interaction signal.
- Every schema is auditable and immutable.
- LPAs shield the user from AGI exposure.
- Certified models are cryptographically bound to HAP behavior.

---

# Continuous Improvement

The Service Provider registry evolves:

- Inquiry Blueprints improve through structural evidence.
- Better direction patterns emerge over time.
- Certified models must renew compliance periodically.
- Non-compliant models are revoked.

Direction improves globally while privacy remains absolute.

---

# Ecosystem Role

A HAP Service Provider:

- does not collect data,
- does not run user-facing AI,
- does not define meaning or purpose,
- does not mediate content.

It enforces the **conditions under which AI is allowed to act**.

This is what makes human-first AI practical and trustworthy.

> Service Providers keep direction in human hands —
> even when intelligence scales beyond human capacity.

---

# Summary

The Service Provider Network is the operational shield of human agency.

It ensures:

- humans define direction,
- AI cannot infer or fabricate it,
- commitments are explicit,
- actions are supervised,
- models are certified,
- privacy is unbreakable.

Every provider strengthens the global architecture ensuring that **automation never outruns authorship**.

---
