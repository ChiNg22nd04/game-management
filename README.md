# Game Management

## Overview

A web application for managing games, built with Nuxt 3 and TailwindCSS. The project supports listing, searching, filtering, registering, and deleting games, with data stored in Firebase. Bun is used as the package manager, and ESLint ensures code quality. The app is deployed on Vercel.

## Features

- **Game List Page**
    - View all games in a paginated table
    - Search and filter games by category and keyword
    - Multi-select and bulk delete games
    - Register new games via a dedicated button
- **Game Registration Page**
    - Add new games to the database
- **API**
    - Built with Nuxt 3 server API routes
    - CRUD operations for games
- **Database**
    - Uses Firebase for data storage
- **UI/UX**
    - Styled with TailwindCSS

## Tech Stack

- [Nuxt 3](https://nuxt.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Bun](https://bun.sh/) (package manager)
- [ESLint](https://eslint.org/) (code formatting)
- [Vercel](https://vercel.com/) (deployment)

## Project Structure

- `pages/` — Nuxt pages (Game List, Game Registration)
- `components/` — UI components (Table, Modals, Pagination, etc.)
- `composables/` — Reusable composition functions
- `server/api/` — Nuxt 2 API routes for games
- `services/` — Service layer for Firebase operations
- `assets/` — Styles and static assets
