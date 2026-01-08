import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read the comprehensive SDK documentation from the content/docs directory
  const sdkDocPath = path.join(process.cwd(), 'src/content/docs/sdk.md');
  const protocolContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/protocol.md'), 'utf-8');
  const serviceContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/service.md'), 'utf-8');
  const integrationContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/integration.md'), 'utf-8');
  const governanceContent = fs.readFileSync(path.join(process.cwd(), '../content/0.1/governance.md'), 'utf-8');

  const sdkContent = fs.readFileSync(sdkDocPath, 'utf-8');

  // Return the complete SDK documentation with full protocol context
  const combinedContent = `
# HAP SDK (TypeScript) - Complete Documentation with Protocol Context

**Version 0.1 — January 2026**

This comprehensive SDK documentation provides everything developers need to integrate HAP into their applications:
- Core SDK architecture and installation
- API reference for all components
- Local development and testing guidelines
- Complete implementation of six human gates (Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner)
- Attestation and Decision Owner Scope (DOS) enforcement
- Privacy-preserving architecture with zero semantic leakage

---

## SDK Documentation

${sdkContent}

---

## Full Protocol Specification

### Protocol Specification

${protocolContent}

---

### Integration Specification

${integrationContent}

---

### Service Provider Specification

${serviceContent}

---

### Governance Framework

${governanceContent}

---

**Repository**: https://github.com/humanagencyprotocol/hap-sdk-typescript
**Website**: https://humanagencyprotocol.org/integration/sdk

For developers: This context provides the complete technical documentation needed to implement HAP-compliant applications with proper human direction enforcement.
`.trim();

  return new Response(combinedContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
