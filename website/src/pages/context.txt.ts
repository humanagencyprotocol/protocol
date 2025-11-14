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

When AI does everything, build for human agency.

A global protocol that helps AI systems create human value where automation can't — without ever sharing your content.

### Core Principles

**Inquiry Keeps Agency**
HAP inserts structured questions at the critical junctures so people—not models—decide meaning, purpose, and action. Automation pauses until humans respond.

**Privacy-First Architecture**
No transcripts. No personal data. No content storage. Only structural signals that measure recognition and alignment—while your context stays sealed.

**Open Governance**
A shared protocol maintained by stewards, not owners. Transparent blueprints. Participatory evolution. Infrastructure for collective autonomy.

---

## About

### Why HAP Exists

The age of intelligent automation creates a paradox: intelligence becomes abundant, but human agency becomes scarce.

Frontier AI is optimized for automation—take a request, reason over it, and produce an answer. As more work becomes automatable, the marginal value of execution drops toward zero.

What doesn't drop is the value of human agency—the capacity to choose, to set purpose, to act from context. In a world where everything can be done, the scarce thing becomes: knowing what's worth doing, why it matters—and turning that knowing into action that carries human value.

HAP is infrastructure for that world.

### What HAP Provides

The Human Agency Protocol is infrastructure for that world. It is a global inquiry protocol that AI-native, privacy-first systems can call to strengthen human and collective agency—without ever sharing user content.

It doesn't produce answers or actions. It improves the quality, timing, and structure of questions that local systems ask—so humans remain in authorship of meaning and direction.

### First Adopters

- **Nearmydear** – collective clarity and shared action in groups
- **The Resonance Room** – individual creative development and reflection

Both rely on the same foundation: an external, neutral layer that provides Inquiry Blueprints instead of predefined prompts, allowing each to adapt questions locally while keeping private context sealed.

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
