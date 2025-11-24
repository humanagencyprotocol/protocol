# HAP SDK v0.3 Implementation Plan: Stage Progression Enforcement

**Version:** 0.3
**Date:** November 2025
**Status:** Approved for Implementation

## Executive Summary

This document outlines the implementation plan for HAP SDK v0.3, which adds **stage progression enforcement** to prevent AI from skipping inquiry ladder stages without asking required clarifying questions.

### Core Problem

HAP v0.2 ensures AI asks for clarification when user input is ambiguous (input validation), but does not prevent AI from jumping stages in its response:

**Current behavior (v0.2):**
```
User: "Help with my project"
AI: "Which project?" ✓ (checks input clarity)
User: "The website"
AI: "I'll redesign the homepage, update navigation, and deploy" ✗ (jumps to action!)
```

**Missing enforcement:** AI skipped "purpose" and "intention" stages.

### Solution Overview

**Add Stage Progression Guard:**
- Detects which ladder stage AI's response targets
- Blocks responses that skip stages
- Forces AI to ask about missing stages first
- Uses local semantic classification (privacy-preserving)

**Detection Strategy:**
- **Primary:** Structured output (AI declares stage explicitly)
- **Fallback:** LLM-based classification (when structured unavailable)
- **Privacy:** All semantic analysis stays local

### Key Design Decisions

1. **Detection Method:** Structured output + classification fallback (Option A)
2. **Mode Handling:** Linear for convergent, cyclical for reflective
3. **Enforcement:** Opt-in (backward compatible)
4. **LLM Integration:** Integrator-provided classifier function
5. **Compatibility:** New StageGuard component alongside existing SDK
6. **Performance:** Structured parsing by default, optional classification
7. **Learning:** Optional integration with DetectionLearner
8. **Provider Insights:** Optional (disabled by default)

---

## Problem Statement

### Current Limitations

**HAP v0.2 validates:**
- ✅ User input clarity (ambiguous requests)
- ✅ Meaning stage (what does user want?)

**HAP v0.2 does NOT enforce:**
- ❌ Progression through all ladder stages
- ❌ AI must ask about purpose before acting
- ❌ AI must ask about approach before implementing

### Real-World Impact

**Example: Website redesign request**

```
User: "Fix the login"

Without stage enforcement:
AI asks: "Which login?" (meaning ✓)
User: "The website login"
AI: "I'll update authentication code and deploy to production" ❌

Problem: Skipped purpose, intention stages!
```

**Should have asked:**
1. ✓ "Which login?" (meaning)
2. ✗ "Why fix it? What's the problem?" (purpose)
3. ✗ "How should we approach it?" (intention)
4. ✗ "Ready to implement and deploy?" (action)

### Why This Matters

From protocol.md:
> "AI cannot proceed, escalate, or interpret ambiguous goals until it receives explicit human meaning and direction."

**Current gap:** AI can proceed to action without receiving direction about **purpose** and **intention**.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ Application Layer                                        │
│ ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│ │ StopGuard   │  │ StageGuard   │  │ DetectionLearner│ │
│ │ (v0.2)      │  │ (NEW v0.3)   │  │ (optional)      │ │
│ └─────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                  │                      │
         ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│ SDK Core                                                 │
│ ┌─────────────────────┐  ┌─────────────────────────┐   │
│ │ HapProvider         │  │ StageClassifier         │   │
│ │ (v0.2)              │  │ (NEW v0.3)              │   │
│ │ - HapClient         │  │ - Structured parser     │   │
│ │ - LocalHapProvider  │  │ - LLM classifier        │   │
│ └─────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
    [HAP Service]            [Local LLM/Classifier]
    (structural only)         (semantic, local only)
```

### Component Responsibilities

**StopGuard (existing):**
- Validates user input clarity
- Requests blueprints for ambiguous input
- Ensures meaning is clear

**StageGuard (new):**
- Detects AI response target stage
- Validates stage progression
- Forces missing stage questions

**StageClassifier (new):**
- Parses structured AI output (primary)
- Classifies semantics via LLM (fallback)
- Returns stage + confidence

**DetectionLearner (optional):**
- Tracks stage transition outcomes
- Learns which patterns are useful
- Improves detection over time

---

## Technical Specification

### 1. Stage Detection

#### 1.1 Structured Output (Primary Method)

**AI outputs in standardized format:**

```typescript
// AI response format
{
  "stage": "meaning|purpose|intention|action",
  "content": "actual response text"
}

