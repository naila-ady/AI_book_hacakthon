# Tasks: Physical AI and Humanoid Robotics Book with RAG Chatbot

**Feature Branch**: `1-ai-robotics-book-rag` | **Date**: 2025-12-06 | **Plan**: [specs/1-ai-robotics-book-rag/plan.md](specs/1-ai-robotics-book-rag/plan.md)

## Phase 1: Setup - Project Initialization

- [ ] T001 Create Docusaurus project `AI_huamnoid_book/`
- [ ] T002 Configure `AI_huamnoid_book/docusaurus.config.ts` for GitHub Pages deployment
- [ ] T003 Initialize `chatbot-backend/` directory
- [ ] T004 Create `chatbot-backend/requirements.txt` with initial Python dependencies (FastAPI, OpenAI SDKs, Qdrant client, Neon Postgres client)
- [ ] T005 Create base FastAPI application file `chatbot-backend/app/main.py`
- [ ] T006 Add placeholder content for `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` directory in `specs/1-ai-robotics-book-rag/`

## Phase 2: Foundational - Core Infrastructure

- [ ] T007 Set up GitHub Pages deployment workflow for `AI_huamnoid_book/` but first ask 

- [ ] T009 Configure Qdrant Cloud Free Tier connection in `chatbot-backend/app/config.py`
- [ ] T010 Implement basic health check endpoint for FastAPI in `chatbot-backend/app/main.py`
- [ ] T011 Develop utility to parse Docusaurus markdown content into a format suitable for vector embedding in `chatbot-backend/app/utils/content_parser.py`
- [ ] T012 Implement script to generate vector embeddings of book content using OpenAI embeddings API and upload to Qdrant in `chatbot-backend/app/scripts/embed_content.py`

## Phase 3: User Story 1 - Read Book Content (Priority: P1)

A reader navigates the Docusaurus-published book to learn about Physical AI and Humanoid Robotics, exploring various chapters and sections.

- [ ] T013 [US1] Create initial Docusaurus pages and sidebar structure for key book chapters in `AI_huamnoid_book/src/docs/`
- [ ] T014 [US1] Add sample book content for at least two chapters in `AI_huamnoid_book/src/docs/`
- [ ] T015 [US1] Verify Docusaurus navigation and search functionality (manual test)
- [ ] T016 [US1] Test book deployment to GitHub Pages and verify accessibility (manual test)

## Phase 4: User Story 2 - Ask Chatbot Questions (Priority: P1)

A reader asks the embedded RAG chatbot general questions about the book's content and receives accurate, contextually relevant answers.

- [ ] T017 [P] [US2] Implement API endpoint in `chatbot-backend/app/api/chatbot.py` to receive user questions.
- [ ] T018 [P] [US2] Develop RAG logic in `chatbot-backend/app/services/rag_service.py` to retrieve relevant chunks from Qdrant based on user query.
- [ ] T019 [P] [US2] Integrate OpenAI ChatKit SDK for generating chatbot responses based on retrieved context in `chatbot-backend/app/services/rag_service.py`.
- [ ] T020 [US2] Create basic Docusaurus React component for chatbot UI in `AI_huamnoid_book/src/components/Chatbot.js`.
- [ ] T021 [US2] Embed chatbot UI component into Docusaurus layout or a specific book page in `AI_huamnoid_book/src/theme/Layout.js` or `AI_huamnoid_book/src/pages/index.js`.
- [ ] T022 [US2] Implement API call from Docusaurus chatbot UI to FastAPI backend in `AI_huamnoid_book/src/components/Chatbot.js`.
- [ ] T023 [US2] Write integration tests for general chatbot queries in `chatbot-backend/tests/test_chatbot.py`.

## Phase 5: User Story 3 - Ask Chatbot with Selected Text (Priority: P1)

A reader selects a specific passage of text within the book and asks the RAG chatbot questions that are answered *only* based on the context of the selected text.

- [ ] T024 [P] [US3] Enhance content parsing utility to extract selected text with context in `chatbot-backend/app/utils/content_parser.py`.
- [ ] T025 [P] [US3] Modify RAG logic in `chatbot-backend/app/services/rag_service.py` to prioritize selected text context for answers.
- [ ] T026 [US3] Develop Docusaurus functionality to allow users to select text and send it to the chatbot (e.g., custom markdown component or JavaScript injection) in `AI_huamnoid_book/src/theme/DocItem.js` or a new component.
- [ ] T027 [US3] Update chatbot UI in `AI_huamnoid_book/src/components/Chatbot.js` to send selected text along with the query.
- [ ] T028 [US3] Write integration tests for selected text queries in `chatbot-backend/tests/test_chatbot.py`.

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T029 Implement error handling and logging for FastAPI backend in `chatbot-backend/app/main.py`.
- [ ] T030 Refine Docusaurus styling and theming in `AI_huamnoid_book/src/css/custom.css`.
- [ ] T031 Optimize Docusaurus build process for performance (if needed) in `AI_huamnoid_book/docusaurus.config.ts`.
- [ ] T032 Conduct thorough security review of chatbot backend.
- [ ] T033 Performance testing for book load times and chatbot response times.
- [ ] T034 Final review of all book content for clarity, consistency, and accuracy.

## Dependencies

- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phases 3, 4, 5.
- Phases 3, 4, 5 can be worked on in parallel once foundational tasks are done.
- Phase 6 depends on completion of Phases 3, 4, 5.

## Parallel Execution Examples

- **After Phase 2**:
    - `T013`, `T014`, `T015`, `T016` (User Story 1 - Book Content) can be developed concurrently with `T017`, `T018`, `T019`, `T020`, `T021`, `T022`, `T023` (User Story 2 - General Chatbot).
    - `T017`, `T018`, `T019` are parallelizable backend tasks.
    - `T020`, `T021`, `T022` are parallelizable Docusaurus/frontend tasks.

## Implementation Strategy

Follow an iterative approach, prioritizing User Story 1 (book content) and User Story 2 (general chatbot) as they represent core value. User Story 3 (selected text chatbot) can be developed in parallel or as a follow-up enhancement. Emphasize continuous testing and integration.
