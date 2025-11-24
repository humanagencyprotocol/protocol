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

AI is increasingly taking actions on our behalf — drafting communication, making plans, coordinating work, triggering workflows, and soon, executing full tasks end-to-end.

**The danger isn't malice. It's momentum without understanding:**
- AI assumes goals you didn't name.
- It invents purpose you never stated.
- It picks an approach you didn't choose.
- It leaps from vague input straight to concrete action.

By default, AI fills the gaps. That's how you lose authorship.

**The Human Agency Protocol (HAP) prevents this.**
It enforces mandatory human checkpoints at every stage of orientation:
- **Meaning** — What exactly are we talking about?
- **Purpose** — Why does this matter now?
- **Intention** — What are we choosing to do first?
- **Action** — Who does what, by when?

**HAP v0.3 adds strict stage-progression enforcement.**
AI can no longer jump from "help with my project" to "I'll deploy a fix" without confirming what the project is, why the user cares, and what action is actually intended.

**Human intention, not machine inference, drives value creation.**

### How It Works

Stop → Ask → Proceed — Now Across All Stages

1. **Stop** — The system detects ambiguity, drift, or an attempt to skip a ladder stage.
2. **Ask** — HAP triggers a context-appropriate question (an Inquiry Blueprint). The AI must wait for human input.
3. **Proceed** — Only after the checkpoint is resolved can the AI advance and perform any downstream actions.

These are not guidelines. They are enforced requirements a HAP-compliant system cannot bypass.

### Two Inquiry Modes

Human thinking has two fundamental rhythms:

**Convergent Mode** — For alignment, decisions, planning, and execution.
- Progress must move meaning → purpose → intention → action
- No skipping or fast-forwarding
- Guarantees trustworthy, human-led closure

**Reflective Mode** — For exploration, learning, insight, and creativity.
- Movement can be cyclical, recursive, or non-linear
- The AI serves depth, not premature decisions
- Guarantees sustained, human-anchored reflection

Both modes follow the same core rule: AI cannot advance when meaning, purpose, or intention are unclear — in any direction.

### The Inquiry Ladder

All productive human inquiry follows the same structure:
1. **Meaning** — Are we talking about the same thing?
2. **Purpose** — Why does this matter?
3. **Intention** — What will we do first?
4. **Action** — How do we execute?

HAP embeds this ladder into every AI-mediated interaction. If the system detects missing meaning, unresolved purpose, or unclear intention, it must pause and ask before continuing.

**The result:** AI doesn't just answer. It orients.

### Core Principles (v0.3)

1. **Stage Progression Enforcement** — AI must move through Meaning → Purpose → Intention → Action in the correct order (Convergent) or within a controlled cycle (Reflective). No jumps. No shortcuts. No silent inference.

2. **Mandatory Human Checkpoints** — Whenever meaning, purpose, or intention is unclear, the system must stop and ask the user. AI cannot proceed without explicit human confirmation.

3. **Human-Gated Actions** — Downstream actions (publishing, sending, deploying, triggering systems) are locked behind confirmed stages. Risk determines the required ladder stage.

4. **Two Inquiry Modes** — Convergent (linear progress toward decisions and execution) and Reflective (cyclical exploration without forced closure). Both modes obey stop → ask → proceed.

5. **Privacy by Architecture** — Only structural signals leave the device or application. No transcripts. No semantic content. No user data exposure.

6. **Blueprinted Questions** — All clarifying questions follow shared, open Inquiry Blueprints. Local systems phrase them; the protocol decides when they must be asked.

7. **Verified Compliance** — Every checkpoint resolution and gated action is validated by local enforcement and optionally cryptographically signed (HAP Envelope). Proof, not trust.

8. **Stewardship Over Ownership** — A federated network of qualified Service Providers enforces protocol behavior. No centralized control. No data extraction.

### Why This Matters Right Now

As automation accelerates, human intention is becoming the scarcest resource.

Systems that act "based on patterns" will always default to the average. Systems that pause and ask humans at the right moments preserve authorship, clarity, and agency.

**The Human Agency Protocol ensures:**
- AI cannot assume your goals
- AI cannot skip clarification
- AI cannot act without your direction
- AI cannot run ahead of your understanding
- AI cannot replace your authorship in meaningful work

The right question, asked at the right time, is what keeps us human.

### Complete Specification

The protocol documentation includes:
- The Protocol: Core specification defining how agency is described, measured, and exchanged
- Integration: SDK for human-aligned AI with protocol compliance built in
- Service Providers: Technical infrastructure for HAP-compliant systems at scale
- Governance: Integration into regulatory frameworks with enforcement mechanisms

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