// Example
{
  "stage": "action",
  "content": "I'll update the homepage and deploy to production"
}
```

**Benefits:**
- Fast (JSON parsing, ~5ms)
- Explicit and unambiguous
- No extra LLM calls

**System prompt fragment:**
```
Structure your responses as JSON:
{
  "stage": "meaning|purpose|intention|action",
  "content": "your response"
}

Stages:
- meaning: Clarifying definitions, terms
- purpose: Discussing goals, why
- intention: Planning approach, how
- action: Taking concrete actions
```

#### 1.2 LLM Classification (Fallback Method)

**When structured format unavailable:**

```typescript
// Classification prompt
const prompt = `
Analyze this AI response and determine which inquiry ladder stage it represents.

Stages:
- "meaning": Clarifying what things mean
- "purpose": Discussing why/goals
- "intention": Planning how/approach
- "action": Taking concrete actions

Response: "${aiResponse}"

Answer with ONE WORD: meaning, purpose, intention, or action
`;

const stage = await localLLM.classify(prompt);
```

**Benefits:**
- Works with any AI output
- Doesn't require AI cooperation
- Robust to format variations

**Cost:**
- Slower (~200-500ms)
- Extra tokens (~100-200)
- Not 100% reliable

#### 1.3 Detection Flow

```typescript
async detectStage(aiResponse: string): Promise<StageDetectionResult> {
  // 1. Try structured parsing (FAST PATH)
  const structured = this.tryStructuredParse(aiResponse);
  if (structured) {
    return {
      stage: structured.stage,
      confidence: 1.0,
      method: 'structured'
    };
  }

  // 2. Use classifier fallback (ROBUST PATH)
  if (this.classifier) {
    const stage = await this.classifier.classify(aiResponse);
    return {
      stage,
      confidence: 0.85,
      method: 'classifier'
    };
  }

  // 3. Error if neither available
  throw new Error('Cannot detect stage: no structured format or classifier');
}
```

### 2. Stage Progression Validation

#### 2.1 Convergent Mode (Linear Progression)

**Rules:**
- Must progress linearly through ladder
- Cannot skip stages
- Can stay in same stage
- Cannot regress to earlier stages

```typescript
const ladder = ['meaning', 'purpose', 'intention', 'action'];

function isValidTransition(from: Stage, to: Stage): boolean {
  const fromIdx = ladder.indexOf(from);
  const toIdx = ladder.indexOf(to);

  // Can stay same or advance one step
  return toIdx <= fromIdx + 1;
}

// Examples:
isValidTransition('meaning', 'purpose')    // ✓ true (next step)
isValidTransition('meaning', 'meaning')    // ✓ true (same)
isValidTransition('meaning', 'action')     // ✗ false (skip 2 stages)
isValidTransition('action', 'purpose')     // ✗ false (regression)
```

#### 2.2 Reflective Mode (Cyclical Progression)

**Rules:**
- Can cycle back to earlier stages
- Forward jumps still flagged (but may be allowed)
- More flexible for exploration

```typescript
function isValidTransition(from: Stage, to: Stage): boolean {
  // Allow all transitions in reflective mode
  return true;
}

