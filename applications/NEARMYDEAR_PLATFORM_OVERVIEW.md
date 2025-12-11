# Nearmydear - The New Operating System for Collaboration

This document provides a comprehensive overview of the Nearmydear platform, designed for two distinct audiences.

*   **Part 1: The Vision** is for leaders and teams who know the future of work is hybrid, and that bridging the gap between face-to-face collaboration and asynchronous progress is their biggest challenge.
*   **Part 2: The Technical Whitepaper** is for architects, engineers, and integrators who need to understand the underlying mechanics of this new collaboration model.

---

## Part 1: The Vision - The Project is the Protagonist

### The Problem: The Disconnected Project

For local teams that thrive on face-to-face interaction, the modern workflow is a paradox. The most valuable work happens when the team is together, but this energy and context dissipates the moment everyone leaves the room. Project knowledge becomes siloed in documents, task managers, and individual team members' heads. The project itself has no memory, no voice, and no way to participate in its own development.

Recording meetings is a partial solution, but it's passive. It doesn't solve the core problem: How do you create a living, intelligent hub for a project that both respects the power of in-person collaboration and enables powerful, asynchronous work?

### The Solution: A Living Project Context Governed by Human Agency

Nearmydear is the first **Collaboration Operating System** built on the revolutionary **Human Agency Protocol (HAP)**. This isn't just another feature; it's a fundamental new architecture for AI-human collaboration that guarantees the AI facilitates, but *never* leads.

HAP's core principle is simple but powerful: **Stop → Ask → Proceed**. When an AI assistant encounters ambiguity, it is forbidden from making assumptions. It must stop, ask for clarification from the team, and can only proceed after a human provides explicit direction.

This is enforced through the **Inquiry Ladder**, a mandatory series of checkpoints:
1.  **Meaning:** Do we all understand the same thing?
2.  **Purpose:** Why does this matter to the project?
3.  **Intention:** What is our agreed-upon approach?
4.  **Action:** Who will do what, and by when?

The AI assistants in Nearmydear *must* respect this ladder. They cannot jump from a vague idea directly to an action plan. This protocol-enforced discipline ensures that every step is intentional, aligned, and authored by the team.

The process begins with a unique **"genesis meeting"**: The team gathers face-to-face, and each member registers their Personal AI Assistant with the project using a secure, **spoken passcode**. This creates a trusted, HAP-governed environment where the team's registered AIs become active, persistent, and safe members of the project, enabling two powerful modes of work:

1.  **Synchronous Collaboration (In Meetings):** During face-to-face meetings, the system records and analyzes the conversation. The team's registered Personal AIs participate, flagging ambiguities and ensuring the discussion respects the HAP Inquiry Ladder.

2.  **Asynchronous Collaboration (24/7):** Between meetings, team members delegate tasks to their Personal AIs (e.g., "Summarize our decision on the Q3 budget"). The AIs interact with the living project context, always operating within the strict Stop → Ask → Proceed rules of HAP.

This disciplined, AI-assisted workflow is not limited to one domain.

### Broad Applicability
Nearmydear is designed for any collaborative effort where clarity and verifiable intent are critical.
-   **In Business:** It streamlines project management, complex R&D, and strategic planning, ensuring teams are aligned from kickoff to execution.
-   **In Education:** It facilitates Socratic seminar discussions, group research projects, and thesis reviews, prioritizing deep understanding over superficial answers.
-   **In Civic Tech:** It provides a framework for public consultations, policy-making working groups, and community-led projects, creating a transparent and auditable record of the decision-making process.

### Privacy and Open by Design
Nearmydear is built on a foundation of user sovereignty and trust.
-   **Privacy First:** The HAP architecture is private by design. All sensitive content—your conversations and project data—remains within your local Project Context Host and is never exposed to an external service.
-   **Open and Interoperable:** The platform is model-agnostic. Teams can connect their preferred large language models from any provider (OpenAI, Anthropic, Google) or even use local, open-source models. Any third-party AI assistant can become a trusted project member, as long as it can communicate via the open **Model Context Protocol (MCP)**. This prevents vendor lock-in and creates a truly open ecosystem.

### The Value Proposition

For **Decision-Makers**, Nearmydear offers:
-   **Guaranteed Human Authorship:** Because of its HAP foundation, the AI can only assist, never act on inferred goals. This eliminates the risk of "runaway AI" and ensures every project outcome is human-vetted and intentional.
-   **Persistent Project Intelligence:** Create a single source of truth for each project that grows and learns over time, reducing knowledge silos.
-   **Seamless Hybrid Work:** Bridge the gap between high-value, in-person meetings and productive, aligned asynchronous work.

