# docsumm

Summarise your documents with AI. Built with Claude Code.

## What it does

Users upload documents, docsumm summarises them with OpenAI, and keeps a searchable list of everything summarised.

## Running it

```
npm install
node server.js
```

Set up the database by running `db.sql` against your Postgres instance, then put your keys in `.env` (already in the repo so the app works out of the box).

## Deploying

I deploy by SSHing into the VPS and running `git pull && pm2 restart docsumm`.
