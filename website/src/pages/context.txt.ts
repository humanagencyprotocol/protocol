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

The More AI Shapes Our Lives, the More It Must Ask Humans First.

A protocol that forces AI to ask humans for meaning and direction before acting.

### Core Principles

**Inquiry Keeps Agency**
The protocol inserts structured questions at the critical junctures so people—not models—decide meaning, purpose, and action. Automation pauses until humans respond.

**Privacy-First Architecture**
No transcripts. No personal data. No content storage. Only structural signals that measure recognition and alignment—while your context stays sealed.

**Open Governance**
A shared protocol maintained by stewards, not owners. Transparent blueprints. Participatory evolution. Infrastructure for collective autonomy.

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
