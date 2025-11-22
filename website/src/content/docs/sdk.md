---
title: "TypeScript SDK"
version: "Version 0.2.0"
date: "November 2025"
---

The HAP SDK enforces mandatory human checkpoints in AI applications through a Stop→Ask→Proceed protocol. When AI encounters ambiguity or unclear goals, it must stop and request clarification using question blueprints—structured templates that ensure the right questions are asked at the right time. The SDK tracks question outcomes to optimize blueprint selection over time, improving clarification quality without compromising privacy.

---

## Overview

**Version:** 0.2.0
**Protocol Version:** 0.1
**Status:** Development
**GitHub:** [humanagencyprotocol/hap-sdk-typescript](https://github.com/humanagencyprotocol/hap-sdk-typescript)

### Latest Changes (v0.2.0)

- **LocalHapProvider** - File-based local development without HAP service
- **Metadata helpers** - Auto-detect patterns, classify domains, estimate complexity
- **Enhanced blueprints** - Support for LLM prompt context and structural metadata
- **Provider abstraction** - Unified interface for HapClient and LocalHapProvider
- Breaking change: `StopGuard` config now uses `provider` instead of `client`

---

## What is HAP?

The Human Agency Protocol enforces mandatory human checkpoints in AI systems. AI cannot proceed, escalate, or interpret ambiguous goals until it receives explicit human meaning and direction.

**Core mechanism: Stop → Ask → Proceed**

This SDK provides:
1. **Protocol compliance** - Integration with HAP Service Providers
2. **Local development** - File-based blueprint testing without a service (v0.2+)
3. **Local optimization** - Tools to improve question-asking over time (privacy-preserving)

---

## Installation

```bash
npm install hap-sdk
```

---

## Quick Start

### Option 1: Production (with HAP Service)

```typescript
import { HapClient, StopGuard, StopDetector } from 'hap-sdk';

// 1. Create HAP provider
const hapProvider = new HapClient({
  endpoint: process.env.HAP_ENDPOINT!,
  apiKey: process.env.HAP_API_KEY!,
});

// 2. Implement local QuestionEngine
const questionEngine = {
  async generateQuestion(context: any, spec: QuestionSpec): Promise<string> {
    return myLocalLLM.generateQuestion(context, spec);
  },
};

// 3. Use StopGuard in your conversation flow
const stopGuard = new StopGuard({ provider: hapProvider, questionEngine });
const detector = new StopDetector();

async function handleUserInput(context: any) {
  const inquiryReq = detector.createRequest({
    ladderStage: "meaning",
    agencyMode: "convergent",
    stopTrigger: detectAmbiguity(context)
  });

  const { clarified, question } = await stopGuard.ensureClarified(context, inquiryReq);

  if (!clarified && question) {
    const answer = await askUser(question);
    await hapProvider.sendFeedback({
      blueprintId: clarificationResult.blueprintId!,
      stopResolved: true,
    });
  }
}
```

### Option 2: Local Development (no HAP Service needed)

```typescript
import {
  LocalHapProvider,
  StopGuard,
  StopDetector,
  detectAmbiguityPattern,
  classifyDomain,
  estimateComplexity,
  balancedSelector
} from 'hap-sdk';

// 1. Create local provider with file-based blueprints
const hapProvider = new LocalHapProvider({
  blueprintsPath: './blueprints',  // Directory with JSON blueprints
  selector: balancedSelector,       // Selection strategy
});

// 2. Use metadata helpers for smart detection
const detector = new StopDetector();
const userInput = "Can you update it?";

const pattern = detectAmbiguityPattern(userInput);    // "ambiguous-pronoun"
const domain = classifyDomain(["code", "function"]);  // "software-development"
const complexity = estimateComplexity({ hasAmbiguity: true }); // 2

const inquiryReq = detector.createRequestWithMetadata({
  ladderStage: "meaning",
  agencyMode: "convergent",
  stopTrigger: pattern !== null,
  stopPattern: pattern || undefined,
  domain,
  complexitySignal: complexity,
});

// 3. Same StopGuard flow works with both providers
const stopGuard = new StopGuard({ provider: hapProvider, questionEngine });
```

**Key principle:** HAP never sees your context, questions, or answers. Only structural signals.

---

## Core Features

### 1. Dual Provider Support

```typescript
// Production: Use HAP service for blueprint evolution
const hapProvider = new HapClient({ endpoint, apiKey });

// Local: Use file-based blueprints for development
const hapProvider = new LocalHapProvider({
  blueprintsPath: './blueprints',
  selector: balancedSelector
});
```

Both providers implement the same `HapProvider` interface, so your code works unchanged.

### 2. Metadata Helpers (v0.2+)

Automatically detect patterns, classify domains, and estimate complexity:

```typescript
import {
  StopPatterns,           // Common pattern constants
  Domains,                // Domain classifications
  ComplexityLevels,       // Complexity scale (1-5)
  detectAmbiguityPattern, // Auto-detect from text
  classifyDomain,         // Classify from keywords
  estimateComplexity,     // Calculate from signals
  createSessionContext    // Build session metadata
} from 'hap-sdk';

// Example: Auto-detect ambiguity
const pattern = detectAmbiguityPattern("Can you update it?");
// Returns: "ambiguous-pronoun"

// Example: Classify domain
const domain = classifyDomain(["code", "test", "api"]);
// Returns: "software-development"

// Example: Estimate complexity
const complexity = estimateComplexity({
  numEntities: 5,
  hasAmbiguity: true,
  priorStops: 2
});
// Returns: 3 (on scale of 1-5)
```

### 3. Blueprint Selection Strategies

LocalHapProvider supports multiple selection strategies:

```typescript
import {
  simpleLatestVersionSelector,   // Always pick newest
  bestPerformanceSelector,        // Pick highest success rate
  balancedSelector,               // Balance performance & exploration
  contextAwareSelector,           // Use metadata for smarter selection
  createEpsilonGreedySelector,    // Configurable exploration
  createLRUSelector               // Least-recently-used
} from 'hap-sdk';
```

### 4. Privacy-Preserving Architecture

```
app / platform
   │
   ├── hap-sdk
   │     ├── providers          (HapClient, LocalHapProvider)
   │     ├── types              (structural types only)
   │     ├── question-spec      (blueprint → spec conversion)
   │     ├── runtime-guards     (stop/ask/proceed enforcement)
   │     └── metrics            (local optimization)
   │
   └── local-ai
         ├── gap-detector       (semantic analysis - local only)
         ├── question-engine    (your LLM/rules - local only)
         └── context            (your data - never leaves system)
```

**Zero semantic leakage:** Only structural signals (ladder stage, agency mode, patterns, domains) are shared with providers.

---

## Documentation

### SDK Documentation

- **[API Reference](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/docs/API.md)** - Complete API documentation
- **[Local Development Guide](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/docs/LOCAL_DEVELOPMENT.md)** - Using LocalHapProvider and blueprints
- **[Migration Guide](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/docs/MIGRATION.md)** - Upgrading from v0.1.x to v0.2.x

### Protocol Specification

- **[Protocol Specification](/protocol)** - HAP v0.1 Protocol
- **[Integration Guide](/integration)** - SDK architecture and integration patterns

---

## Feature Checklist

- ✅ **Dual providers** - Production (HapClient) + Local (LocalHapProvider)
- ✅ **Metadata helpers** - Auto-detect patterns, domains, complexity
- ✅ **Selection strategies** - 6 built-in strategies for blueprint selection
- ✅ **Type-safe** - Full TypeScript support with strict types
- ✅ **Privacy-first** - Zero semantic leakage (only structural signals)
- ✅ **Protocol enforcement** - Stop→Ask→Proceed guaranteed
- ✅ **Resilient** - Retry logic, circuit breaker, timeout handling
- ✅ **Local metrics** - Track performance, optimize over time
- ✅ **Framework agnostic** - Works with any JS/TS environment
- ✅ **278 tests** - Comprehensive test coverage (≥85%)

---

## Version Mapping

| SDK Version | Protocol Version | Status | Key Features |
|-------------|------------------|--------|--------------|
| 0.1.x       | 0.1              | Stable | Core protocol, HapClient, StopGuard |
| 0.2.x       | 0.1              | Development | + LocalHapProvider, metadata helpers, selection strategies |

---

## Requirements

- Node.js 18+
- TypeScript 5.0+ (for development)

---

## Contributing

Contributions are welcome! See the [GitHub repository](https://github.com/humanagencyprotocol/hap-sdk-typescript) for:
- Contributing guidelines
- Code of conduct
- Security policy
- Development setup

**Development process:**
1. Follow design specs in main protocol repo
2. All tests must pass (coverage ≥ 85%)
3. Security tests must pass (no API key leaks, no semantic content)
4. Update CHANGELOG.md

---

## License

Apache-2.0 - see [LICENSE](https://github.com/humanagencyprotocol/hap-sdk-typescript/blob/main/LICENSE)

---

## Support

- **GitHub:** [Issues](https://github.com/humanagencyprotocol/hap-sdk-typescript/issues)
- **Documentation:** [GitHub README](https://github.com/humanagencyprotocol/hap-sdk-typescript#readme)
- **Protocol Spec:** [humanagencyprotocol.org](https://humanagencyprotocol.org)
