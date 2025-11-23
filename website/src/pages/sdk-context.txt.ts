import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read the SDK documentation files from the local sdk-docs directory
  const readmePath = path.join(process.cwd(), 'src/sdk-docs/README.md');
  const apiPath = path.join(process.cwd(), 'src/sdk-docs/API.md');
  const localDevPath = path.join(process.cwd(), 'src/sdk-docs/LOCAL_DEVELOPMENT.md');

  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const apiContent = fs.readFileSync(apiPath, 'utf-8');
  const localDevContent = fs.readFileSync(localDevPath, 'utf-8');

  // Combine all SDK documentation
  const combinedContent = `
# HAP SDK (TypeScript) - Complete Documentation

**Version 0.2.0 — November 2025**

This context includes the complete SDK documentation: README, API Reference, and Local Development Guide.

---

${readmeContent}

---

# API Reference

${apiContent}

---

# Local Development Guide

${localDevContent}

---

**Repository**: https://github.com/humanagencyprotocol/hap-sdk-typescript
**Website**: https://humanagencyprotocol.org/integration/sdk
`.trim();

  return new Response(combinedContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
