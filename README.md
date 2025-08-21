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

## Getting Started

- `pages/` — Nuxt pages (Game List, Game Registration)
- `components/` — UI components (Table, Modals, Pagination, etc.)
- `composables/` — Reusable composition functions
- `server/api/` — Nuxt 3 API routes for games
- `services/` — Service layer for Firebase operations
- `assets/` — Styles and static assets

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start
```

## Project Architecture

### Frontend Architecture

- **Framework**: Nuxt 3 (Vue.js 3 + SSR/SSG)
- **Styling**: TailwindCSS for utility-first CSS
- **State Management**: Composables pattern with reactive state
- **Icons**: FontAwesome integration

### Backend Architecture

- **API Layer**: Nuxt 3 Server API routes (`/server/api/`)
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Admin SDK
- **Deployment**: Vercel with serverless functions

### Project Structure

```
app.vue                     # Root Vue component
nuxt.config.ts             # Nuxt 3 configuration
package.json               # Dependencies and scripts
tailwind.config.js         # TailwindCSS configuration

assets/
  css/
    tailwind.css           # Global styles and Tailwind imports

components/
  AddLanguageModal.vue     # Modal for adding new languages
  DeleteModal.vue          # Confirmation modal for deletions
  GameTable.vue           # Main table component for games
  Icon.vue                # FontAwesome icon wrapper
  Pagination.vue          # Pagination component
  SearchFilter.vue        # Search and filter controls

composables/
  useCategories.ts        # Category management composable
  useGameForm.ts          # Game form state management
  useGames.ts             # Game data fetching composable

pages/
  index.vue               # Home page (redirects to games)
  register.vue            # Game registration form
  games/
    index.vue             # Games list page
    [id].vue              # Individual game detail page

server/
  api/
    categories.ts         # Categories API endpoints
    firebase-test.ts      # Firebase connection test
    games/
      index.ts            # GET all games, POST new game
      [id].ts             # GET, PUT, DELETE specific game
      create.ts           # Game creation endpoint
      delete.ts           # Game deletion endpoint
      update.ts           # Game update endpoint
  utils/
    firebase-admin.ts     # Firebase Admin SDK setup
    languages.ts          # Language utilities

services/
  categoryServices.ts     # Category-related business logic
  gameServices.ts         # Game-related business logic

plugins/
  fontawesome.ts          # FontAwesome plugin configuration
```

