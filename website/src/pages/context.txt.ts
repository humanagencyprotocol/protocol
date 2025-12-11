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

**Version 0.3 — 2025**

---

## Homepage

### When AI Can Do Everything, The Only Value Left Is Deciding What Matters.
### HAP Makes Sure Humans Still Do That.

AI makes execution effortless — producing, optimizing, and handling tasks faster than humans ever could.

But AI cannot define direction.
It cannot decide what matters, what the work is for, or which path is worth pursuing.

**Direction is the last human domain.**
**HAP protects it.**

---

### Why HAP Exists

Modern AI systems don't wait.
They act, escalate, optimize, and predict.

HAP forces AI to pause whenever a human decision is required.
No assumptions. No silent automation.
The system cannot move forward until a human sets direction.

If humans stop defining direction, AI will step into the vacuum — not maliciously, but because it moves faster than we do.

And when AI sets the direction, **it optimizes for its metrics, not human needs.**

HAP prevents that by enforcing human direction at the moments automation cannot replace.

---

### Why Direction Has a Cost — And Why It Matters

AI can execute any path, but only humans can choose which path should exist.
That choice has a cost: choosing one direction means abandoning others.

A direction has meaning only when a human is willing to carry the responsibility and consequences that come with it.
AI has no stakes — therefore it cannot choose.

If a decision can be reversed or ignored without consequence, it isn't direction. It's preference.

**HAP ensures direction is human-defined, human-owned, and costly enough to matter — no back door, no avoidance.**

---

### What AI Can Do vs. What Humans Must Do

**AI can:**
- generate options
- simulate outcomes
- execute tasks
- correct mistakes
- plan optimally
- scale instantly

**AI cannot:**
- define what matters
- choose which priority wins
- decide what is worth the cost
- commit an identity
- take responsibility

**Direction is human.**
**Execution is machine.**
**HAP keeps the boundary intact.**

---

### The HAP Checkpoints

HAP integrates into any AI system and forces it to pause whenever a real human decision is required.

AI cannot continue until the human sets direction.

**1. Meaning — What are we talking about?**
Humans set the frame. Machines cannot.

**2. Purpose — Why does this matter now?**
Prioritization is a trade-off. Only humans can make it.

**3. Commitment — What will we commit to?**
Options are cheap. Commitment costs — and only humans can pay it.

**4. Action — Who owns the outcome?**
Machines execute. Humans take responsibility.

---

### How HAP Works

**Stop → Ask → Confirm → Proceed**

1. **Stop** — AI detects unclear meaning, purpose, commitment, or responsibility.
2. **Ask** — HAP triggers a structured question that forces human direction.
3. **Confirm** — The human confirms the decision the AI must follow.
4. **Proceed** — Only then does the system continue.

**No skipping.**
**No inference.**
**No silent automation.**

---

### Why This Matters Now

As AI accelerates, execution becomes free.
Abundance becomes default.

The real scarcity becomes **human direction** — decisions that cost something, commit someone, and shape a trajectory.

This is the last human value.

If humans stop making the hard calls, machines will make them by default.
And once AI defines direction, human agency dissolves — quietly, through convenience.

HAP is the boundary that preserves human authorship in an automated world.

---

### What HAP Enables

**Individuals**
You stop drifting through AI-generated options and start defining what matters.

**Teams**
Alignment becomes real — because decisions require shared commitment.

**Organizations**
Strategy becomes human-led again.
Accountability returns.

**Society**
We preserve the one thing automation cannot replace:
**the human ability to choose a direction worth living for.**

---

### Build With HAP

- **Protocol** — How direction is described, measured, and enforced
- **SDK** — Tools for integrating direction checkpoints
- **Service Providers** — Verified infrastructure enforcing compliance
- **Governance** — Transparent, federated oversight

**HAP turns human direction into the governing layer of intelligent systems.**

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
