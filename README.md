# Pokemon Search

Class-based React application built with Vite and TypeScript.

The project uses the [PokeAPI](https://pokeapi.co/) to load Pokemon species data and display readable search results with names and descriptions. The interface is styled in a bold brutalist direction with shared global design tokens for colors, borders, spacing, and surface treatment.

## Stack

- React 19
- TypeScript
- Vite
- ESLint

## Design Approach

The UI uses a small set of brutalist design tokens defined in [src/index.css](./src/index.css):

- `--bg` and `--surface` for the warm paper-like background and card surfaces
- `--text` and `--muted` for strong foreground contrast and secondary copy
- `--border` for hard-edged framing
- `--accent` and `--accent-soft` for the loud orange/yellow interactive palette

These tokens are reused across the header, search section, results section, loader, error state, and fallback UI so the app keeps one consistent visual language.

## Data Source

The app uses the `pokemon-species` endpoints from PokeAPI:

- list requests for the first page of available items
- exact species requests for a specific search term

This endpoint was chosen because the task requires both:

- item name
- item description

The species resource includes flavor text entries that can be mapped into readable descriptions.

## Implemented Features

### 1. Application Layout Structure

The page is split into two clearly separated main sections:

- a smaller search area at the top
- a larger results area below

### 2. Search Functionality with Local Storage

The search input restores the previously saved term from local storage when the app loads.

### 3. Search Results Display

Results are rendered in a structured list with:

- Pokemon name
- Pokemon description

### 4. Initial Data Load

On startup, the app requests:

- the first page of Pokemon when the input is empty
- the matching Pokemon when a saved search term exists

### 5. Search Execution

Submitting the search form:

- trims whitespace
- avoids duplicate requests when the submitted term did not change
- fetches the first result set for the new term

### 6. Search Term Persistence

Changed search terms are saved back to local storage after submission.

### 7. Loading State Indication

The results area shows a centered loader while API requests are in progress.

### 8. Error Handling

Failed requests are converted into human-readable messages and displayed in the results area without uncaught runtime noise.

### 9. Application Error Boundary

The app is wrapped in a class-based error boundary with:

- console logging through `componentDidCatch`
- a fallback UI
- a test button to trigger an application error
- a reset button to remove the triggered error state

## Scripts

- `npm run dev` — start the development server
- `npm run build` — run TypeScript build and create a production bundle
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build
