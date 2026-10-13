# ForkLore - Master Blueprint

## Project Overview
ForkLore is a collaborative "choose your own adventure" website where readers and writers build branching, multi-path narratives together. Instead of reading a static, finished book, every story on the site is an open tree of short chapter beats that anyone can expand.

### How the Platform Works

When someone visits ForkLore, the core experience breaks down into three primary parts:

**1. Reading & The Crossroads**
* A reader picks a story (with details like summary and genre included) from the homepage shelf and starts reading short, focused story sections.
* At the end of each section, readers reach a **crossroads** displaying clickable choices submitted by other writers.
* The crossroads displays all the different directions the story can go from that point. For example, if the first section ends with a character standing before an abandoned bunker, *Option A* might lead inside, while *Option B* has them run back to their car.
* The **Official Canon Path** is highlighted visually, giving readers a clear recommended route while leaving alternate timelines accessible right beside it.
* If a branch reaches a designated conclusion, the crossroads is replaced with a stylized "THE END" banner and an option to return to home or earlier crossroads.

**2. Writing Alternate Branches**
* Aside from the ability to start a new story beginning, readers who want to steer the narrative or resolve an unfinished cliffhanger click **"Write Continuation"** at any crossroads.
* Embedded boxes collect two inputs:
  1. A **Choice Prompt** (brief sentence(s) action, dialog, or thought label that appears on the card at the crossroads).
  2. The **Chapter Content** (the narrative scene that unfolds after making that choice).
* Authors can check an optional **"Mark as an Ending"** box if their chapter intentionally concludes that storyline.
* The submission attaches itself as a new branch at that specific crossroad, ready for others to read and build on.

**3. Voting & Determining Canon**
* Every diverging path node contains upvote and downvote options.
* The branch holding the highest net score automatically earns the **Official Canon Path** badge.
* Voting is dynamic: if a new branch gains strong community support and overtakes an older one, it is promoted to the official canon path, while the previous path remains preserved and readable as an alternate timeline.

## Tech Stack & Architecture

### 1. Technology Choices

#### Frontend (Client-Side)
* **Core:** React 18 (bootstrapped with Vite)
* **Routing:** React Router v6
* **Styling:** Tailwind CSS
* **Icons:** Lucide React