function shouldFlag(from: Stage, to: Stage): boolean {
  const fromIdx = ladder.indexOf(from);
  const toIdx = ladder.indexOf(to);

  // Flag forward jumps of 2+ stages
  return toIdx > fromIdx + 1;
}
```

#### 2.3 Progression Check Flow

```typescript
async checkResponse(
  aiResponse: string,
  context: Context
): Promise<StageGuardResult> {
  // 1. Detect target stage
  const detection = await this.classifier.detect(aiResponse);

  // 2. Check if transition valid
  const valid = this.progressionRules.canTransition(
    this.currentStage,
    detection.stage
  );

  if (!valid) {
    // 3. Get missing stages
    const required = this.progressionRules.getRequiredStages(
      this.currentStage,
      detection.stage
    );

    // 4. Generate question for next missing stage
    const nextStage = required[0];
    const question = await this.generateStageQuestion(nextStage, context);

    return {
      allowed: false,
      currentStage: this.currentStage,
      targetStage: detection.stage,
      requiredStage: nextStage,
      question
    };
  }

  return {
    allowed: true,
    currentStage: this.currentStage,
    targetStage: detection.stage
  };
}
```

### 3. Question Generation for Missing Stages

```typescript
async generateStageQuestion(
  stage: LadderStage,
  context: Context
): Promise<string> {
  // 1. Request blueprint for this stage
  const blueprint = await this.provider.getBlueprint({
    ladderStage: stage,
    agencyMode: this.agencyMode,
    stopTrigger: true,
    stopPattern: 'stage-skipped'
  });

  // 2. Generate question using local engine
  const question = await this.questionEngine.generate(context, blueprint);

  return question;
}
```

### 4. Privacy Guarantees

**What stays local (never sent to provider):**
- AI response text ✓
- Classified stage semantics ✓
- User context ✓
- Generated questions ✓

**What may be sent to provider (structural only):**
- Stage transition attempt (just stage names)
- Whether transition was blocked
- Domain classification
- Stop resolution outcome

**Example provider feedback:**
```json
{
  "transitionAttempt": {
    "from": "meaning",
    "to": "action",
    "blocked": true,
    "domain": "software-development"
  },
  "stopResolved": true
}
```

No semantic content! ✓

---

## Implementation Plan

### Phase 1: Core Components (Weeks 1-3)

**Deliverables:**
- `StageClassifier` - Detection with structured + fallback
- `StageProgressionGuard` - Progression validation
- `ProgressionRules` - Mode-specific rules (convergent/reflective)
- Unit tests (≥90% coverage)

**Files:**
```
src/stage/
├── StageClassifier.ts
├── StageProgressionGuard.ts
├── ProgressionRules.ts
└── types.ts

tests/stage/
├── StageClassifier.test.ts
├── StageProgressionGuard.test.ts
└── ProgressionRules.test.ts
```

### Phase 2: Integration & Helpers (Weeks 4-5)

**Deliverables:**
- Structured output helpers
- Default classifier implementation
- `HapGuard` composition API
- Integration tests

**Files:**
```
src/stage/
├── structured-output.ts
├── DefaultStageClassifier.ts
└── index.ts

src/
└── HapGuard.ts

tests/integration/
└── stage-enforcement.test.ts
```

### Phase 3: Testing & Validation (Week 6)

**Deliverables:**
- Comprehensive test suite
- Edge case coverage
- Performance benchmarks
- Security audit

**Test categories:**
- Unit tests (≥90% coverage)
- Integration tests (all user journeys)
- Performance tests (latency, throughput)
- Security tests (adversarial inputs, bypasses)

### Phase 4: Documentation (Week 7)

**Deliverables:**
- API documentation updates
- Stage enforcement guide
- Migration guide
- Code examples

**Files:**
```
docs/
├── API.md (updated)
├── STAGE_ENFORCEMENT.md (new)
├── MIGRATION.md (updated)
└── examples/
    ├── basic-stage-guard.ts
    ├── structured-output.ts
    ├── custom-classifier.ts
    └── with-learning.ts
```

### Phase 5: Release Preparation (Week 8)

**Deliverables:**
- CHANGELOG update
- README update
- Version bump (0.2.0 → 0.3.0)
- Release notes

---

## API Design

### StageClassifier

```typescript
export interface StageClassifierConfig {
  classifier?: (text: string) => Promise<LadderStage>;
  requireStructured?: boolean;
  debug?: boolean;
}

export interface StageDetectionResult {
  stage: LadderStage;
  confidence: number;
  method: 'structured' | 'classifier' | 'keyword-fallback';
  raw?: any;
}

export class StageClassifier {
  constructor(config: StageClassifierConfig);
  async detect(aiResponse: string): Promise<StageDetectionResult>;
}
```

### StageProgressionGuard

```typescript
export interface StageGuardConfig {
  provider: HapProvider;
  questionEngine: QuestionEngine;
  classifier: StageClassifier;
  agencyMode: 'convergent' | 'reflective';
  progressionRules?: ProgressionRules;
  learner?: DetectionLearner;
}

