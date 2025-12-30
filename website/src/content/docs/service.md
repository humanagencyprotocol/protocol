---
title: "Service Providers"
version: "Version 0.3"
date: "December 2025"
---

A HAP Service Provider (SP) is not an app, a model, or a user-facing agent.

A Service Provider is the independent enforcement layer that ensures applications implement the Human Agency Protocol correctly and that AGI execution only happens after humans make real directional commitments.

Applications talk to users.
Service Providers talk to applications.
AGI never talks to users.

This separation is what makes HAP trustworthy.

## Role of a Service Provider

A Service Provider is the protocol guardian for the entire ecosystem.
Its core responsibilities:

### Enforce Direction Checkpoints

- Receive structural-only checkpoint data from applications.
- Validate that Meaning → Purpose → Commitment are fully resolved.
- Block any attempt to skip or fake a checkpoint.

### Issue Direction Tokens

Before an application can call an AGI model, it must request a Direction Token from the SP.

A Direction Token is a cryptographically signed proof that:

- the user defined meaning,
- clarified purpose,
- and made a directional commitment.

No token → no AGI execution.

### Certify HAP-Compatible Models

The SP maintains a registry of AI models that:

- honor Direction Tokens,
- refuse execution without them,
- and stay within the committed scope.

Users can trust that a certified model will not bypass human direction.

### Guarantee Privacy by Architecture

Service Providers must never receive:

- prompts
- answers
- chat transcripts
- semantic content
- personal data

They only receive structural signals:

- ladder stage
- stop-condition flags
- resolution booleans
- minimal bounded metrics

This keeps human meaning sovereign and local.

### Maintain Protocol Integrity

- Validate incoming blueprint usage
- Publish current blueprints and signal guides
- Record verifiable audit logs
- Maintain ecosystem-wide protocol consistency

Service Providers do not interpret human meaning.
They only enforce the structure that protects it.

## What Service Providers Are NOT

To avoid confusion:

- ❌ Service Providers do not build apps
  - They do not manage user interactions, UIs, workflows, or agents.

- ❌ Service Providers do not run LLMs or AGI
  - They certify models, but do not host or execute them.

- ❌ Service Providers do not generate questions
  - Applications generate questions locally using Inquiry Blueprints.

- ❌ Service Providers do not see any user content
  - They receive only non-semantic structural signals.

- ❌ Service Providers do not enforce ethics on apps
  - They enforce protocol compliance only.

## How Service Providers Fit into the HAP Ecosystem

The full pipeline demonstrates the separation of roles:

```
User
   ↓
Local Application (with Local Direction Agent)
   ↓ Meaning / Purpose / Commitment
   ↓ Structural checkpoint data
Service Provider
   ↓ issues Direction Token
Local Application
   ↓ calls Certified AGI Model with Token
AGI Model
   ↓ returns result to Application
Local Application
   ↓ returns result to User
```

AGI models never interact with users directly.
They cannot act without a Direction Token issued by a Service Provider.

This design prevents:

- AGI-driven goal inference
- silent automation
- manipulation of user meaning
- direction drift
- premature action

## Core Responsibilities (Expanded)

### Protocol Custodian

Maintains an implementation of the HAP schema:

- Inquiry Blueprints
- Signal Detection Guides
- Structural Feedback validators
- Direction Token issuance logic

Ensures no ambiguity exists at the protocol layer.

### Privacy Guardian

All incoming and outgoing fields must be:

- structural
- bounded
- non-semantic

SPs must prove:

- they do not store raw content
- they cannot reconstruct user meaning
- no optimization or training uses user signals

### Execution Gatekeeper

The SP is the chokepoint between the human world and AGI execution.

It enforces:

- No token without resolved Meaning
- No token without resolved Purpose
- No token without explicit Commitment

If any checkpoint is unresolved:
Token denied. Execution blocked.

### Model Certification Authority

The SP maintains a registry of:

- local models (LLMs running on devices)
- cloud LLMs
- AGI models

that agree to:

- refuse execution without a valid Direction Token
- stay within committed constraints
- reject scope expansion attempts
- return execution logs for verification

Certified models are safe to use with HAP.

Applications can choose any model from the registry without trusting the model provider.

### Governance Participant

Service Providers join a federated trust network, each providing:

- public proofs
- compliance attestations
- transparency logs
- renewal audits

The network protects decentralization:

- no single point of control
- no proprietary capture
- no corporate gatekeeping

## Anatomy of a Direction Token

A Direction Token is a signed declaration that:

```
{
  "meaning_resolved": true,
  "purpose_resolved": true,
  "commitment_resolved": true,
  "scope_hash": "sha256:...",
  "issued_at": 1733701984,
  "expires_in": 120,
  "provider_signature": "ed25519:..."
}
```

The AGI model validates:

- the signature
- the unresolved expiry window
- the hash of the committed scope

If any check fails:
Execution stops immediately.

## Why SPs Are Essential

Without Service Providers, applications could:

- silently bypass commitments
- infer purpose from context
- skip Meaning/Purpose entirely
- expose users to AGI manipulation

With SPs:

- Human direction becomes a cryptographically enforced boundary.
- Models cannot run without human commitment.
- Users control AGI through architecture, not trust.

## Summary

Service Providers are the mechanical enforcement layer of the Human Agency Protocol.

They:

- Validate structural signals
- Issue Direction Tokens
- Certify which AI models can execute under HAP
- Block unauthorized AGI access
- Guarantee privacy by design
- Maintain protocol-wide trust

They never interact with end users.
They never process semantic content.
They never generate direction.

They simply ensure that only human-defined direction reaches AGI.
