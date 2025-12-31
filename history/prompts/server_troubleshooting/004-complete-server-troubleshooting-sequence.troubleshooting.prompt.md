---
id: 004
title: "Complete Server Troubleshooting Command Sequence"
stage: troubleshooting
date: 2025-12-30
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: "Complete server troubleshooting sequence"
labels: ["server", "process", "network", "troubleshooting", "sequence"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

# Complete Server Troubleshooting Command Sequence

## Problem
Backend and frontend servers fail to start due to conflicting processes or port conflicts.

## Solution
Execute the following sequence of commands to clean up and diagnose server issues:

```cmd
taskkill /F /IM node.exe /IM python.exe /IM npm.exe /IM uvicorn.exe
taskkill /F /IM WindowsTerminal.exe /IM cmd.exe /IM powershell.exe
netstat -ano | findstr LISTENING
```

## Purpose
1. First command: Terminate Node.js, Python, npm, and uvicorn processes that may be holding ports
2. Second command: Terminate terminal processes that might be holding resources
3. Third command: Check which processes are listening on ports to verify cleanup

## Result
This sequence helps resolve server startup issues by clearing conflicting processes and allowing fresh server instances to start properly.

## Context
This command sequence proved effective when both backend and frontend servers were not starting properly. The combination of process termination and port checking helped resolve the issue.