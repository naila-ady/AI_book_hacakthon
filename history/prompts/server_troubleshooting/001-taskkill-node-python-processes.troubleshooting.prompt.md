---
id: 001
title: "Terminate Node.js and Python Processes"
stage: troubleshooting
date: 2025-12-30
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: "taskkill /F /IM node.exe /IM python.exe /IM npm.exe /IM uvicorn.exe"
labels: ["server", "process", "node", "python", "troubleshooting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

# Terminate Node.js and Python Processes

## Problem
Server processes (Node.js, Python) may remain running in the background preventing new instances from starting on the same port.

## Solution
Use taskkill command to forcefully terminate specific process types:

```cmd
taskkill /F /IM node.exe /IM python.exe /IM npm.exe /IM uvicorn.exe
```

## Purpose
- `/F` - Forcefully terminates the processes
- `/IM` - Specifies the image name (executable name) to terminate
- Terminates common development server processes that might interfere with new instances

## Result
This command helps clean up lingering processes that prevent new server instances from starting properly. Often resolves issues where frontend or backend servers fail to start due to "port already in use" errors.

## Context
This was particularly useful when attempting to run both backend and frontend servers that weren't starting properly due to conflicting processes.