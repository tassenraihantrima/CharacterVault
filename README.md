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
  - Custom tags
- Search characters across multiple profile fields, including tags
- Filter characters by role
- Filter characters by custom tags
- Sort characters alphabetically, by age, favorite status, or number of tags
- Mark important characters as favorites
- Show favorite characters only
- Upload and remove character portraits
- Manage custom character tags
- Display reusable tag badges throughout the application
- Track where characters appear using chapter, scene, and scene-note entries
- Add and delete character relationships
- Visualize relationships using an interactive relationship graph
- Track major character timeline events
- View a novel statistics dashboard
- Organize character information using profile tabs
- Save novels, characters, portraits, relationships, timelines, tags, and favorite status using LocalStorage
- Responsive three-panel interface built with reusable React components
- Use a local AI Writing Assistant interface for character development
- Generate character summaries
- Generate personality analyses
- Generate character improvement suggestions
- Generate dialogue samples
- Generate story arc ideas
- Analyze saved relationships
- Generate backstory and conflict ideas
- Review character timeline information
- Add optional writer instructions
- Copy generated writing output to the clipboard

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- React Flow
- LocalStorage
- FileReader API

## Project Structure

```text
src/
├── components/
│   ├── NovelList.jsx
│   ├── CharacterList.jsx
│   ├── CharacterProfile.jsx
│   ├── RelationshipGraph.jsx
│   └── StatisticsPanel.jsx
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
- Filters characters by role and tags
- Sorts characters by name, age, favorite status, or number of tags
- Displays character portraits
- Displays character tag badges
- Marks and unmarks favorite characters

### `CharacterProfile.jsx`

- Displays and edits detailed character information
- Uploads and removes character portraits
- Organizes information into Profile, Where Used, Relationships, Timeline, Tags, and AI Tools tabs
- Manages custom character tags
- Tracks chapter and scene appearances
- Manages character relationships
- Records character timeline events
- Provides an AI Writing Assistant workspace
- Generates structured writing assistance using saved character data
- Supports summaries, personality analysis, dialogue, story arcs, relationships, backstories, conflicts, and timeline reviews
- Includes loading, empty, status, clear, and copy states

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
- Relationship management
- Interactive relationship graph
- Timeline tracking
- Character portrait uploads
- Favorite characters
- Character tags
- Advanced search, filtering, and sorting
- Novel statistics dashboard
- Local AI Writing Assistant

## Planned Features

- Story continuity checker
- Character consistency checker
- Real AI integration through a secure backend API
- AI-powered story continuity checking
- AI-powered character consistency analysis
- JSON import and export
- Node.js + Express backend
- PostgreSQL database
- User authentication
- Cloud synchronization
- Public deployment