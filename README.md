# CharacterVault

CharacterVault is a React web application designed to help writers organize novels, manage detailed character profiles, track story appearances, and document character development in one place.

## Features

### Current Features

- Create, select, and delete multiple novels
- Add, edit, select, and delete characters within each novel
- Store detailed character information including:
  - Name
  - Role
  - Age
  - Personality
  - Goal
  - Conflict
  - Notes
- Search characters across multiple profile fields
- Filter characters by role
- Sort characters alphabetically or by age
- Mark important characters as favorites
- Show favorite characters only
- Sort favorite characters first
- Upload and remove character portraits
- Track where characters appear using chapter, scene, and scene-note entries
- Add and delete character relationships
- Track major character timeline events
- Organize character information using profile tabs
- Save novels, characters, portraits, relationships, timelines, and favorite status using LocalStorage
- Responsive three-panel interface built with reusable React components

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- LocalStorage
- FileReader API

## Project Structure

```text
src/
├── components/
│   ├── NovelList.jsx
│   ├── CharacterList.jsx
│   └── CharacterProfile.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Main Components

### `App.jsx`

- Stores the application's main state
- Manages novel CRUD operations
- Manages character CRUD operations
- Updates character relationships
- Updates timeline events
- Updates chapter and scene references
- Saves application data to LocalStorage

### `NovelList.jsx`

- Displays all novels
- Creates new novels
- Selects novels
- Deletes novels

### `CharacterList.jsx`

- Displays characters for the selected novel
- Creates new characters
- Deletes characters
- Searches character information
- Filters characters by role
- Sorts characters by name, age, or favorite status
- Displays character portraits
- Marks and unmarks favorite characters

### `CharacterProfile.jsx`

- Displays and edits detailed character information
- Uploads and removes character portraits
- Organizes information into Profile, Where Used, Relationships, Timeline, and AI Tools tabs
- Tracks chapter and scene appearances
- Manages character relationships
- Records character timeline events
- Includes an AI tools placeholder for future writing features

## Data Persistence

CharacterVault currently uses browser LocalStorage.

This allows novels and character data to remain available after refreshing the browser without requiring a backend database.

Character portraits are converted into Base64 strings using the FileReader API and stored directly with each character.

## Motivation

When writing long novels, it becomes difficult to remember side characters, relationships, story events, and important details introduced many chapters earlier.

CharacterVault provides writers with a central workspace for organizing this information and maintaining story consistency throughout the writing process.

## Project Status

🚧 Currently in development.

The current version includes:

- Novel management
- Character CRUD operations
- Detailed editable character profiles
- Browser persistence using LocalStorage
- Chapter and scene tracking
- Relationship mapping
- Timeline tracking
- Character portrait uploads
- Favorite characters
- Search, filtering, and sorting

## Planned Features

- Interactive relationship graph
- Story continuity checker
- Character consistency checker
- AI-powered character summaries
- AI-assisted writing tools
- Node.js + Express backend
- PostgreSQL database
- User authentication
- Cloud synchronization
- Public deployment