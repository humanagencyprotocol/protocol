import fs from 'fs';
import path from 'path';
import { siteConfig } from '../config';

export async function GET() {
  // Get version from config (sourced from package.json)
  const version = siteConfig.version;

  // Read the raw markdown files from the current version
  const contentPath = path.join(process.cwd(), `../content/${version}`);
  const protocolContent = fs.readFileSync(path.join(contentPath, 'protocol.md'), 'utf-8');
  const serviceContent = fs.readFileSync(path.join(contentPath, 'service.md'), 'utf-8');
  const integrationContent = fs.readFileSync(path.join(contentPath, 'integration.md'), 'utf-8');
  const governanceContent = fs.readFileSync(path.join(contentPath, 'governance.md'), 'utf-8');

  // Combine all content
  const combinedContent = `
# Human Agency Protocol - Complete Context

**Version ${version} — January 2026**

---

## Homepage

### AI as your Engine, not your Pilot.
### HAP is the protocol for human-authored direction. It ensures AI never executes without a Decision Owner.

AI makes execution effortless — producing, optimizing, and handling tasks faster than humans ever could.
But AI cannot define why the work matters or which path is worth the cost.

**HAP ensures humans define the frame, accept the tradeoffs, and own the consequences.**

---

### The Scarcity of Direction

Modern AI doesn't wait. It predicts, escalates, and acts at machine speed. But without human leadership, AI moves into a **decision vacuum—substituting statistical probability for the unique human innovation that creates real value.**

To remain in control, we must enforce a fundamental boundary:

> “No consequential action may be taken in a human system without an identifiable human who has explicitly authorized it, understood its tradeoffs, and accepted responsibility for its outcomes.”

HAP turns this axiom into infrastructure. It ensures every action traces back to a human **Decision Owner** who provides the direction machine intelligence cannot duplicate. By forcing AI to pause at the point of irreversibility, HAP keeps authorship human and innovation possible.

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
- set the frame
- justify why to act (problem)
- choose what to optimize (objective)
- accept the tradeoff
- make binding commitment
- be a decision owner

**Direction is human.**
**Execution is machine.**
**HAP keeps the boundary intact.**

---

### The Six Human Gates

AI can simulate a thousand paths, but it cannot open the gate to any of them. HAP enforces these mandatory preconditions before any execution begins.

**Frame — The Boundary**
Humans define what we are deciding. AI has no context until a human sets the decision boundary.

**Problem — The Justification**
Every action needs a reason. AI calculates solutions; only humans determine if the problem is worth solving.

**Objective — The Optimization**
AI optimizes for any metric. Only humans can choose which outcome actually matters.

**Tradeoff — The Cost**
Every choice abandons alternatives. Only humans can accept the loss of what is sacrificed.

**Commitment — The Point of No Return**
Commitment makes a choice binding. Only a human can make an AI action irreversible.

**Decision Owner — The Responsibility**
Authorship and Ownership are unified. No action is taken without an identifiable human who bears the consequences.

---

### How HAP Works

**Stop → Ask → Confirm → Proceed**

1. **Stop** — AI detects missing or ambiguous decision states: frame, problem, objective, tradeoff, commitment, or decision owner.
2. **Ask** — HAP triggers a structured question that forces human direction.
3. **Confirm** — The human confirms the decision the AI must follow.
4. **Proceed** — Only then does the system continue.

**No skipping.**
**No inference.**
**No silent automation.**

---

### Compliant by Architecture

Aligning with the EU AI Act—the global benchmark for AI governance.

The **EU AI Act** mandates that high-risk AI systems must be subject to effective human oversight (**Article 14**). HAP transforms this legal requirement from a policy checkbox into enforceable protocol behavior.

- **Verifiable Oversight** — Directly satisfies regulatory mandates by ensuring AI never acts without an explicit "gate" opened by a human.
- **Liability Protection** — Closes the legal vacuum of "unowned" AI execution by cryptographically linking every action to a human Decision Owner.
- **Audit-Ready Infrastructure** — Provides a structural, tamper-proof trail of authorship, tradeoffs, and commitments for every consequence domain.

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
Alignment becomes real — because decisions require explicit, domain-scoped commitment from all affected decision owners.

**Organizations**
Strategy becomes human-led again. Authorship and ownership are unified across every consequence domain.

**Society**
We preserve the one thing automation cannot replace:
**the human ability to choose a direction worth living for.**

HAP assumes all execution bodies are untrusted.
No human direction may be exposed to any executor (AGI, server, or human) until a valid attestation proves all six gates were closed under a recognized Blueprint.

The Executor Proxy—not the executor—validates attestations.
Executors receive only minimal, non-semantic instructions derived from pre-ratified decisions.

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

${integrationContent}

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
