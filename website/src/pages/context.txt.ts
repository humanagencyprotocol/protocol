import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Get all docs from content collection
  const docs = await getCollection('docs');

  // Read the raw markdown files
  const protocolContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/protocol.md'), 'utf-8');
  const serviceContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/service.md'), 'utf-8');
  const governanceContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/governance.md'), 'utf-8');

  // Combine all content
  const combinedContent = `
# Human Agency Protocol - Complete Context

**Version 0.3 — November 2025**

---

## Homepage

### Title
The More AI Shapes Our Lives, the More It Must Ask Humans First.

A protocol that forces AI to ask humans for meaning, purpose, and intention before it's allowed to act.

### Why This Matters

AI now drafts messages, plans steps, triggers workflows, and increasingly executes full tasks.

**The risk isn't malice — it's momentum without clarity:**
goals assumed, purpose invented, actions taken before humans decide what they actually want.

That's how authorship disappears.

**The Human Agency Protocol prevents this.**
When meaning, purpose, or intention is unclear, AI must stop, ask, and wait.

**Human intention becomes non-optional.**

### How HAP Works

Stop → Ask → Proceed

1. **Stop** — The system detects ambiguity, drift, or missing stages.
2. **Ask** — HAP triggers a clarifying question. The AI must wait.
3. **Proceed** — Only after the human answers can the AI continue.

These checkpoints are enforced. They cannot be bypassed.

### Two Inquiry Modes

Human thinking has two rhythms. HAP protects both.

**Convergent Mode** — For decisions, planning, and execution.
Progress moves meaning → purpose → intention → action. No skipping. No inference.

**Reflective Mode** — For exploration, learning, and creativity.
Movement is cyclical or non-linear. The AI serves depth, not premature closure.

In both modes: AI cannot advance when orientation is unclear.

### The Inquiry Ladder

All productive work follows the same path:
1. **Meaning** — Are we talking about the same thing?
2. **Purpose** — Why does this matter?
3. **Intention** — What will we do first?
4. **Action** — How do we execute?

HAP makes this path mandatory. If meaning, purpose, or intention is unclear, the system must stop and ask.

AI doesn't just answer. It orients.

### Core Principles (v0.3)

**Stage Progression Enforcement**
AI must follow the ladder in the correct order (Convergent) or controlled cycles (Reflective).
No jumps. No shortcuts. No inference.

**Mandatory Human Checkpoints**
When meaning, purpose, or intention is unclear, the system stops and asks. AI cannot proceed without explicit human confirmation.

**Human-Gated Actions**
Downstream actions (publishing, sending, deploying) are locked behind confirmed stages.
Risk determines the required stage.

**Two Inquiry Modes**
Convergent (linear toward decisions) and Reflective (cyclical exploration). Both modes obey stop → ask → proceed.

**Privacy by Architecture**
Only structural signals leave the device. No transcripts. No semantic content. No user data exposure.

**Blueprinted Questions**
All questions follow shared, open Inquiry Blueprints.
Local systems phrase them; the protocol decides when they're asked.

**Verified Compliance**
Every checkpoint and action is validated locally and optionally signed (HAP Envelope).
Proof, not trust.

**Stewardship Over Ownership**
A federated network of Service Providers enforces protocol behavior.
No centralized control. No data extraction.

### Why This Matters Now

As automation accelerates, human intention becomes the scarcest resource.

Systems that act "based on patterns" default to the average. Systems that pause and ask preserve authorship.

HAP ensures AI cannot assume goals, skip clarification, or act without direction.

The right question, asked at the right time, is what keeps us human.

### Complete Specification

The protocol documentation includes:
- The Protocol: Core specification for measuring and preserving agency
- Integration: SDK for building HAP-compliant systems
- Service Providers: Infrastructure for enforcement at scale
- Governance: Regulatory integration with verification mechanisms

---

${protocolContent}

---

${serviceContent}

---

${governanceContent}

---

Repository: https://github.com/schadauer/human-agency-protocol
Website: https://humanagencyprotocol.org
`.trim();

  return new Response(combinedContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
