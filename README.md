📘 AI Book Hackathon – Skills & Agents

A modular AI system for writing the Physical AI & Humanoid Robotics book.
Skills = reusable guidance.
Agents = autonomous helpers that draft, edit, and structure chapters.

📂 Structure
.claude/              → AI config
agent/                → writing & structure agents
skills/               → reusable writing + robotics skills
AI_humanoid_book/     → main book content

🛠️ Skills

Chapter Outline Skill: clear chapter TOC & sections.

Content Type Recognition: detects request type (chapter, summary, exercises).

Robotics Guidance Skill: guidance on sensors, control, locomotion, simulation, Physical AI.

🤖 Agents

outline-architect-agent: builds chapter structure.

chapter-drafter-agent: writes full drafts.

clarity-editor-agent: improves readability.

consistency-guardian-agent: keeps style & terminology uniform.

orchestrator_agent: coordinates all agents in the right order.

Images:
images in assets folder

🎯 Goal

Whenever you ask for content, all agents work together to generate stable, structured, and high-quality book material.