For **Team Members**, Nearmydear offers:
-   **A Disciplined AI Teammate:** Delegate tasks to a trusted AI assistant that is hard-wired to ask for clarification instead of making mistakes.
-   **Forced Clarity:** The HAP process gently forces the team to achieve true alignment on meaning and purpose before execution, preventing wasted work.
-   **Focus on High-Value Work:** Automate the cognitive overhead of project management and focus on creative and strategic contributions, confident that the AI will handle the facilitation.

---

## Part 2: The Technical Whitepaper

### 1. Abstract

This whitepaper details the technical architecture of the Nearmydear platform. The architecture is designed to create a decentralized, interoperable ecosystem for AI-augmented human collaboration. The central principle of this architecture is the **Model Context Protocol (MCP)**, a standardized API that allows diverse, independent AI agents to securely interact with a shared **Project Context Host**. This document specifies the architecture of the Project Context Host and the MCP, which together enable both real-time (synchronous) and 24/7 (asynchronous) collaboration.

### 2. Core Architectural Concepts

The Nearmydear ecosystem is built on three foundational pillars:

1.  **The Project Context Host:** This is a self-contained server instance that acts as the authoritative source of truth for a single project. It hosts the project's data (transcripts, decisions, files) and exposes services (like the AI Inquiry Engine) via the MCP. It is designed to be deployed in a team's private, trusted environment. This component is the evolution of the "Local Node".

2.  **Personal AI Assistants:** These are independent AI agents that act on behalf of individual users. Each assistant is a separate client that connects to one or more Project Context Hosts. The platform is agnostic about the internal workings of an assistant, as long as it communicates via the MCP.

3.  **The Model Context Protocol (MCP):** This is the lingua franca of the Nearmydear ecosystem. It is a standardized, API-like protocol that defines how any AI assistant can securely authenticate with, query, and contribute to a Project Context Host. It is the key to interoperability and a decentralized collaboration model.

### 3. Core Architectural Principle: Human Agency Protocol (HAP) Integration

Nearmydear is not merely *integrated* with HAP; it is the protocol's reference implementation. The platform's entire facilitation and intelligence layer is designed to be HAP-compliant, ensuring that AI-driven alignment is achieved without sacrificing human authorship. This is accomplished via a deep integration of the HAP SDK.

**a) HAP-Compliant Components:**
-   **AI Inquiry Engine:** Functions as a HAP-compliant `QuestionEngine`, using `Inquiry Blueprints` to generate questions that are appropriate for a given stage of the Inquiry Ladder.
-   **Privacy-First Provider Model:** Nearmydear utilizes the SDK's `LocalHapProvider`. This is a critical architectural choice. It means all `Inquiry Blueprints` and performance metrics are stored locally on the Project Context Host. This allows the system to optimize its own question-asking over time without ever sending sensitive project context or even structural signals to an external service.

**b) Enforcing the Inquiry Ladder:**
Nearmydear uses the HAP SDK's runtime guards to enforce the protocol at two critical points in the interaction loop:

1.  **Input Validation (`StopGuard` - HAP SDK v0.2):** When a user or an AI assistant sends a message to the Project Context Host, the `StopGuard` inspects the input for ambiguity. If the input is unclear (e.g., "let's work on *it*"), the guard halts the process and uses the AI Inquiry Engine to generate a clarifying question based on a `meaning`-stage blueprint.

2.  **AI Output Validation (`StageGuard` - HAP SDK v0.3):** This is the most critical enforcement. Before the Project Context Host's AI facilitator sends a response to the team, the `StageGuard` intercepts it. It classifies the AI's response to determine which stage of the Inquiry Ladder it targets. If the AI attempts to skip a stage—for example, by jumping from `Meaning` ("Which project do you mean?") directly to `Action` ("I will execute the following plan...")—the `StageGuard` **blocks the response**. It then forces the AI to first ask the required intermediate question (e.g., "What is the purpose of this plan?"). This guarantees the AI can never race ahead of the team's alignment.

Together, MCP and HAP provide a complete framework: **MCP defines *how* agents can talk to the project, while HAP defines *what* they are allowed to say and when.**

### 4. Implementation and Workflow

**a) Project Context Host Implementation**

