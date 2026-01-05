---
title: "Governance"
version: "Version 0.1"
date: "January 2026"
---

HAP is governed by invariant constraints, not institutions.

There is no central authority, no steward council, no registry, and no mandatory approval process. Compliance is enforced locally and cryptographically by any participant using the open specification.

Implementations may fork freely. However, breaking core invariants requires explicit renaming. The name HAP is reserved for systems that satisfy the canonical invariant set defined below.

Governance is therefore achieved through:

- cryptographic verifiability
- invariant preservation
- local sovereignty
- naming discipline

Not through consensus, committees, or institutional trust.

## Core Laws

HAP is designed to satisfy three non-negotiable laws of globally scalable protocols:

1. Anyone can implement it
2. Anyone can verify it
3. No one can stop it

Any governance mechanism that violates these laws is invalid.

## Canonical HAP Invariants

A system may only claim to be HAP-compliant if all of the following invariants hold.

These invariants are intentionally minimal and unforkable without renaming.

### Invariant 1 — No Execution Without Attestation

A consequential action is any operation that affects external state, human wellbeing, financial position, legal standing, or reputation.

No executor (human or machine) may perform a consequential action unless presented with a valid HAP attestation.

### Invariant 2 — Explicit Human Decision Ownership

Every attestation must reference at least one identifiable human Decision Owner. Collective, symbolic, or anonymous ownership is invalid.

### Invariant 3 — Scope-Covering Ownership

Each Decision Owner must declare a Decision Owner Scope. Execution is invalid if the declared consequence domains of a decision exceed the declared scope of all Decision Owners.

Comparison Rule: Consequence domains and scope boundaries are compared structurally using exact string matching on domain names and constraint keys. Semantic interpretation is explicitly prohibited.

### Invariant 4 — Binding Commitment

Once execution occurs, the associated commitment and ownership record must be append-only and non-reversible. History may be appended to, but not rewritten.

### Invariant 5 — Semantic Isolation of Executors

Executors may not receive semantic intent, human reasoning, or contextual meaning. They operate only on minimal, non-semantic execution payloads bound to attestations.

## Permissionless Implementation

Any individual, team, or system may:

- implement the HAP protocol
- run a Service Provider
- publish Blueprints
- enforce HAP locally
- reject non-compliant executors

No approval is required. No registration is necessary. No authority may grant or revoke permission to participate.

## Cryptographic Self-Verification

Compliance is proven exclusively through:

- correct schema usage
- valid cryptographic signatures
- invariant-preserving behavior

If an implementation satisfies the invariants, it is compliant. If it does not, it is not.

No external certification is required.

## Adversarial Interoperability

HAP assumes all remote parties are potentially hostile.

Local systems decide which entities to trust using:

- public key whitelisting
- local policy
- user-defined reputation

There is no global root of trust. There is only local sovereignty plus cryptographic proof.

## Forkability and Naming

Forking is a feature, not a failure.

Any community may fork:

- Blueprints
- Service Provider implementations
- UX layers
- execution models

However:

- if core invariants are preserved, the system may call itself HAP
- if any canonical invariant is broken, the system must rename itself

This preserves interoperability without requiring permission.

## Reference Conformance (Non-Authoritative)

To support interoperability without institutional control, the HAP ecosystem maintains:

- a public set of reference invariant tests
- adversarial and failure test vectors
- minimal reference flows

Running these tests is voluntary. Publishing results is optional.

No entity grants approval. No entity issues certification.

The tests exist solely to make invariant compliance observable and comparable.

## What Governance Is Not

HAP governance explicitly rejects the following:

❌ Central registries
❌ Steward councils
❌ Qualification processes
❌ Compliance certification bodies
❌ Jurisdiction-based approval
❌ Dispute resolution authorities

HAP governs behavior, not actors.

## Trust Model

Trust in HAP is constructed as:

Public Key + Local Policy

Every Service Provider, Blueprint, Executor, or App identifies itself via a public key. Local systems choose which keys to trust. Unknown or untrusted keys are ignored by default.

There is no global trust anchor.

## Final Statement

HAP does not ask for permission. It does not seek legitimacy from institutions.

Its authority derives from invariants that cannot be bypassed without detection.

Systems that preserve those invariants interoperate. Systems that do not are ignored.

That is the entirety of governance.


