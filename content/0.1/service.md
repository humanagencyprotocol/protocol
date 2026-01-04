---
title: "Service Providers"
version: "Version 0.4"
date: "January 2026"
---

A HAP Service Provider (SP) is not a gatekeeper, registry, or authority.
It is a stateless, context-bound attester that cryptographically verifies whether a proposed action satisfies the structural requirements of human direction under a given context.

SPs do not validate truth. They validate gate closure structure.
SPs do not trust executors. They enable users to enforce boundaries.

## Core Principles

### Trustless by Design

✅ Anyone may run an SP—on a phone, server, or Raspberry Pi.
No central registry. No approval. No committee.

### Execution-Agnostic

✅ SPs do not care if the executor is AGI, a human, a city server, or a script.
All executors are assumed hostile until proven compliant via attestation.

### Gate-Centric

✅ SPs enforce closure of the six human gates:
Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner
No legacy "Meaning/Purpose" model. Gates are the law.

### Privacy-Preserving

✅ SPs never receive semantic content.
Only structural, non-reconstructable signals are processed.

## What Is a Service Provider?

An SP is any system that implements the HAP SP Protocol to:

- Receive a gate closure request (structural only)
- Validate it against a context-specific rule set
- Issue a signed attestation if valid—or reject

### SP Types (All Equal, None Universal)

| Type | Scope | Example |
| :--- | :--- | :--- |
| Personal SP | Individual or small group | Your phone's SP for relationship decisions |
| Community SP | Local/shared resources | Neighborhood SP for noise permits |
| Institutional SP | Regulated domains | Hospital SP for treatment plans |
| Reference SP | Open-source compatibility | SP bundled with Llama 3 + Guardrails |

No SP is "global." Trust is contextual and user-declared.

## SP Responsibilities

### Validate Gate Closure Structure

Receive only:

```json
{
  "frame_hash": "sha256:abc123...",
  "resolved_gates": ["frame", "problem", "objective", "tradeoff", "commitment"],
  "decision_owners": ["did:key:owner1", "did:key:owner2"],
  "affected_domains": ["wellbeing", "legal", "time"],
  "context_id": "string"
}
```

Reject if:

- frame_hash is missing
- Any required gate (per context_id) is unresolved
- decision_owners does not cover all affected_domains
- The blueprint_id in the request corresponds to an unknown or untrusted Blueprint
- All required_domains and stop_conditions declared in the referenced Blueprint are not satisfied in the request

### Validate Blueprint Compliance

Validate that the blueprint_id in a gate-closure request corresponds to a known, trusted Blueprint,
Enforce that all required_domains and stop_conditions declared in that Blueprint are satisfied in the request.

### Issue Attestations (Never Tokens)

On valid request, return:

```json
{
  "header": { "typ": "HAP-attestation", "alg": "EdDSA" },
  "payload": {
    "frame_hash": "sha256:abc123...",
    "resolved_gates": [...],
    "decision_owners": [...],
    "affected_domains": [...],
    "context_id": "string",
    "issued_at": 1735888000,
    "expires_at": 1735888120
  }
}
```

- Attestations are short-lived (≤2 mins)
- Signed with SP's private key
- Never store or log requests

### Publish Public Key

SP identity = its public key (e.g., did:key:z6Mk...)
Apps whitelist keys they trust (e.g., "I trust my partner's SP key")

## What SPs Are NOT

To avoid confusion:

- ❌ Not a model registry
  - SPs do not certify AI models.

- ❌ Not a data sink
  - SPs never store, log, or analyze requests.

- ❌ Not an ethics enforcer
  - SPs validate structure only—not morality, legality, or social good.

- ❌ Not a global authority
  - No SP can block others. No hierarchy exists.

- ❌ Not Blueprint authors
  - SPs do not define or modify Blueprints. They only enforce the rules published by context authorities (e.g., teams, cities, institutions).

## SP Workflow in Practice

```
Human
  ↓ (resolves 6 gates LOCALLY in app)
Local App
  ↓ (sends STRUCTURAL request to SP of choice)
Service Provider (any type, any location)
  ↓ (validates against context rules → signs attestation)
Local App
  ↓ (sends attestation + execution payload to EXECUTOR)
Executor (AGI, human, city system, etc.)
  ↓ (verifies attestation → EXECUTES or FAILS)
```

The executor never sees the Frame text, tradeoffs, or reasoning.
It only obeys the attestation.

## Security Guarantees

### Fraud Prevention

Fake attestations fail signature validation.
Stolen keys are mitigated by short expiry + user-controlled whitelists.

### Privacy by Construction

SPs receive only 5 fields: hash, gate list, owners, domains, context.
No IPs, no user IDs, no behavioral data.

### Context Isolation

A compromised personal SP cannot issue attestations for hospital contexts.
Each context defines its own gate requirements.

### No AGI Trust

Executors are not required to "do the right thing."
If an executor ignores the attestation, it acts outside HAP—and is liable.

## Example: Collaborative Project

Frame: "Launch Feature X by March 1"
Context: startup_deployment_v1 (requires all 6 gates + 3 domains)

You (Backend) resolve gates locally → send structural request to team SP
Alex (Frontend) does the same
Jane (Legal) does the same
Team SP validates:
- All 3 owners present
- All gates resolved
- Frame hash matches
Issues attestation
CI/CD system receives attestation → deploys code
If Jane's domain was missing → no attestation → no deploy

## Summary

Service Providers are minimal, context-aware attesters that:

- Enable verifiable human direction
- Prevent silent erasure and drift
- Work offline, locally, and permissionlessly
- Assume all executors are adversaries

HAP's power isn't in its providers—it's in its proof.
Run your own SP. Trust your own keys. Own your direction.