#### Backend (Server-Side)
* **Runtime & Framework:** Node.js, Express
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`
* **Utilities:** `cors`, `dotenv`

#### Database (Data Tier)
* **Database:** MongoDB Atlas (M0 Free Tier)
* **ODM:** Mongoose

#### DevOps & Environment
* **Containers:** Docker, Docker Compose
* **Registry:** Docker Hub
* **Version Control:** Git, GitHub (Issues, Projects, Pull Requests)

### 2. Data Models (Mongoose Schemas)

The platform relies on four collections in MongoDB:

#### A. User
Stores authentication credentials and account metadata.
* `_id`: Unique identifier (ObjectId)
* `username`: String (unique, required)
* `email`: String (unique, required)
* `passwordHash`: String (salted `bcrypt` hash, required)
* `createdAt`: Date

#### B. Story
Represents the root wrapper for an entire branching narrative universe.
* `_id`: Unique identifier (ObjectId)
* `title`: String (required)
* `genre`: String (e.g., Sci-Fi, Fantasy, Mystery)
* `summary`: String (brief description for catalog display)
* `authorId`: ObjectId (references `User`)
* `rootNodeId`: ObjectId (references `StoryNode` for the opening section)
* `createdAt`: Date

#### C. StoryNode (The Narrative Tree)
Represents an individual narrative section or branching choice in the Directed Acyclic Graph (DAG).
* `_id`: Unique identifier (ObjectId)
* `storyId`: ObjectId (references `Story`, required)
* `parentId`: ObjectId (references parent `StoryNode`; `null` for the opening section)
* `authorId`: ObjectId (references `User`, required)
* `choicePrompt`: String (action, dialogue, or decision label shown at the preceding crossroads; empty for the opening section)
* `content`: String (the narrative text for this section, formatted in Markdown)
* `depth`: Number (distance from the root section: `1` for opening, `2` for first branches, etc.)
* `netScore`: Number (calculated as upvotes minus downvotes; default `0`)
* `isCanon`: Boolean (default `false`; dynamically assigned to the top-scoring sibling path)
* `isEnding`: Boolean (default `false`; if `true`, marks this branch as a conclusion with no further crossroads)
* `createdAt`: Date

#### D. Vote
Acts as an atomic ledger ensuring one vote per user per story branch.
* `_id`: Unique identifier (ObjectId)
* `userId`: ObjectId (references `User`, required)
* `nodeId`: ObjectId (references `StoryNode`, required)
* `value`: Number (`+1` for upvote, `-1` for downvote, `0` for unvote/neutral)
* *Index Constraint:* Unique compound index on `{ userId: 1, nodeId: 1 }` to prevent duplicate votes.

### 3. Core API Endpoints

These endpoints define the contract between the React frontend and the Express backend:

#### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new account (`username`, `email`, `password`).
* `POST /api/auth/login` — Authenticate credentials and return a signed JWT.
* `GET /api/auth/me` — Verify session token and return the current user's profile.

#### Stories (`/api/stories`)
* `GET /api/stories` — Fetch public story catalog for the homepage shelf (supports filtering by genre).
* `GET /api/stories/:id` — Fetch top-level story metadata and its `rootNodeId` to start reading.
* `POST /api/stories` — Protected (JWT required). Create a new story universe and its opening section simultaneously.

#### Story Nodes & Crossroads (`/api/nodes`)
* `GET /api/nodes/:id` — Fetch the active story section's content along with all immediate child choices (`parentId === id`) sorted by `netScore` descending.
* `POST /api/nodes` — Protected (JWT required). Submit a new continuation branch attached to a specified `parentId`.
* `POST /api/nodes/:id/vote` — Protected (JWT required). Cast, toggle, or undo an upvote/downvote (`+1`, `-1`, or `0`) and recalculate the node's `netScore`.

## Team Division & Vertical Feature Tracks

### Track A: Core Story Engine & Reader Experience
* **Owner:** Nanzib I. Chowdhury
* **Focus:** Narrative tree mechanics, data relationships, and the primary reading interface.

* **Backend:**
  * Core Mongoose schema design and database indexing.
  * Tree traversal queries to retrieve active sections and their immediate child branches.
  * Canon calculation logic to dynamically determine and flag the highest-scoring paths.
* **Frontend:**
  * Reader interface optimized for distraction-free reading and mobile typography.
  * Dynamic crossroads component displaying branching choice cards.
  * Visual distinction for the canon path versus alternate community timelines.
  * Breadcrumb navigation to track reading progress back through parent nodes.

### Track B: Authoring Suite & Story Discovery
* **Owner:** [Carlos Aguilar]
* **Focus:** Story initialization, narrative expansion, and content categorization.

* **Backend:**
  * Story initialization endpoint (`POST /api/stories`) creating root metadata and the opening section.
  * Section continuation endpoint (`POST /api/nodes`) validating parent-child links and handling the `isEnding` status.
  * Story catalog querying and genre filtering logic.
* **Frontend:**
  * Homepage "Story Shelf" displaying narrative universes with summaries and genres.
  * Responsive Markdown authoring suite with live formatting preview.
  * Branch submission interface for drafting continuation choices at any crossroads.
  * Form controls for setting choice prompts and flagging story endings.

### Track C: Identity, Consensus & Voting
* **Owner:** [Name / GitHub]
* **Focus:** User authentication, session security, and the community voting ledger.

* **Backend:**
  * User registration and login endpoints utilizing `bcrypt` password hashing and JWT issuance.
  * Authentication middleware protecting authoring and voting endpoints.
  * Atomic voting endpoint (`POST /api/nodes/:id/vote`) recalculating net scores.
  * Vote ledger logic enforcing the one-vote-per-user constraint on every branch.
* **Frontend:**
  * Authentication modals or views (Login, Sign Up) and global authentication context.
  * Upvote and downvote interactive controls with optimistic UI updates.
  * User profile view displaying submitted story contributions and earned vote scores.
  * Session-aware UI states (e.g., disabling voting/submitting for unauthenticated guests).

## Development Milestones & Timeline

### Phase 1: Client Shell & Interface Design
* **Week 6:**
  * Initialize React project with Vite, Tailwind CSS, and React Router.
  * Establish base design tokens (typography, color scheme, responsive spacing).
* **Week 7:**
  * Map core user journeys (Shelf → Reader → Crossroads → Branch Creation).
  * Build wireframes and screen layouts for desktop and mobile views.
* **Week 8:**
  * Build and finalize the interactive UI prototype in Figma.
  * Validate user navigation and crossroads card interactions.

### Phase 2: Frontend Components & Server Scaffolding
* **Week 9:**
  * Implement core React components using local mock data:
    * Track A: `<Reader />` view and `<Crossroads />` cards.
    * Track B: `<StoryShelf />` catalog and `<MarkdownEditor />`.
    * Track C: `<AuthModal />` forms and `<VoteControls />`.
* **Week 10:**
  * Initialize Node.js and Express server with CORS and environment configuration.
  * Scaffold base route structures (`/api/auth`, `/api/stories`, `/api/nodes`).
* **Week 11:**
  * Complete Express REST controllers and middleware using temporary in-memory data.
  * Test and verify all endpoints via Postman or HTTP client.

### Phase 3: Database Persistence & Full-Stack Integration
* **Week 12:**
  * Set up MongoDB Atlas cluster and connect Mongoose ODM to Express.
  * Implement schemas (`User`, `Story`, `StoryNode`, `Vote`) and indexes.
  * Replace in-memory mock controllers with live MongoDB queries.
* **Week 13:**
  * Connect React frontend to live Express/MongoDB endpoints.
  * Implement dynamic canon calculation logic and vote score updates.
  * Wire the authoring suite directly to parent node attachments.

### Phase 4: Containerization, Testing & Final Steps
* **Week 14 (Feature Complete Target):**
  * Configure `Dockerfile` for client and server, plus root `docker-compose.yml`.
  * Complete end-to-end testing across all three tracks (auth, creation, reading, voting).
  * Responsive UI audit on mobile, tablet, and desktop viewports.
* **Week 15:**
  * Build, tag, and publish production container images to Docker Hub.
  * Rehearse live demonstration for final presentation.

## Engineering Standards

### 1. Branch Management
* The `main` branch contains only stable, deployable code. Direct commits to `main` are disabled.
* All development occurs on feature branches branched from `main`, structured by track and task:
  * `feat/track-a-reader-view`
  * `feat/track-b-editor-form`
  * `feat/track-c-auth-jwt`
  * `fix/node-traversal-query`

### 2. Commit Traceability & Issue Linking
* Every feature, enhancement, or fix must correspond to an active ticket on the repository's GitHub Issues board.
* Commit messages follow the Conventional Commits format and reference the issue ticket number:
  * `feat: implement StoryNode schema and compound index refs #3`
  * `fix: correct parent traversal query sort order refs #8`
  * `docs: update endpoint payload specifications refs #1`

### 3. Pull Requests & Code Review
* Merging into `main` requires an approved Pull Request (PR).
* PR descriptions must include a summary of changes, manual testing steps verified, and the linked issue (`Closes #3`).
* Ideally a teammate should review and approve the PR before merging.
* Pull requests must use **Squash and Merge** or **Rebase and Merge** to keep the `main` branch commit history clean and linear.
