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
- Upload and remove novel covers
- Store novel genres and synopses
- Track writing status
- Track current and target word counts
- View automatic writing-progress percentages
- Export one novel as a JSON backup
- Export the complete CharacterVault workspace
- Import previously exported JSON backups
- Validate imported CharacterVault data
- Use an AI-powered Writing Assistant through a secure Express backend
- Generate context-aware character summaries and analyses
- Generate AI-assisted dialogue, story arcs, backstories, and conflicts
- Analyze relationships and character timelines using saved story data
- Send optional writer instructions with AI generation requests
- Display loading, success, and error states for AI requests

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- React Flow
- LocalStorage
- FileReader API
- Blob API
- JSON
- Node.js
- Express
- OpenAI API
- OpenAI JavaScript SDK
- REST API
- CORS
- dotenv

## Project Structure

```text
charactervault/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   └── aiRoutes.js
│   │   ├── services/
│   │   │   └── openaiService.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── src/
│   ├── components/
│   ├── services/
│   │   └── aiApi.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── package.json
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

### `NovelTools.jsx`

- Manages novel covers and project metadata
- Updates genres, synopses, and writing status
- Tracks current and target word counts
- Calculates writing progress
- Exports selected novels as JSON
- Exports the complete workspace as JSON
- Imports and validates CharacterVault backups

### Backend

- Provides a health-check endpoint
- Validates AI generation requests
- Builds context-aware prompts from character data
- Calls the OpenAI Responses API
- Keeps API credentials outside the browser
- Handles authentication, rate-limit, and server errors

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
- Novel settings and writing progress
- JSON import and export
- Express backend
- REST API integration
- Real AI-powered writing assistance
- Secure server-side API key handling

## Planned Features

- Story continuity checker
- Character consistency checker
- AI-powered story continuity checking
- AI-powered character consistency analysis
- PostgreSQL database
- User authentication
- Cloud synchronization
- Public deployment