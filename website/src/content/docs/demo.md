---
title: "Deploy Gate Demo"
version: "Version 0.2"
date: "January 2026"
---

A merge-blocking check that prevents deployment surprises, built with the Human Agency Protocol (HAP).

Before code ships, each required owner reviews what's changing in their area and explicitly commits to how the change will be deployed and what constraints apply. No rubber stamps — just cryptographic proof that the right people bound themselves to the deployment.

**Live Demo:** [demo.humanagencyprotocol.org](https://demo.humanagencyprotocol.org/)

**GitHub:** [github.com/humanagencyprotocol/hap-deploy-gate-demo](https://github.com/humanagencyprotocol/hap-deploy-gate-demo)

## How It Works

This demo implements a **merge-blocking gate**. Before any PR can be merged, each required domain owner must review the execution context for their area and sign a cryptographic attestation confirming they've bound themselves to the deployment.

### The Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. DEVELOPER creates PR                                                │
│     └─→ GitHub Action runs → ❌ Blocks merge (no attestation)          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  2. REVIEWER opens attestation UI and progresses through 6 gates:       │
│                                                                         │
│     Gate 1: Frame                                                       │
│       • Load PR (title, description, changed files)                     │
│       • Select execution path: Canary or Full                           │
│                                                                         │
│     Gate 2: Decision Owner                                              │
│       • Select and lock role (Engineering / Release Management)         │
│                                                                         │
│     Gate 3: Problem                                                     │
│       • Articulate in your own words: what problem does this solve?     │
│                                                                         │
│     Gate 4: Objective                                                   │
│       • Articulate in your own words: what outcome are you approving?   │
│                                                                         │
│     Gate 5: Tradeoffs                                                   │
│       • Articulate: what risks are you accepting under this path/role?  │
│                                                                         │
│     Gate 6: Commitment                                                  │
│       • Review summary and sign attestation                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  3. SERVICE PROVIDER signs attestation                                  │
│     • Computes frame hash (repo + SHA + env + path)                     │
│     • Records which gates were passed                                   │
│     • Signs with Ed25519 key                                            │
│     • Returns cryptographic blob with 1-hour TTL                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  4. REVIEWER clicks "Publish Attestation"                               │
│     └─→ Server stores attestation → GitHub App updates PR check        │
│     └─→ When all required domains attested → ✅ Check passes           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Navigation

The UI features a persistent navigation bar showing:
- **AI Assistant** link (left) - Configure optional AI assistance
- **6 Gate pills** - Visual progress through the attestation flow

Gates can be revisited and edited after completion. Changes are held in draft state until explicitly saved.

### What Gets Verified

The GitHub App (or Action) checks:
- ✓ Attestation exists for the current commit SHA
- ✓ Cryptographic signature is valid
- ✓ Attestation hasn't expired
- ✓ All required domains have attested (based on execution path in decision file)

## AI Assistant (Advisory Boundary)

This demo includes an optional AI assistant to help reviewers understand changes before approving. The AI can answer questions, summarize diffs, and surface potential issues — but it has no authority in the decision process.

AI configuration is available from the **AI Assistant** link in the navigation bar. You can change settings at any time during the review.

### AI Options

1. **Local/Private AI (Recommended)** — Run AI locally with Ollama. Your data never leaves your machine. This is the trusted option.

2. **Public AI (Demo only)** — Use OpenAI, Groq, or other cloud providers. **Warning:** Do not use with sensitive or confidential data. PR content will be sent to external servers.

3. **No AI** — Review changes without AI assistance.

### What AI Can Do

- Answer questions about the changes
- Summarize diffs and highlight affected areas
- Point out potential risks or contradictions
- Help reviewers think through tradeoffs

### What AI Cannot Do

- Write or modify decision fields
- Select tradeoffs or execution paths
- Close gates or trigger attestations
- Influence what gets executed

### The Boundary

All AI output remains local and is never included in the signed attestation. The system records **what was approved** — not the AI's reasoning or the reviewer's intent.

> **Approval is always a human act, based on explicit structural commitments.**

## Structure

```
demo/
├── apps/
│   ├── ui/           # Attestation UI (Next.js, localhost:3000)
│   └── server/       # Service Provider (Next.js, localhost:3001)
├── packages/
│   └── hap-core/     # Shared canonicalization and verification logic
└── .github/
    └── workflows/
        └── hap-check.yml  # GitHub Actions attestation verification
```

## Quick Start

### Option A: Use the Public Server (Recommended)

A public Service Provider is available at **https://service.humanagencyprotocol.org** — no server setup required.

```bash
# Install dependencies
pnpm install

# Build shared package
pnpm --filter @hap-demo/core build

# Start UI only
pnpm dev:ui
```

Create `apps/ui/.env.local`:
```
GITHUB_TOKEN=<your personal access token with repo scope>
NEXT_PUBLIC_SP_URL=https://service.humanagencyprotocol.org
```

### Option B: Run Your Own Server

```bash
# Install dependencies
pnpm install

# Build shared package
pnpm --filter @hap-demo/core build

# Start server (SP)
pnpm dev:server

# Start UI (separate terminal)
pnpm dev:ui
```

Create `apps/ui/.env.local`:
```
GITHUB_TOKEN=<your personal access token with repo scope>
NEXT_PUBLIC_SP_URL=http://localhost:3001
```

## GitHub Setup

### Option 1: GitHub App Integration (Recommended)

The GitHub App provides automatic PR check updates when attestations are published. No copy-paste required.

#### Step 1: Register a GitHub App

1. Go to https://github.com/settings/apps/new
2. Fill in the basic information:
   - **GitHub App name:** `HAP Deploy Gate` (or your preferred name)
   - **Homepage URL:** `https://humanagencyprotocol.org`
   - **Webhook URL:** `https://YOUR_SERVER_DOMAIN/api/github/webhook`
   - **Webhook secret:** Generate with `openssl rand -hex 32`

3. Set repository permissions:
   | Permission | Access |
   |------------|--------|
   | Checks | Read & write |
   | Contents | Read-only |
   | Pull requests | Read-only |
   | Metadata | Read-only |

4. Subscribe to events:
   - [x] Pull request

5. Click **Create GitHub App**

#### Step 2: Generate Private Key

1. After creation, scroll to "Private keys"
2. Click "Generate a private key"
3. A `.pem` file will download

Convert for environment variable:
```bash
cat your-app.private-key.pem | awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}'
```

#### Step 3: Install the App

1. Go to your app's settings page
2. Click "Install App" in the left sidebar
3. Select the repository where you want to use it

#### Step 4: Configure Environment

Create `apps/server/.env.local`:
```bash
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret
```

### Option 2: GitHub Action Only (Legacy)

If you don't want to set up the GitHub App, you can still use the copy-paste workflow with GitHub Actions.

### Enable Branch Protection (Required for Merge Gate)

To block merges without valid attestations, you need to set up a branch ruleset:

1. Go to **Settings → Rules → Rulesets → New ruleset → New branch ruleset**
2. Configure the ruleset:
   - **Ruleset name:** `HAP Protection`
   - **Enforcement status:** `Active`
3. Under **Target branches**, click **Add target** → **Include by pattern**:
   - Enter: `main`
4. Under **Branch rules**, enable:
   - **Require status checks to pass**
     - Click **Add checks** and search for: `Verify HAP Attestation`
   - **Require a pull request before merging** (recommended)
   - **Block force pushes** (recommended)
5. Click **Create**

Without this setup, the workflow will report status but won't block merges.

> **Note:** The GitHub Action automatically uses `https://service.humanagencyprotocol.org` for attestation verification. No additional configuration is needed.

## Demo Flow

### Single Approval (Canary Path)

1. Create a PR to the `main` branch
2. Run `pnpm dev:ui` (or also `pnpm dev:server` if running locally)
3. Open http://localhost:3000
4. Configure AI Assistant (optional) or click Continue to skip
5. **Gate 1 - Frame:** Enter the PR URL, click "Load PR", select **Canary** path, close gate
6. **Gate 2 - Decision Owner:** Select **Engineering** role, lock role and close gate
7. **Gate 3 - Problem:** Write what problem this change addresses (20-240 chars), close gate
8. **Gate 4 - Objective:** Write what outcome you're approving (20-240 chars), close gate
9. **Gate 5 - Tradeoffs:** Write what risks you accept as Engineering under Canary, close gate
10. **Gate 6 - Commitment:** Review summary and click "Sign Attestation"
11. Click "Publish Attestation" to publish to the server
12. The GitHub App automatically updates the PR check status

### Multi-Person Approval (Full Path)

For production deployments requiring multiple approvals:

1. Create a PR and in Gate 1, select **Full (immediate deployment)** path
2. **Engineer** goes through all 6 gates:
   - Gate 2: Select role **Engineering**
   - Gates 3-5: Articulate problem, objective, and tradeoffs
   - Gate 6: Sign and publish attestation
3. **Release Manager** goes through the UI separately:
   - Gate 2: Select role **Release Management**
   - Gates 3-5: Articulate from their perspective
   - Gate 6: Sign and publish attestation
4. GitHub App tracks attestations and updates PR check
5. Merge is allowed only when all required roles have attested

| Execution Path | Required Approvals |
|---------------|-------------------|
| Canary | Engineering only |
| Full | Engineering + Release Management |

## Endpoints

### Service Provider (SP)

- `GET /api/sp/pubkey` - Get SP public key
- `POST /api/sp/attest` - Request attestation
- `POST /api/sp/verify` - Verify attestation signature
- `POST /api/attestations` - Publish attestation (for GitHub App integration)
- `GET /api/attestations` - Get attestation status for a PR
- `POST /api/github/webhook` - GitHub webhook handler

### Attestation UI

- `GET /` - Attestation wizard
- `POST /api/attest` - Request attestation (proxies to SP)
- `POST /api/comment` - Post attestation to PR
- `GET /api/comments` - Fetch PR comments

## Environment Variables

### Server

```
SP_PRIVATE_KEY=<hex>     # Ed25519 private key (optional, generates ephemeral if not set)
SP_PUBLIC_KEY=<hex>      # Ed25519 public key

# GitHub App (for automatic PR check updates)
GITHUB_APP_ID=<number>              # App ID from GitHub App settings
GITHUB_APP_PRIVATE_KEY=<pem>        # Private key (newlines as \n)
GITHUB_APP_WEBHOOK_SECRET=<string>  # Webhook secret for signature verification

# Storage (production)
KV_REST_API_URL=<url>    # Vercel KV URL (optional, uses in-memory for local dev)
KV_REST_API_TOKEN=<token>
```

### UI

```
GITHUB_TOKEN=<token>     # For posting/reading PR comments
NEXT_PUBLIC_SP_URL=http://localhost:3001
```

## Protocol Compliance

This demo implements:

- **Deploy Gate Profile v0.2** - Frame canonicalization, Decision Owner scopes
- **Attestation format** - Ed25519 signatures, TTL enforcement
- **Multi-person approval** - Role-based attestations aggregated by workflow
- **Cryptographic verification** - Signature verification via deployed service
- **Error codes** - INVALID_SIGNATURE, EXPIRED, FRAME_MISMATCH, etc.

See [Human Agency Protocol](https://humanagencyprotocol.org) for full specification.
