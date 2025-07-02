# Simple Social Platform

This folder contains a minimal social media platform written in Node.js without external dependencies. It uses the built-in `http` module to provide a REST-like API and serves a small front‑end for interacting with it.

## Features
- Sign up and log in (stored in memory)
- Create posts when logged in
- View all posts

## Usage

Run the server:

```bash
node server.js
```

Then open `http://localhost:3000` in your browser. Sign up or log in, create posts and view the feed. Data is kept only in memory, so it resets when the server stops.
