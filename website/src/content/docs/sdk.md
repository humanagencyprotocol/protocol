---
title: "TypeScript SDK"
version: "Version 1.0.0"
date: "January 2026"
---

Gate-based TypeScript SDK for the Human Agency Protocol v0.1. Enforces the six gates (Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner) with attestation-first execution and zero semantic leakage.

---

## Overview

**Version:** 1.0.0
**Protocol Version:** 0.1
**Status:** Development
**GitHub:** [humanagencyprotocol/hap-sdk-typescript](https://github.com/humanagencyprotocol/hap-sdk-typescript)

### Core Guarantees

- **Structural only** - No semantic content leaves the app
- **Stop → Ask → Confirm → Proceed** - Enforced before any executor call
- **Attestation required** - Service Provider issues short-lived Ed25519 proof
- **Decision Owner Scope** - Enforced structurally (domain coverage + required constraints)
- **Explicit trust** - SP keys are whitelisted; no auto-discovery, no PKI/OAuth
- **Deterministic signing** - RFC 8785 JSON canonicalization for attestation payloads
- **Typed errors** - Machine-readable error codes for attestation failures

---

## What is HAP?

The Human Agency Protocol enforces mandatory human checkpoints in AI systems. AI cannot proceed, escalate, or interpret ambiguous goals until it receives explicit human meaning and direction through the six gate framework.

**Core mechanism: Stop → Ask → Proceed**

The six gates ensure complete direction:
1. **Frame** - What is the context?
2. **Problem** - What needs to change?
3. **Objective** - What outcome do we want?
4. **Tradeoff** - What are we willing to sacrifice?
5. **Commitment** - Are we ready to act?
6. **Decision Owner** - Who authorizes this?

---

## Installation

```bash
npm install hap-sdk
```

**Requirements:**
- Node.js 18+
- TypeScript 5.0+ (for development)

---

## Quick Start

### Basic Gate Flow

```typescript
import {
  LocalBlueprintProvider,
  DirectionStateManager,
  DirectionGuard,
  ServiceProviderClient,
  AttestationValidator,
} from "hap-sdk";

// 1. Set up local blueprint provider
const blueprintProvider = new LocalBlueprintProvider({
  sourcePath: "./blueprints"
});

// 2. Implement question engine (stays local)
const questionEngine = {
  async generateQuestion(_ctx: unknown, blueprint) {
    return blueprint.render_hint || `Resolve gate: ${blueprint.target_state}`;
  },
};

// 3. Create direction guard
const guard = new DirectionGuard({ blueprintProvider, questionEngine });

// 4. Initialize state manager
const state = DirectionStateManager.empty(
  ["delivery"], // affected domains
  "sha256:abc..." // frame hash
);

// 5. Check for missing gates and ask user
const requiredGates = ["frame", "problem", "objective", "tradeoff", "commitment", "decision_owner"];
const missing = guard.getMissingGates(state, requiredGates);

if (missing.length) {
  const inquiry = await guard.inquireForGate({}, missing[0]);
  // Present inquiry.question to user
  // Capture answer and update state
  state.setGateResolved(missing[0], { resolved: true });
}

// 6. Request attestation from Service Provider
const spClient = new ServiceProviderClient({
  baseUrl: "https://sp.example.com",
  apiKey: process.env.HAP_API_KEY
});

const attestationReq = state.buildAttestationRequest({
  blueprintId: "commit-team-v1",
  decisionOwners: ["did:key:zowner"],
  decisionOwnerScopes: [{
    owner_id: "did:key:zowner",
    domains: ["delivery"],
    constraints: { budget_limit: "€25k" }
  }],
  affectedDomains: ["delivery"],
  requiredGates,
  requiredConstraintKeys: ["budget_limit"]
});

const attestation = await spClient.requestAttestation(attestationReq);

// 7. Executor validates attestation
const validator = new AttestationValidator({
  trustedServiceProviderKeys: {
    "team-deploy": "did:key:zServiceProvider"
  }
});

await validator.validate(attestation, "team-deploy");
validator.assertFrameHashAlignment(
  { frame_hash: "sha256:abc...", payload: { action: "deploy" } },
  attestation
);

// Now safe to execute
```

---

## Core Components

### 1. LocalBlueprintProvider

Loads gate-based blueprints from local disk. Each blueprint defines a gate resolution question.

```typescript
const provider = new LocalBlueprintProvider({
  sourcePath: "./blueprints",
  selector: (candidates) => candidates[0] // optional selection strategy
});

const blueprint = await provider.getById("frame-minimal-v1");
const selected = await provider.selectByTarget("frame", {
  required_domains: ["delivery"],
  stop_conditions: ["problem"]
});
```

**Blueprint Schema:**
```json
{
  "id": "commit-team-v1",
  "intent": "Clarify team commitment to execute",
  "target_state": "commitment",
  "required_domains": ["delivery"],
  "required_constraints": ["budget_limit"],
  "stop_conditions": ["frame", "problem", "objective", "tradeoff"],
  "render_hint": "Are you ready to commit to this action?",
  "examples": ["Confirm: proceed with deployment"],
  "version": "1.0.0"
}
```

### 2. DirectionStateManager

Tracks gate resolution and builds attestation requests with structural validation.

```typescript
const state = DirectionStateManager.empty(
  ["delivery", "infrastructure"], // affected domains
  "sha256:frame-hash"
);

// Mark gates as resolved
state.setGateResolved("frame", { resolved: true });
state.setGateResolved("problem", { resolved: true });

// Check if gates are met
const hasFrame = state.hasGate("frame");
const hasAll = state.hasAllGates(["frame", "problem", "objective"]);

// Build attestation request
const request = state.buildAttestationRequest({
  blueprintId: "commit-team-v1",
  decisionOwners: ["did:key:zowner"],
  decisionOwnerScopes: [{
    owner_id: "did:key:zowner",
    domains: ["delivery"],
    constraints: { budget_limit: "€25k" }
  }],
  affectedDomains: ["delivery"],
  requiredGates: ["frame", "problem", "objective"],
  requiredConstraintKeys: ["budget_limit"]
});
```

### 3. DirectionGuard

Determines missing gates and generates local questions using the QuestionEngine.

```typescript
const guard = new DirectionGuard({ blueprintProvider, questionEngine });

// Check missing gates
const missing = guard.getMissingGates(state, requiredGates);

// Generate question for gate
const inquiry = await guard.inquireForGate(context, "frame");
console.log(inquiry.question); // Present to user
```

### 4. ServiceProviderClient

Communicates with external Service Providers for blueprints and attestations.

```typescript
const client = new ServiceProviderClient({
  baseUrl: "https://sp.example.com",
  apiKey: process.env.HAP_API_KEY,
  blueprintPath: "/v1/blueprints",    // optional
  attestationPath: "/v1/attest",      // optional
  feedbackPath: "/v1/feedback",       // optional
  timeout: 5000,                       // optional
  retries: 3                           // optional
});

// Fetch blueprint
const blueprint = await client.getById("frame-minimal-v1");

// Request attestation
const attestation = await client.requestAttestation(attestationReq);

// Send feedback (structural only)
await client.sendFeedback({
  blueprint_id: "commit-team-v1",
  context_id: "team-deploy",
  resolved_states: ["frame", "problem"],
  missing_states: ["commitment"],
  execution_allowed: false,
  stop_resolved: true
});
```

### 5. AttestationValidator

Validates attestation signatures, expiry, issuer, and frame hash alignment.

```typescript
const validator = new AttestationValidator({
  trustedServiceProviderKeys: {
    "context-id": "did:key:zServiceProvider"
  },
  clock: () => Date.now() / 1000 // optional, for testing
});

// Validate attestation
await validator.validate(attestation, "context-id");

// Verify frame hash alignment
validator.assertFrameHashAlignment(
  { frame_hash: "sha256:abc...", payload: {} },
  attestation
);

// Enforce scope expectations
validator.enforceScopeExpectation(attestation, blueprint);
```

**Attestation Structure:**
```typescript
{
  header: {
    typ: "HAP-attestation",
    alg: "EdDSA",
    issuer: "did:key:zServiceProvider"
  },
  payload: {
    frame_hash: "sha256:abc...",
    blueprint_id: "commit-team-v1",
    resolved_gates: ["frame", "problem", "objective", "tradeoff", "commitment", "decision_owner"],
    decision_owners: ["did:key:zowner"],
    decision_owner_scopes: [{
      owner_id: "did:key:zowner",
      domains: ["delivery"],
      constraints: { budget_limit: "€25k" }
    }],
    affected_domains: ["delivery"],
    issued_at: 1704067200,
    expires_at: 1704070800
  },
  signature: "base64url-encoded-signature"
}
```

---

## Privacy-Preserving Architecture

```
App / Platform
   │
   ├── HAP SDK (structural only)
   │     ├── DirectionStateManager    (track gate closure locally)
   │     ├── DirectionGuard           (detect missing gates)
   │     ├── QuestionEngine           (generate questions locally)
   │     ├── AttestationValidator     (verify SP signatures)
   │     └── ServiceProviderClient    (fetch blueprints, request attestations)
   │
   └── Local Components (semantic - never shared)
         ├── Context & Content        (stays local)
         ├── User Answers            (stays local)
         ├── Execution Payloads      (stays local)
         └── LLM Integration         (local question generation)
```

**Zero Semantic Leakage:**
- Only structural signals shared with Service Providers (gate states, domains, blueprint IDs)
- All semantic content (context, questions, answers, payloads) stays local
- Frame hash binds attestation to payload without revealing content

---

## Executor Proxy Pattern

The executor proxy pattern validates attestations before executing actions:

```typescript
import { validateAttestationAndPayload } from "hap-sdk";

// Executor endpoint receives attestation + payload
app.post("/execute", async (req, res) => {
  const { attestation, payload } = req.body;

  try {
    // Validate attestation and frame hash alignment
    await validateAttestationAndPayload(
      attestation,
      { "team-deploy": "did:key:zSP" },
      { frame_hash: payload.frame_hash, payload },
      "team-deploy",
      blueprint // optional, for scope validation
    );

    // Safe to execute
    const result = await executeAction(payload);
    res.json({ success: true, result });

  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});
```

See `examples/executor-proxy-fastify.ts` for a complete implementation.

---

## Starter Blueprints

The SDK includes example blueprints in `blueprints/`:

- **frame-minimal-v1.json** - Basic frame gate
- **commit-team-v1.json** - Team commitment with scope validation
- **legal-review-v1.json** - Legal review checkpoint
- **tradeoff-strategy-v1.json** - Strategic tradeoff analysis

---

## Signal Detection

Load structural signal guides for stop trigger detection:

```typescript
import { LocalSignalGuideProvider } from "hap-sdk";

const signalProvider = new LocalSignalGuideProvider({
  sourcePath: "./signal-guides"
});

const guides = await signalProvider.list();
// Use guides to detect when to stop and ask
```

See `docs/SIGNAL_DETECTION.md` for structural stop/feedback guidance.

---

## Trust Model

**Explicit Key Management:**
- Service Provider keys are whitelisted by context ID
- Keys use `did:key` format with Ed25519 public keys
- No PKI, OAuth, or DNS-based trust
- No auto-discovery - integrator provides keys

**Example Trust Configuration:**
```typescript
{
  "team-deploy": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
  "legal-review": "did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"
}
```

---

## Documentation

### SDK Documentation

- **[README](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/README.md)** - Quick start and core concepts
- **[Feedback & Trust](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/docs/FEEDBACK_AND_TRUST.md)** - Feedback schema and trusted key configuration
- **[Signal Detection](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/docs/SIGNAL_DETECTION.md)** - Structural stop trigger guidance

### Protocol Specification

- **[Protocol Specification](/protocol)** - HAP v0.1 Protocol
- **[Integration Overview](/integration)** - SDK architecture and integration patterns
- **[Service Providers](/service)** - Service Provider requirements

---

## Examples

All examples are in the `examples/` directory:

```typescript
// Basic gate flow
examples/basic-gate-flow.ts

// Executor proxy (generic)
examples/executor-proxy.ts

// Executor proxy (Fastify)
examples/executor-proxy-fastify.ts
```

---

## Error Handling

The SDK provides typed errors for different failure scenarios:

```typescript
import {
  AttestationError,
  ScopeMismatchError,
  ValidationError
} from "hap-sdk";

try {
  await validator.validate(attestation, "team-deploy");
} catch (error) {
  if (error instanceof AttestationError) {
    console.error("Attestation failed:", error.code, error.message);
  } else if (error instanceof ScopeMismatchError) {
    console.error("Scope mismatch:", error.code, error.message);
  } else if (error instanceof ValidationError) {
    console.error("Validation failed:", error.code, error.message);
  }
}
```

**Error Codes:**
- `ATTESTATION_ERROR` - Signature/expiry/issuer validation failed
- `SCOPE_MISSING` - Required decision owner scopes missing
- `SCOPE_UNEXPECTED` - Scopes provided when not required
- `VALIDATION_ERROR` - Schema or structural validation failed

---

## Feature Checklist

- ✅ **Gate-based architecture** - Six gates enforced structurally
- ✅ **Local blueprint provider** - File-based development workflow
- ✅ **Service Provider client** - Remote blueprint and attestation support
- ✅ **Attestation validation** - Ed25519 signature verification with did:key
- ✅ **Frame hash binding** - Payload integrity without semantic leakage
- ✅ **Decision Owner Scopes** - Structural domain and constraint validation
- ✅ **Type-safe** - Full TypeScript support with strict types
- ✅ **Privacy-first** - Zero semantic leakage (structural signals only)
- ✅ **Explicit trust** - User-controlled Service Provider key whitelist
- ✅ **Deterministic signing** - RFC 8785 JSON canonicalization
- ✅ **Executor proxy pattern** - Reference implementation included
- ✅ **Signal detection** - Structural stop trigger guidance

---

## Version History

| SDK Version | Protocol Version | Status | Key Features |
|-------------|------------------|--------|--------------|
| 1.0.0       | 0.1              | Development | Gate-based architecture, attestation-first execution |
| 0.2.x       | 0.1              | Deprecated | LocalHapProvider, metadata helpers, selection strategies |
| 0.1.x       | 0.1              | Deprecated | Core protocol, HapClient, StopGuard |

---

## Contributing

Contributions are welcome! See the [GitHub repository](https://github.com/humanagencyprotocol/hap-sdk-typescript) for:
- Contributing guidelines
- Code of conduct
- Security policy
- Development setup

**Development Requirements:**
1. Follow design specs in main protocol repo
2. All tests must pass
3. Update CHANGELOG.md
4. No semantic content in logs or telemetry

---

## License

Apache-2.0 - see [LICENSE](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/LICENSE)

---

## Support

- **GitHub:** [Issues](https://github.com/humanagencyprotocol/hap-sdk-typescript/issues)
- **Documentation:** [GitHub README](https://github.com/humanagencyprotocol/hap-sdk-typescript#readme)
- **Protocol Spec:** [humanagencyprotocol.org](https://humanagencyprotocol.org)
