---
title: "Changelog"
version: "Version 0.2"
date: "January 2026"
---

All notable changes to the Human Agency Protocol specification.

---

## Version 0.2

**January 2026**

### Major Changes

- **Profiles** — Domain-specific enforcement rules that define frame keys, execution paths, validation rules, and TTL policies. Replaces the generic Blueprint concept with concrete, versioned specifications.

- **Frame Canonicalization** — Deterministic key-value format for hashing. Frames are now defined as UTF-8, newline-delimited `key=value` records with strict ordering rules.

- **Gate Definitions** — Clear semantics for each of the six gates (Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner) with explicit definitions of what resolution means.

- **Decision Owner Scopes** — Simplified authorization boundaries using `did`, `domain`, and `env` fields. Profile-defined scope requirements per execution path.

### New Sections

- **Threat Model** — Explicit assumptions about compromised components (Local App, Executor, Service Provider).

- **Roles** — Clear definition of Decision Owner, Local App, Service Provider, Executor, and Executor Proxy responsibilities.

- **Error Codes** — Structured Executor Proxy error responses (INVALID_SIGNATURE, EXPIRED, FRAME_MISMATCH, etc.).

- **TTL Policies** — Profile-defined attestation lifetimes with default and maximum values.

- **Privacy Invariant** — Expanded privacy guarantees as a hard protocol requirement.

### New Documentation

- **Deploy Gate Profile** — First concrete Profile implementation for software deployment, demonstrating the Profile pattern.

### Clarifications

- Decision Owner authentication is explicitly out of scope for HAP Core (implementation-defined).
- Execution Path Enforcement rules moved under Profiles.
- Versioning rules for HAP Core and Profiles.

---

## Version 0.1

**January 2026**

### Initial Release

- **Core Protocol** — Six Human Gates (Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner) as mandatory direction checkpoints.

- **Decision Closure States** — Structural conditions that must be satisfied before execution.

- **Inquiry Blueprints** — Context-specific validation contracts for gating execution.

- **Attestations** — Cryptographic proof of direction with short-lived, signed tokens.

- **Privacy by Architecture** — No semantic content leaves local custody.

- **Decision Owner Scope** — Authority boundaries with domains and constraints.

- **Service Providers** — Stateless attesters for structural validation.

- **Governance** — Permissionless, proof-based protocol governance.

---

## Roadmap: v0.3

**Planned**

### Replay Protection

- **One-time-use attestations** — Proxy stores `attestation_id` on first successful execution and rejects subsequent uses with `ALREADY_USED` error. Eliminates replay attacks within TTL window.

- **Attestation revocation** — Mechanism to invalidate attestations before expiry (e.g., Decision Owner withdraws approval).

### State Binding

- **State-bound validity** — Attestations tied to specific system state (e.g., `base_state_hash`), not just time. Profiles can require state binding for high-risk paths.

- **State oracles** — Pluggable state verification for CI/CD pipelines (e.g., "no new commits since attestation").

### Key Management

- **Keyset rotation** — SP supports multiple keys with `kid` identifiers. Proxy trusts keyset rather than single pinned key. Enables zero-downtime key rotation.

- **Hardware-backed keys** — Support for secure enclaves and hardware tokens for SP signing keys.

### Blind-Signing Mitigation

- **OS-level secure prompts** — Integration with OS-level confirmation dialogs that cannot be spoofed by compromised Local Apps.

- **Deterministic preview digests** — Human-readable summaries derived deterministically from disclosure, allowing verification without semantic transmission.

### Profile Enhancements

- **Profile inheritance** — Profiles can extend base profiles, reducing duplication for related domains.

- **Witness acknowledgements** — Support for additional stakeholders who must acknowledge (but not approve) before execution.
