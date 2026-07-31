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

# Phase 10 – Character Timeline

## Objective

Add timeline tracking so each character can store important events across the story.

## Features Implemented

- Added timeline data to character profiles
- Created a Timeline tab inside `CharacterProfile.jsx`
- Allowed users to enter:
  - Chapter
  - Character age
  - Timeline event
  - Event notes
- Displayed timeline events as cards
- Added delete functionality for timeline events

## Concepts Learned

### Nested Data Structures

Timeline events are stored inside each character object. This keeps each character’s development connected to their profile.

### Nested State Updates

Updating timeline events requires mapping through novels, characters, and then updating only the selected character.

### Story Development Modeling

The timeline feature tracks how a character changes throughout the story, not just where they appear.


---

# Phase 11 – Character Portraits

## Objective

Allow users to upload portraits for each character to make profiles more visual and personalized.

## Features Implemented

- Added portrait upload to character profiles
- Displayed uploaded portraits in the profile header
- Used a default letter avatar when no portrait is uploaded
- Added the ability to remove a portrait
- Stored portrait data as part of each character object

## Concepts Learned

### File Inputs

HTML file inputs allow users to select files from their computer.

### FileReader API

The FileReader API converts uploaded image files into a Base64 string.

### Persistent Images

Because the portrait is saved inside the character object, it is also saved in LocalStorage with the rest of the app data.

---

# Phase 12 – Advanced Search, Filtering, and Sorting

## Objective

Improve character navigation by allowing users to search, filter, and sort characters inside the selected novel.

## Features Implemented

- Expanded character search across:
  - Name
  - Role
  - Age
  - Personality
  - Goal
  - Conflict
  - Notes
- Added dynamic role filtering
- Added sorting by:
  - Name from A–Z
  - Name from Z–A
  - Age from low to high
  - Age from high to low
- Added a character result count
- Added reset and clear-search controls
- Added an empty state when no characters match
- Displayed character portraits inside search results

## Concepts Learned

### Derived Data

Search results do not need to be stored separately in React state.

Instead, the displayed character list is derived from the original character data using search, filter, and sorting settings.

### Array Filtering

The `.filter()` method creates a new array containing only characters that match the search term and selected role.

### Array Sorting

The `.sort()` method organizes character results alphabetically or numerically.

A copy of the character array is created before sorting so the original React state is not modified.

### Dynamic Filter Options

The role dropdown is generated from the roles already stored in the selected novel. Duplicate and empty roles are removed using a JavaScript `Set`.

### Combined Search

Multiple character fields are combined into one searchable text value, allowing one search bar to find matches across profile information.

---

# Phase 13 – Favorite Characters

## Objective

Allow writers to mark important characters as favorites and find them more quickly.

## Features Implemented

- Added a favorite value to every character
- Added star buttons to character cards
- Allowed users to add and remove characters from favorites
- Added a Favorites First sorting option
- Added a Show Favorites Only filter
- Displayed the total number of favorite characters
- Saved favorite status using the existing LocalStorage system
- Added visual styling for favorite character cards

## Concepts Learned

### Boolean Values

Each character stores a `favorite` property with a value of either `true` or `false`.

Clicking the favorite button reverses the current Boolean value.

### Conditional Rendering

The interface displays a filled star for favorite characters and an empty star for non-favorite characters.

### Boolean Filtering

The favorite-only filter uses `.filter()` to display characters whose favorite value is `true`.

### Boolean Sorting

Boolean values can be converted into numbers when sorting:

- `true` becomes `1`
- `false` becomes `0`

This allows favorite characters to appear before non-favorite characters.

### Persistent UI State

Favorite status is stored inside each character object, so the existing LocalStorage system saves it automatically.

---

# Phase 14 – Visual Relationship Graph

## Objective

Transform stored character relationships into an interactive visual graph.

## Features Implemented