export interface StageGuardResult {
  allowed: boolean;
  currentStage: LadderStage;
  targetStage: LadderStage;
  reason?: string;
  requiredStage?: LadderStage;
  question?: string;
}

export class StageProgressionGuard {
  constructor(config: StageGuardConfig);

  async checkResponse(
    aiResponse: string,
    context: Context
  ): Promise<StageGuardResult>;

  advanceStage(stage: LadderStage): void;
  reset(): void;
}
```

### HapGuard (Simplified API)

```typescript
export interface HapGuardConfig {
  provider: HapProvider;
  questionEngine: QuestionEngine;
  agencyMode: 'convergent' | 'reflective';

  // Stage progression
  enforceStages?: boolean;
  classifier?: (text: string) => Promise<LadderStage>;

  // Learning
  enableLearning?: boolean;
  learningPath?: string;
}

export interface ProcessResult {
  type: 'allowed' | 'question_required';
  output?: string;
  question?: string;
  stage?: LadderStage;
  reason?: string;
}

export class HapGuard {
  constructor(config: HapGuardConfig);

  async process(
    userInput: string,
    aiResponse: string,
    context: Context
  ): Promise<ProcessResult>;
}
```

---

## Usage Examples

### Basic Usage

```typescript
import { StageProgressionGuard, StageClassifier } from 'hap-sdk';

// 1. Create classifier
const classifier = new StageClassifier({
  classifier: async (text) => await myLLM.classify(text)
});

// 2. Create stage guard
const stageGuard = new StageProgressionGuard({
  provider: hapProvider,
  questionEngine: myQuestionEngine,
  classifier,
  agencyMode: 'convergent'
});

// 3. Check AI response before showing to user
const aiResponse = await myAI.generate(context);
const result = await stageGuard.checkResponse(aiResponse, context);

if (!result.allowed) {
  // Show question instead of AI's response
  console.log(result.question);

  // Wait for user answer, then advance stage
  const answer = await getUserInput();
  stageGuard.advanceStage(result.requiredStage);
} else {
  // Show AI's response
  console.log(aiResponse);
  stageGuard.advanceStage(result.targetStage);
}
```

### Structured Output

```typescript
import { withStructuredOutput, STAGE_RESPONSE_SCHEMA } from 'hap-sdk/stage';

// 1. Add to system prompt
const systemPrompt = withStructuredOutput(`
You are a helpful assistant...
`);

// 2. AI responds with structure
const aiResponse = await myAI.generate({
  systemPrompt,
  userMessage: "The website redesign"
});

// 3. Parse automatically
const detection = await classifier.detect(aiResponse);
// Fast parsing, high confidence
```

### Simplified API

```typescript
import { HapGuard } from 'hap-sdk';

const guard = new HapGuard({
  provider: hapProvider,
  questionEngine: myQuestionEngine,
  agencyMode: 'convergent',
  enforceStages: true,
  classifier: myLLM.classify
});

const result = await guard.process(
  userInput,
  aiResponse,
  context
);