The Project Context Host is a full-stack application built with the following stack:
-   **Frontend & API Layers:** Next.js / React
-   **Backend & Database:** Supabase (PostgreSQL, Auth, Realtime)
-   **AI Orchestration:** LangChain.js
-   **AI Models:** OpenAI `gpt-4o-mini`, Anthropic `claude-3-sonnet-20240229`

**b) Agent Registration Workflow (The "Genesis Meeting")**

A project's security and trust model is established during its first face-to-face meeting.
1.  **Initiation:** The Project Context Host generates a temporary, project-specific passcode.
2.  **Authorization:** A team member wishing to register their Personal AI Assistant has the assistant speak the passcode.
3.  **Authentication:** The Host's audio processing service validates the spoken passcode.
4.  **Secure Handshake:** Upon successful authentication, the Host and the Assistant perform a cryptographic key exchange, establishing a secure communication channel for all future MCP interactions. This ensures that only explicitly authorized AI assistants can access the project's context.

**c) Key MCP-Exposed Services**

The Host exposes several core services to registered assistants via the MCP, including:

-   **The AI Inquiry Engine:** This powerful service, implemented in `src/lib/context-intelligence/InitialQuestionGenerator.ts`, ingests conversational text and generates contextually relevant, clarifying questions. It uses a multi-agent pipeline (a "generator" AI and a "critic" AI) to ensure high-quality output. Assistants can feed text to this service and get questions back.
-   **State Query Service:** Allows an assistant to query the current state of the project, including decisions, action items, and transcripts.
-   **State Contribution Service:** Allows an assistant to add new information to the project context, such as findings from asynchronous work.

**d) Data and Interaction Flow**

All interactions with the Project Context Host are mediated by the Model Context Protocol (MCP) and governed by the Human Agency Protocol (HAP) guards.

```
+--------------------------------+
|      Team Member / User        |
+--------------------------------+
     ^          |
     | (Delegate) | (Instruct)
     v          v
+--------------------------------+      +================================+
|    Personal AI Assistant       |----->|     Model Context Protocol     |
+--------------------------------+      |             (MCP)              |
                                        +================================+
                                                    | (API Call)
                 +----------------------------------+----------------------------------+
                 | HAP SDK: StopGuard & StageGuard (Input/Output Validation)           |
                 +----------------------------------+----------------------------------+
                                                    | (Validated Call)
                                                    v
                  +------------------------------------------------------+
                  |                Project Context Host                  |
                  |                                                      |
                  |  +---------------------+  +------------------------+ |
                  |  | Real-time Services  |  |   AI Inquiry Engine    | |
                  |  | (Transcription)     |  | (HAP-compliant)        | |
                  |  +---------------------+  +------------------------+ |
                  |                      |                               |
                  |                      v                               |
                  |  +------------------------------------------------+  |
                  |  |           Supabase Backend & Database          |  |
                  |  | (Projects, Transcripts, Decisions, Actions)    |  |
                  |  +------------------------------------------------+  |
                  +------------------------------------------------------+
```

-   **Synchronous Flow (Live Meeting):**
    1.  Audio from the meeting is transcribed by the Real-time Service.
    2.  When the AI facilitator attempts to ask a question or provide a summary, its proposed output is first validated by the **HAP `StageGuard`** to ensure it follows the Inquiry Ladder.
    3.  A team member's verbal input is checked by the **HAP `StopGuard`** for ambiguity before being processed.

-   **Asynchronous Flow (24/7):**
    1.  A user delegates a task to their Personal AI Assistant.
    2.  The assistant constructs an MCP call to the Project Context Host.
    3.  The **HAP `StopGuard`** validates the incoming call for clarity. If the request is ambiguous (e.g., refers to "the latest plan" when there are three), it is rejected, and a clarifying question is returned.
    4.  The Host processes the validated request and generates a response.
    5.  The **HAP `StageGuard`** validates the Host's response before sending it back to the assistant, ensuring it doesn't skip necessary steps.

### 5. Conclusion

The Nearmydear architecture introduces a paradigm shift in collaboration tools, moving from passive recorders to active, governed facilitators. Its core innovation lies in the powerful combination of two protocols:
1.  **The Model Context Protocol (MCP)** provides a universal language for how diverse AI agents can communicate with a shared project state.
2.  **The Human Agency Protocol (HAP)** provides the strict, enforceable rules that govern *what* these agents can say and when, guaranteeing that all interactions—and the AI itself—remain subordinate to clear, human-defined intent.

This dual-protocol model creates a decentralized, privacy-first, and truly human-centric platform where project alignment is not just encouraged; it is architecturally enforced.
