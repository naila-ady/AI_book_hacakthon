---
id: 003
title: "Check Listening Ports and Connections"
stage: troubleshooting
date: 2025-12-30
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: "netstat -ano | findstr LISTENING"
labels: ["server", "network", "port", "connection", "troubleshooting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

# Check Listening Ports and Connections

## Problem
Need to identify which processes are listening on specific ports to troubleshoot server startup issues.

## Solution
Use netstat command to display all listening ports and their associated process IDs:

```cmd
netstat -ano | findstr LISTENING
```

## Purpose
- `netstat -ano` - Shows network connections with process IDs (-o) and addresses in numerical form (-n)
- `| findstr LISTENING` - Filters to show only listening connections
- Helps identify which processes are using specific ports

## Result
This command helps identify which processes (by PID) are listening on specific ports, allowing you to target them with taskkill if needed.

## Context
This was particularly useful when attempting to run both backend and frontend servers that weren't starting properly due to conflicting port usage. Combined with the taskkill commands, this formed an effective troubleshooting sequence.