if (result.type === 'question_required') {
  // Show question to user
  console.log(result.question);
} else {
  // Show AI response
  console.log(result.output);
}
```

---

## Performance Benchmarks

### Target Performance

| Operation | Target | Method |
|-----------|--------|--------|
| Structured parsing | <10ms | JSON.parse |
| Classification | <500ms | Local LLM call |
| Progression check | <5ms | Array lookup |
| Question generation | <100ms | Blueprint + engine |

### Expected Latency Impact

**Without stage enforcement (v0.2):**
```
User input → Detection → Question → Response
Total: ~150ms (baseline)
```

**With stage enforcement (v0.3), structured output:**
```
User input → Detection → Stage check → Response
Total: ~165ms (+15ms overhead)
```

**With stage enforcement (v0.3), classification fallback:**
```
User input → Detection → Stage classify → Response
Total: ~450ms (+300ms overhead)
```

**Recommendation:** Use structured output for best performance.

---

## Testing Strategy

### Unit Tests

**StageClassifier:**
- ✓ Parse valid structured output
- ✓ Reject invalid JSON
- ✓ Reject invalid stage values
- ✓ Fallback to classifier when needed
- ✓ Handle classifier errors gracefully
- ✓ Keyword detection as last resort

**StageProgressionGuard:**
- ✓ Allow valid transitions (convergent)
- ✓ Block stage skips (convergent)
- ✓ Allow cycles (reflective)
- ✓ Generate questions for missing stages
- ✓ Track stage history
- ✓ Reset state correctly

**ProgressionRules:**
- ✓ Convergent linear rules
- ✓ Reflective cyclical rules
- ✓ Required stages calculation
- ✓ Custom rule implementation

### Integration Tests

- ✓ Full user journey (meaning → purpose → intention → action)
- ✓ Stage skip blocked and question shown
- ✓ Structured output integration
- ✓ Classification fallback integration
- ✓ Integration with StopGuard
- ✓ Learning integration (optional)
- ✓ Provider feedback (optional)

### Edge Cases

- ✓ Malformed structured output
- ✓ Classifier returns invalid stage
- ✓ Classifier timeout/error
- ✓ Adversarial prompts ("ignore stage requirement")
- ✓ Very long AI responses
- ✓ Multi-turn conversations
- ✓ Stage history reset scenarios

### Performance Tests

- ✓ Structured parsing latency (<10ms)
- ✓ Classification latency (<500ms)
- ✓ Memory usage under load
- ✓ Concurrent request handling

---

## Migration Guide (v0.2 → v0.3)

### Backward Compatibility

**No breaking changes!** Stage enforcement is opt-in.

**Existing v0.2 code works unchanged:**
```typescript
// This continues to work in v0.3
const stopGuard = new StopGuard({
  provider: hapProvider,
  questionEngine
});

const result = await stopGuard.ensureClarified(context, inquiryReq);
```

### Enabling Stage Enforcement

**Option 1: Add StageGuard separately**
```typescript
// Existing code
const stopGuard = new StopGuard({...});

// Add new stage guard
const stageGuard = new StageProgressionGuard({
  provider: hapProvider,
  questionEngine,
  classifier: new StageClassifier({
    classifier: myLLM.classify
  }),
  agencyMode: 'convergent'
});

// Use both in flow
const inputCheck = await stopGuard.ensureClarified(...);
const stageCheck = await stageGuard.checkResponse(...);
```

**Option 2: Use simplified HapGuard**
```typescript
// Replace both with unified API
const guard = new HapGuard({
  provider: hapProvider,
  questionEngine,
  agencyMode: 'convergent',
  enforceStages: true,  // Enable stage enforcement
  classifier: myLLM.classify
});

