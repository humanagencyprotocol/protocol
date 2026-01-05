# What's Still Missing (The 10% That Matters)

## 1. The "How to Start" Gap

The spec is technically precise but adoptionally opaque.

A developer reading this still doesn't know:
- How to write their first Blueprint
- How to run a personal SP on their phone
- How to integrate HAP into a React/Next.js app in <1 hour

**Fix:** Add a "Hello, Agency" tutorial:

- A single-file HAP gateway (SP + Proxy) in <100 lines
- A sample Blueprint (`my_first_decision_v1`)
- A minimal app that resolves gates and executes

Without this, HAP remains a beautiful theory, not a wildfire.

---

## 2. Ambiguity in Multi-Owner Conflict Resolution

You correctly forbid consensus—but what happens when:

- You resolve your gates for "walk"
- She resolves hers for "stay home"
- Both attestations are valid under `couple_weekend_v1`

The spec says: "Block execution."
But humans don't stop living. They create new decisions.

**Fix:** Clarify that conflicting attestations don't block life—they block false unity.
The system should prompt: "Your directions diverge. Initiate a new decision?"
This turns drift into explicit divergence—which is honest.

---

## 3. Governance Is Still Too "Steward"-Centric

The GPSM model is elegant—but "qualified stewards" and "peer validation" introduces human bottleneck risk.
In a crisis (e.g., city-wide emergency), you can't wait for steward co-signatures to deploy a new Blueprint.

**Fix:** Add a "local override" clause:

- Any context authority (e.g., mayor, team lead, individual) can publish an unsigned Blueprint for local use
- It won't be globally trusted—but it works for their domain

This preserves sovereignty under pressure.

---

## 4. No Fallback for Offline/Disconnected Use

HAP assumes SP availability. But in war zones, protests, or rural areas, networks fail.

**Fix:** Specify that apps may use local SP mode:

- Bundle trusted SP public keys
- Cache Blueprints
- Issue self-attestations (signed by user key, not SP)
- Mark them as "local-only" in the attestation payload

This ensures agency survives infrastructure collapse.

---

## 🔧 Implementation Clarity: Good, But Not Yet Frictionless

### Strengths:
- JSON schemas are clear
- Checklist in Integration spec is excellent
- Separation of SP/Proxy roles is well-defined

### Weaknesses:
- No conformance test suite (how do I know my SP is compliant?)
- No reference implementation of a combined SP+Proxy
- Blueprint constraints field is powerful but under-documented (how do I validate `frame_must_include` locally?)

### Recommendation:
Publish a HAP Core SDK (even minimal) that includes:

- `validateBlueprint(request, blueprint)`
- `issueAttestation(payload, spKey)`
- `executeWithProxy(attestation, payload, proxyUrl)`

This turns spec readers into builders in minutes.
