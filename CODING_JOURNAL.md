# CharacterVault Coding Journal

## Project Goal

CharacterVault is a React web application designed to help writers organize novels, characters, relationships, and story development in one place.

Long novels often become difficult to manage because it is easy to forget:

- Who a side character is
- Which chapter they last appeared in
- Their relationships with other characters
- Their goals, conflicts, and secrets
- Important story notes

The goal of CharacterVault is to create a central place where writers can manage all of this information.

---

# Phase 1 – Project Setup

## Objective

Create a React project and understand the overall project structure.

## Tools

- React
- Vite
- JavaScript
- VS Code
- Node.js
- npm

## Commands Used

```bash
npm create vite@latest charactervault -- --template react
cd charactervault
npm install
npm run dev
```

## What I Learned

### React

React is a JavaScript library for building user interfaces.

Instead of writing an entire webpage manually, React allows developers to split the application into reusable components.

Examples of future components:

- Novel List
- Character List
- Character Profile

---

### Vite

Vite is the development tool used to create and run React applications.

Responsibilities:

- Creates the project
- Runs the local development server
- Automatically refreshes the browser whenever code changes

---

### Node.js

Node.js allows JavaScript to run outside the browser.

Without Node.js, React projects cannot be built or executed locally.

---

### npm

npm (Node Package Manager) downloads libraries required by the project.

Running

```bash
npm install
```

downloads every dependency listed inside `package.json`.

---

### Local Development Server

Running

```bash
npm run dev
```

starts a development server.

The application becomes available at

```
http://localhost:5173
```

Only the local computer can access this website.

---

## Project Structure

```
src/
    App.jsx
    App.css
    main.jsx
    components/

public/

package.json
vite.config.js
README.md
```

### App.jsx

Contains the application's logic.

### App.css

Contains styling.

### main.jsx

Renders the React application.

---

# Phase 2 – React Fundamentals

## Objective

Display novels dynamically instead of hardcoding HTML.

## Concepts Learned

### Arrays

Instead of writing multiple HTML elements manually, novels are stored inside an array.

Example:

```javascript
const novels = [
    { id: 1, title: "Royally Chosen" },
    { id: 2, title: "Draven's Dilemma" }
]
```

Arrays make it easy to add, remove, or edit data.

---

### map()

React's `.map()` function loops through every object inside an array and returns JSX.

Example:

```javascript
novels.map(novel => (
    <button>{novel.title}</button>
))
```

Benefits:

- Less repeated code
- Automatically updates when the array changes
- Makes lists dynamic

---

### React Keys

Every item rendered using `.map()` needs a unique `key`.

React uses keys to efficiently update the page.

---

### useState()

`useState()` stores data that changes while the application is running.

Examples in CharacterVault:

- Novel list
- Selected novel
- Character name
- Search input
- Notes

Whenever state changes, React automatically updates the interface.

---

# Phase 3 – Novel Management

## Objective

Allow users to manage multiple novels.

## Features Implemented

- Create novel
- Delete novel
- Select novel
- Highlight selected novel

## Concepts Learned

### Props

Information can be passed from one component to another using props.

Example:

```
App.jsx
      ↓
NovelList.jsx
```

The parent component owns the data while child components display and interact with it.

---

### Component Architecture

Instead of placing every feature inside one file, the application was divided into reusable components.

Current structure:

```
App
│
├── NovelList
├── CharacterList
└── CharacterProfile
```

Benefits:

- Cleaner code
- Easier maintenance
- Easier future expansion

---

# Phase 4 – Character Management

## Objective

Create and manage detailed character profiles for each novel.

## Features Implemented

- Add character
- Delete character
- Select character
- Search characters
- Edit character information

Character fields currently include:

- Name
- Role
- Age
- Personality
- Goal
- Conflict
- Notes
- Chapter and scene references ("Where Used")

## Concepts Learned

### Controlled Inputs

Every input field is connected directly to React state.

Whenever the user types, the state updates automatically.

---

### Component Communication

CharacterList sends newly created characters back to App using callback functions.

App updates the application's state and passes the updated data back down to the components.

---

# Phase 5 – Persistent Storage

## Objective

Prevent data loss after refreshing the browser.

## Features Implemented

- Save novels and their associated characters
- Load saved data automatically after refreshing the browser

## Concepts Learned

### LocalStorage

CharacterVault stores application data inside the browser using LocalStorage.

Benefits:

- No database required
- Data persists after refresh
- Simple persistence during development

---

### useEffect()

`useEffect()` watches the novels state.

Whenever novels change:

- LocalStorage is updated automatically.

---

# Phase 6 – Story Development

## Objective

Track where characters appear throughout a novel.

## Features Implemented

- Chapter tracking
- Scene tracking
- Scene notes
- Delete scene entries

Each character stores a list of story appearances.

Example:

```
Chapter 12

Scene:
Library confrontation

Notes:
Revealed the hidden letter.
```

---

# Phase 7 – Current Architecture

Current component structure:

```
App
│
├── NovelList
├── CharacterList
└── CharacterProfile
```

Responsibilities:

**App**
- Stores application state
- Saves LocalStorage
- Handles CRUD operations

**NovelList**
- Displays novels
- Adds novels
- Deletes novels

**CharacterList**
- Displays characters
- Searches characters
- Adds characters
- Deletes characters

**CharacterProfile**
- Displays and edits character information
- Manages character notes
- Tracks chapter and scene appearances
- Stores story development details

---

# Phase 8 – UI Refinement and Profile Tabs

## Objective

Improve the CharacterVault interface by organizing the character profile into separate tabs.

## Features Implemented

- Added profile tabs inside `CharacterProfile.jsx`
- Separated character information into:
  - Profile
  - Where Used
  - Relationships
  - Timeline
  - AI Tools
- Moved scene/chapter tracking into its own tab
- Added placeholder sections for future relationship mapping, timelines, and AI-assisted writing tools
- Improved profile layout with a character avatar and section cards

## Concepts Learned

### Conditional Rendering

React can show different sections depending on the current state.

In this phase, `activeTab` controls which section appears on the screen.

### UI Organization

Instead of displaying every field in one long page, tabs make the interface easier to use and prepare the app for future expansion.

---

# Phase 9 – Relationship Mapping

## Objective

Add basic relationship tracking so each character can store connections to other characters.

## Features Implemented

- Added relationship data to character profiles
- Created a relationship form inside the Relationships tab
- Allowed users to enter:
  - Related character name
  - Relationship type
  - Relationship notes
- Displayed relationships as cards
- Added delete functionality for relationship entries

## Concepts Learned

### Nested State Updates

Relationships are stored inside each character object, so updating them requires mapping through novels, then characters, then updating the selected character.

### Data Modeling

Each relationship is stored as an object with an id, related character name, type, and notes.

--- 

# Planned Improvements

The application is structured for future expansion.

Planned features include:

- Character timeline
- Character portraits
- Favorite characters
- AI-assisted writing tools
- Backend API
- PostgreSQL database
- Advanced search and filtering