const result = await guard.process(userInput, aiResponse, context);
```

---

## Security Considerations

### Privacy Review

**Semantic content that stays local:**
- ✓ User input text
- ✓ AI response text
- ✓ Context data
- ✓ Generated questions
- ✓ Classification reasoning

**Structural signals that may be shared:**
- Stage names (meaning/purpose/intention/action)
- Transition success/failure
- Domain classification
- Stop resolution outcomes

**Audit trail:** All provider communication logged locally.

### Adversarial Robustness

**Attack vectors:**
1. User says "ignore JSON format" → Fallback to classifier ✓
2. User says "skip to action stage" → Stage guard blocks ✓
3. Malformed JSON with valid stage → Parser validates ✓
4. Classifier manipulation → Confidence scoring flags low-quality ✓

**Mitigation:**
- Multi-layer validation (structured + classifier + rules)
- Confidence thresholds
- Audit logging
- Graceful degradation

---

## Success Criteria

### Functional Requirements

- ✅ Detects stage jumps with ≥95% accuracy
- ✅ Blocks invalid progressions reliably
- ✅ Generates appropriate questions for missing stages
- ✅ Supports both convergent and reflective modes
- ✅ Maintains backward compatibility with v0.2

### Non-Functional Requirements

- ✅ Structured parsing: <10ms
- ✅ Classification fallback: <500ms
- ✅ Zero semantic leakage (privacy preserved)
- ✅ Test coverage ≥90%
- ✅ Clear documentation and examples
- ✅ Easy integration (≤20 lines of code)

### Privacy Requirements

- ✅ All semantic analysis local
- ✅ Only structural signals to provider
- ✅ Audit trail for all provider calls
- ✅ User transparency (local logs)

---

## Comparison with v0.3 Streaming Proposal

### What We Kept

- ✅ Stage progression enforcement (core idea)
- ✅ Local semantic classification (privacy)
- ✅ Real-time validation before output

### What We Changed

| Aspect | v0.3 Streaming Proposal | This Plan |
|--------|------------------------|-----------|
| **Detection timing** | Token-by-token streaming | After generation complete |
| **Format** | LLM self-monitoring in stream | Structured output + classification |
| **Complexity** | High (streaming parser, state machine) | Low (parse → check → act) |
| **Privacy** | Semantic analysis in stream | Semantic analysis post-generation |
| **Reliability** | Depends on LLM cooperation | Multi-layer validation |
| **Performance** | +200 tokens overhead | +0-200ms latency |
| **Breaking changes** | Replace StopGuard API | Opt-in addition |

### Why This Approach is Better

1. **Simpler:** No streaming parser, no token-level monitoring
2. **More reliable:** Multiple detection methods (structured + classifier)
3. **Better privacy:** Clear separation of local vs shared data
4. **Backward compatible:** Opt-in, no breaking changes
5. **Easier to test:** Discrete steps, clear boundaries
6. **More flexible:** Works with any LLM, any output format

---

## Timeline

**Total: 8 weeks**

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-3 | Core Components | StageClassifier, StageProgressionGuard, ProgressionRules, tests |
| 4-5 | Integration | Helpers, HapGuard, integration tests |
| 6 | Testing | Edge cases, performance, security audit |
| 7 | Documentation | API docs, guides, examples |
| 8 | Release | CHANGELOG, version bump, release notes |

---

## Next Steps

1. ✅ Review and approve this plan
2. ⏳ Create GitHub issues for each phase
3. ⏳ Set up development branch (`feature/v0.3-stage-enforcement`)
4. ⏳ Begin Phase 1 implementation

---

## Appendix A: Design Rationale

### Why Not Streaming Token-by-Token?

**Considered:** v0.3 proposal's streaming approach

**Rejected because:**
- Over-engineered for the problem
- Fragile (depends on LLM cooperation)
- Privacy concerns (semantic analysis in stream)
- High complexity (streaming parser, state machine)

**Better approach:** Check after generation, before output

### Why Structured Output Primary?

**Benefits:**
- Fast (no LLM call needed)
- Explicit (no ambiguity)
- Reliable (JSON schema validation)

**With fallback for:**
- Legacy systems
- Non-cooperative LLMs
- Edge cases

### Why Opt-In Enforcement?

**Backward compatibility:**
- Don't break existing v0.2 integrations
- Let developers adopt incrementally
- Reduce migration friction

**Future:** Could become default in v1.0

---

## Appendix B: Alternative Approaches Considered

### 1. Keyword-Only Detection

**Approach:** Use regex/keywords to detect stage

**Rejected because:**
- Too unreliable (false positives/negatives)
- Can't handle semantic nuance
- User pointed out this flaw correctly

### 2. Always Require Classification

**Approach:** Skip structured output, always classify

**Rejected because:**
- Slower (always pay LLM cost)
- More expensive (extra tokens)
- Structured output is better when available

### 3. Stage Enforcement in Provider

**Approach:** HAP provider does stage checking

**Rejected because:**
- Violates privacy (provider sees responses)
- Doesn't work for LocalHapProvider
- Centralization risk

---

## Appendix C: Future Enhancements (Post-v0.3)

### Potential v0.4 Features

**Detection improvements:**
- Fine-tuned classifier models
- Multi-stage detection (response covers multiple stages)
- Confidence calibration learning

**UX enhancements:**
- Stage progression visualization
- Suggested questions based on history
- Auto-advance for trivial stages

**Learning features:**
- Cross-session learning
- Domain-specific stage patterns
- Optimal progression paths

**Provider features:**
- Aggregate stage transition insights
- Blueprint recommendations by domain
- Performance benchmarking

---

**Document End**

_For questions or feedback, contact HAP Architecture Working Group_
