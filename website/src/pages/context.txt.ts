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

**Version 0.1 — November 2025**

---

## Homepage

### Title
The More AI Shapes Our Lives, the More It Must Ask Humans First.

A protocol that forces AI to ask humans for meaning and direction before acting.

### Why This Matters

AI is becoming deeply embedded in daily life.
The real risk isn't bad intent—it's AI acting on unclear or assumed meaning.

AI naturally fills in missing meaning. Without a rule that forces it to stop, it will act on guesses.

The Human Agency Protocol fixes this by enforcing mandatory human checkpoints.
When meaning drifts or direction becomes uncertain, AI must stop, ask, and wait.
It cannot infer. It cannot proceed alone.

HAP is the rule that keeps AI aligned with human meaning - no guessing, no inferring, no acting alone.

### How It Works

Stop → Ask → Proceed

1. Stop — AI detects ambiguity, drift, or conflicting intent.
2. Ask — The protocol triggers a structured, human-facing question. The AI must wait for a human answer.
3. Proceed — Only after meaning or direction is clarified can the system act.

These checkpoints aren't suggestions. They're enforced conditions that no compliant system can bypass.

Local AI systems stay adaptive - they decide how to phrase the question, but the protocol ensures they must ask.

### Core Principles

**Mandatory Human Checkpoints**
AI must pause and ask humans whenever meaning becomes unclear — no assumptions, no bypass.

**Privacy by Architecture**
Only minimal structural signals leave the system. No transcripts. No personal data. No content exposure.

**Open, Enforced Governance**
A transparent protocol maintained by qualified stewards. No owners. No extraction. Compliance required.

### Complete Specification

The protocol documentation includes:
- The Protocol: Core specification defining how agency is described, measured, and exchanged
- Service Providers: Technical infrastructure for HAP-compliant systems
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