- Installed and integrated React Flow
- Created a reusable `RelationshipGraph` component
- Displayed the selected character as the central graph node
- Displayed related characters as surrounding nodes
- Connected characters using labeled relationship edges
- Added interactive node dragging
- Added zooming and panning
- Added graph navigation controls
- Added a minimap
- Updated the graph automatically when relationships are added or deleted
- Added an empty state for characters without relationships

## Concepts Learned

### Nodes and Edges

A relationship graph contains two main data types:

- Nodes represent characters
- Edges represent relationships between characters

Each node needs an id, position, and label.

Each edge needs a source node, target node, and optional relationship label.

### Data Transformation

Existing relationship objects are transformed into the node and edge format required by React Flow.

### Coordinate-Based Positioning

Related characters are positioned around the selected character using mathematical angles and x/y coordinates.

### useMemo

`useMemo` prevents graph nodes and edges from being recalculated unless the selected character data changes.

### Third-Party Libraries

React Flow provides reusable tools for building interactive node-based diagrams, including zoom controls, draggable nodes, backgrounds, and minimaps.

### Reusable Components

The relationship visualization was placed inside its own `RelationshipGraph.jsx` component so it remains separate from the profile form and can be expanded later.

---

# Phase 15 – Novel Statistics Dashboard

## Objective

Provide writers with an at-a-glance overview of the selected novel by calculating statistics from existing character data.

## Features Implemented

- Created a reusable `StatisticsPanel.jsx` component
- Displayed the total number of characters
- Counted characters marked as favorites
- Calculated the total number of relationship entries
- Counted character timeline events
- Counted chapter and scene appearance entries
- Calculated the average numeric character age
- Automatically updated the dashboard when novel data changed
- Added a responsive statistics-card layout

## Concepts Learned

### Derived Data

The statistics are calculated from the existing novel and character data instead of being stored as separate state variables.

This prevents duplicated information and ensures that dashboard values stay synchronized with the rest of the application.

### Array Aggregation

The dashboard uses JavaScript array methods to summarize character data:

- `.map()` transforms character values
- `.filter()` selects matching values
- `.reduce()` combines multiple values into one total

### Defensive Programming

Optional chaining and fallback arrays prevent the dashboard from crashing when older characters do not contain relationships, timelines, or chapter references.

### Numeric Data Validation

Character ages are converted from strings into numbers. Empty and invalid values are removed before calculating the average.

### Reusable Components

The dashboard was placed inside its own `StatisticsPanel.jsx` component so its presentation and calculations remain separate from the main application logic.

### Responsive Dashboard Design

CSS Grid and media queries allow the statistic cards to adjust from six columns on large screens to one column on small mobile screens.


--- 

# Phase 16 – Character Tags and Advanced Filtering

## Objective

Improve character organization by adding custom tags and expanding the character search and filtering system.

## Features Implemented

- Added support for multiple custom tags for every character
- Allowed tags to be entered during character creation
- Created a Tags tab inside `CharacterProfile.jsx`
- Allowed users to add new tags
- Allowed users to remove existing tags
- Prevented duplicate tags
- Displayed tags as reusable badges
- Expanded character search to include tags
- Added filtering by custom tags
- Added sorting by the number of tags
- Allowed search, filtering, and sorting to work together
- Automatically reset filters when switching novels
- Maintained compatibility with characters created before the tagging system

## Concepts Learned

### Arrays

Instead of storing a single label, each character now stores an array of tags.

Example:

```javascript
tags: [
    "Protagonist",
    "Royal Family",
    "Secret Identity"
]
```

Using an array allows each character to have multiple descriptive tags that can be searched and filtered throughout the application.

### Array Methods

Several JavaScript array methods were used to organize and search character tags.

- `.map()` transforms tag data
- `.filter()` removes unwanted values
- `.flatMap()` combines tags from multiple characters into one array
- `.some()` checks whether a matching tag already exists

These methods were also used to generate the available tag filter options automatically.

### Derived Data

The available tag filter is generated from the existing character data instead of being stored separately. This ensures that the filter always stays synchronized whenever characters or their tags are added, edited, or removed.

### Combined Filtering

Multiple filters can now be applied at the same time.

The displayed character list is filtered using:

- Search text
- Character role
- Character tags
- Favorite status

The filtered results are then sorted before being displayed.

### Keyboard Events

The Tags page allows users to press the Enter key to add a new tag.

React's `onKeyDown` event improves the user experience by allowing tags to be added without clicking the Add button.

### Defensive Programming

Characters created before Phase 16 do not contain a `tags` property.

Fallback values such as

```javascript
character.tags || []
```

allow older LocalStorage data to continue working correctly without causing application errors.

### Reusable Components

The same tag badge styling is reused throughout the application.

Tag badges appear on:

- Character cards
- Character profile header
- Tags management page

Using reusable UI components keeps the application's design consistent while reducing duplicated code.

---


# Planned Improvements

The application is structured for future expansion.

Planned features include:

- AI-assisted writing tools
- Backend API
- PostgreSQL database

---

# Phase 17 – AI Writing Assistant

## Objective

Expand the AI Tools tab into a writing assistant that uses saved character information to generate structured writing ideas and development prompts.

## Features Implemented

- Replaced the original AI Tools placeholder with a complete AI Writing Assistant interface
- Added a writing tool selector with multiple generation modes
- Added Character Summary generation
- Added Personality Analysis
- Added Character Improvement suggestions
- Added Dialogue Sample generation
- Added Story Arc generation
- Added Relationship Analysis
- Added Backstory generation
- Added Conflict generation
- Added Timeline Review
- Added optional writer instructions
- Added a simulated loading state
- Added an empty output state
- Added output status messages
- Added a Clear button
- Added a Copy button using the Clipboard API
- Cleared generated output whenever the selected character changes
- Used saved profile information, tags, relationships, and timeline events as writing context
- Expanded the application layout to better support the AI workspace

## Concepts Learned

### Reusable Functions

Each writing tool uses a separate function to generate its output.

Examples include:

```javascript
createCharacterSummary()
createPersonalityAnalysis()
createDialogueSample()
createTimelineReview()
```

Separating the logic into individual functions keeps the component easier to understand, easier to debug, and easier to extend with additional writing tools later.

### Switch Statements

A `switch` statement selects the correct generator based on the writing tool selected by the user.

Example:

```javascript
switch (selectedAiTool) {
  case "summary":
    return createCharacterSummary()

  case "dialogue":
    return createDialogueSample()

  case "timeline":
    return createTimelineReview()

  default:
    return ""
}
```

Using a switch statement keeps the generation logic organized instead of writing many nested `if` statements.

### Loading State

The `isGenerating` state controls the temporary loading interface.

While generation is active:

- Generate button becomes disabled
- Loading animation appears
- Previous output is hidden
- User receives visual feedback that generation is in progress

Although the writing assistant currently generates local responses, this structure matches how a real AI API will behave in a future phase.

### Clipboard API

The browser Clipboard API allows generated writing to be copied with one click.

Example:

```javascript
navigator.clipboard.writeText(aiOutput)
```

This makes it easy for writers to copy generated ideas directly into another writing application.

### Conditional Rendering

Different interface sections appear depending on the application's current state.

The AI panel can display:

- Empty state
- Loading state
- Generated output
- Status message
- Copy button

Conditional rendering allows one component to display different user experiences without navigating to another page.

### Defensive Programming

Character profiles may contain incomplete information.

Helper functions check whether fields such as goals, conflicts, relationships, timeline events, or tags exist before generating text.

Fallback messages are displayed whenever information is missing.

This prevents undefined values and broken output.

### State Reset

Temporary AI output is automatically cleared whenever the user selects a different character.

This prevents generated writing for one character from remaining visible after another character has been selected.

### Responsive Layout

The application layout was updated to provide more space for the new AI workspace.

The writing assistant adjusts automatically for different browser sizes while keeping both the controls and generated output readable.

## Current Limitation

The writing assistant currently produces structured local responses using saved character information.

No external AI model is being used yet.

A future phase will connect the writing assistant to a secure backend API so prompts can be sent to a real AI model such as OpenAI.