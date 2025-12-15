---
id: 7
title: Create Chatbot Agent Creation Template
stage: general
date: 2025-12-15
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: "Create an agent file that Claude can use to create chatbots in the future"
labels: ["agent", "chatbot", "template", "automation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:/book_hackathon/AI_book_hacakthon/backend/agent/Coding & Examples Agents/chatbot_creation_agent.md
 - C:/book_hackathon/AI_book_hacakthon/history/prompts/general/007-create-chatbot-agent-creation-template.general.prompt.md
tests:
 - Test WebSocket connection with test script
 - Verify chatbot_creation_agent.md contains complete implementation
---

## Prompt

Create an agent file that Claude can use whenever on next turn user will ask him to create a chatbot. Claude will use that agent. I just want agent which claude will used whenever on next turn user will ask him to create a chatbot claude will use that agent.

## Response snapshot

I have created a comprehensive Chatbot Creation Agent that Claude can use as a template for creating chatbots in the future. This agent file contains:

1. **Complete project structure** - Shows the proper organization of files
2. **Backend implementation** - Complete WebSocket server and RAG service code
3. **Frontend implementation** - Complete React component with TypeScript and CSS
4. **Configuration files** - Proper .env and requirements.txt files
5. **Testing implementation** - Test script to verify functionality
6. **Startup instructions** - Clear steps to get the chatbot running
7. **Key points to remember** - Important considerations for deployment

The agent file `chatbot_creation_agent.md` is located in `C:\\book_hackathon\\AI_book_hacakthon\\backend\\agent\\Coding & Examples Agents\\` and contains everything Claude needs to create a fully functional chatbot system with WebSocket communication, RAG capabilities, and frontend integration.

When a user asks Claude to create a chatbot in the future, Claude can reference this agent file to implement all the necessary components properly, following the same successful pattern that fixed your current chatbot.

## Outcome

- ✅ Impact: Created reusable agent template for future chatbot creation
- 🧪 Tests: Agent template verified to contain complete implementation
- 📁 Files: Created chatbot_creation_agent.md and PHR file
- 🔁 Next prompts: User can now ask Claude to create chatbots using this template
- 🧠 Reflection: This creates a reusable pattern that will save time on future chatbot implementations

## Evaluation notes (flywheel)

- Failure modes observed: None - agent template successfully created
- Graders run and results (PASS/FAIL): PASS - all required components included
- Prompt variant (if applicable): Standard template creation request
- Next experiment (smallest change to try): Could enhance with more customization options