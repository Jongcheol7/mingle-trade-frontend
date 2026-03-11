# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MingleTrade is a cryptocurrency & stock trading platform with real-time chat, built with Next.js 15 (App Router), React 19, and TypeScript. It connects to a separate Spring Boot backend (port 8080) and a Socket.IO server (port 4000) for real-time chat.

## Commands

- **Dev server:** `npm run dev` (port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Socket server:** Run `socket-server/index.ts` separately (port 4000)

No test framework is configured.

## Architecture

### Tech Stack
- **Framework:** Next.js 15 with App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui (New York style, in `src/components/ui/`)
- **State:** Zustand (`src/store/`) — `useUserStore` (persisted to localStorage as "mingle-storage"), `useCryptoMarketStore`
- **Data Fetching:** TanStack React Query v5 + Axios (provider in `src/components/common/ReactQueryProvider.tsx`)
- **Real-time:** Socket.IO for chat, raw WebSockets for Binance/Upbit price feeds
- **Rich Text:** TipTap editor (`src/modules/common/Editor.tsx`)
- **File Storage:** AWS S3 + CloudFront CDN (`src/modules/common/FileToS3.ts`, `DeleteFromS3.ts`)

### Directory Layout
- `src/app/` — Next.js App Router pages with route groups: `(home)`, `(crypto)`, `(chat)`, `(auth)`, `(stock)`
- `src/modules/` — Feature-specific components organized by domain (auth, chat, crypto, home, stock)
- `src/hooks/` — Custom hooks, primarily React Query wrappers per feature
- `src/store/` — Zustand stores
- `src/types/` — TypeScript type definitions per domain
- `src/components/ui/` — shadcn/ui components
- `socket-server/` — Standalone Socket.IO server for chat

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

### API Pattern
All backend calls use Axios with hardcoded `http://localhost:8080/api/...` URLs and `withCredentials: true`. Response format: `{ status: "success"|"error", data, message }`. React Query hooks in `src/hooks/` wrap these calls.

### Real-time Data
- **Binance:** WebSocket at `/fstream/ws` for 24hr ticker stream
- **Upbit:** WebSocket at `wss://api.upbit.com/websocket/v1` for real-time ticker
- **Chat:** Socket.IO client hook at `src/hooks/chat/useSocket.ts`

### Key Routes
- `/crypto` — Main dashboard with real-time price sidebar (layout adds Binance/Upbit ticker)
- `/crypto/chart/[symbol]` — Individual crypto chart (Lightweight Charts)
- `/crypto/freeboard` — Community posts with TipTap rich text editor
- `/crypto/info/[symbol]` — Detailed crypto info (CoinGecko API)
- `/crypto/portfolio` — User portfolio management
- `/chat` — Real-time messaging via Socket.IO
- `/auth/mypage` — User profile (Google OAuth)

### Auth
Google OAuth 2.0. User state managed via `useUserStore` Zustand store with localStorage persistence.

### Config Notes
- `reactStrictMode: false` in next.config.ts
- Remote images allowed from `cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons`
- Environment variables in `.env` (Google OAuth, AWS, CoinGecko API key)
