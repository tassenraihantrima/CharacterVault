import { useState } from 'react'

function CharacterList({
  selectedNovel,
  selectedCharacterId,
  onSelectCharacter,
  onAddCharacter,
  onDeleteCharacter
}) {
  // Stores what the user types into the search bar
  const [search, setSearch] = useState('')

  // Stores the selected role filter
  const [roleFilter, setRoleFilter] = useState('all')

  // Stores the selected sorting method
  const [sortOption, setSortOption] = useState('default')

  // Character creation form inputs
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [age, setAge] = useState('')
  const [personality, setPersonality] = useState('')
  const [goal, setGoal] = useState('')
  const [conflict, setConflict] = useState('')
  const [notes, setNotes] = useState('')

  // If no novel is selected, show an empty message
  if (!selectedNovel) {
    return (
      <section className="panel characterPanel">
        <h2>Characters</h2>
        <p className="emptyText">
          Select a novel before creating or searching for characters.
        </p>
      </section>
    )
  }

  // Adds a character to the selected novel
  function handleAddCharacter() {
    // Character name is required
    if (!name.trim()) return

    // Send the character information back to App.jsx
    onAddCharacter({
      name: name.trim(),
      role: role.trim(),
      age: age.trim(),
      personality: personality.trim(),
      goal: goal.trim(),
      conflict: conflict.trim(),
      notes: notes.trim()
    })

    // Clear the form after adding the character
    setName('')
    setRole('')
    setAge('')
    setPersonality('')
    setGoal('')
    setConflict('')
    setNotes('')
  }

  // Clears all search, filter, and sorting settings
  function resetFilters() {
    setSearch('')
    setRoleFilter('all')
    setSortOption('default')
  }

  /*
    Create a list of unique roles from the selected novel.
    Example:
    ["Protagonist", "Antagonist", "Supporting Character"]
  */
  const availableRoles = [
    ...new Set(
      selectedNovel.characters
        .map(character => character.role?.trim())
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b))

  /*
    Step 1: Search characters.
    This search checks:
    - Name
    - Role
    - Age
    - Personality
    - Goal
    - Conflict
    - Notes
  */
  let displayedCharacters = selectedNovel.characters.filter(character => {
    const searchableText = `
      ${character.name || ''}
      ${character.role || ''}
      ${character.age || ''}
      ${character.personality || ''}
      ${character.goal || ''}
      ${character.conflict || ''}
      ${character.notes || ''}
    `.toLowerCase()

    return searchableText.includes(search.trim().toLowerCase())
  })

  /*
    Step 2: Filter by role.
    When "All roles" is selected, every role is shown.
  */
  if (roleFilter !== 'all') {
    displayedCharacters = displayedCharacters.filter(
      character => character.role === roleFilter
    )
  }

  /*
    Step 3: Sort the filtered characters.
    A copied array is sorted so the original React state is not changed.
  */
  if (sortOption === 'name-az') {
    displayedCharacters = [...displayedCharacters].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    )
  }

  if (sortOption === 'name-za') {
    displayedCharacters = [...displayedCharacters].sort((a, b) =>
      (b.name || '').localeCompare(a.name || '')
    )
  }

  if (sortOption === 'age-low-high') {
    displayedCharacters = [...displayedCharacters].sort((a, b) => {
      // Empty or invalid ages are placed at the end
      const ageA = Number(a.age)
      const ageB = Number(b.age)

      const validAgeA = Number.isFinite(ageA) && a.age !== ''
        ? ageA
        : Number.MAX_SAFE_INTEGER

      const validAgeB = Number.isFinite(ageB) && b.age !== ''
        ? ageB
        : Number.MAX_SAFE_INTEGER

      return validAgeA - validAgeB
    })
  }

  if (sortOption === 'age-high-low') {
    displayedCharacters = [...displayedCharacters].sort((a, b) => {
      const ageA = Number(a.age)
      const ageB = Number(b.age)

      const validAgeA = Number.isFinite(ageA) && a.age !== ''
        ? ageA
        : -1

      const validAgeB = Number.isFinite(ageB) && b.age !== ''
        ? ageB
        : -1

      return validAgeB - validAgeA
    })
  }

  return (
    <section className="panel characterPanel">
      {/* Selected novel information */}
      <div className="characterPanelHeader">
        <div>
          <h2>Characters</h2>
          <p className="panelSubtitle">{selectedNovel.title}</p>
        </div>

        <span className="characterCount">
          {selectedNovel.characters.length}
        </span>
      </div>

      {/* Character search */}
      <div className="searchSection">
        <label htmlFor="characterSearch">Search Characters</label>

        <input
          id="characterSearch"
          type="text"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search name, role, goal, conflict, notes..."
        />
      </div>

      {/* Filtering and sorting controls */}
      <div className="filterGrid">
        <div>
          <label htmlFor="roleFilter">Filter by Role</label>

          <select
            id="roleFilter"
            value={roleFilter}
            onChange={event => setRoleFilter(event.target.value)}
          >
            <option value="all">All roles</option>

            {availableRoles.map(characterRole => (
              <option key={characterRole} value={characterRole}>
                {characterRole}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortCharacters">Sort Characters</label>

          <select
            id="sortCharacters"
            value={sortOption}
            onChange={event => setSortOption(event.target.value)}
          >
            <option value="default">Default order</option>
            <option value="name-az">Name: A–Z</option>
            <option value="name-za">Name: Z–A</option>
            <option value="age-low-high">Age: Low to High</option>
            <option value="age-high-low">Age: High to Low</option>
          </select>
        </div>
      </div>

      {/* Search result count and reset button */}
      <div className="searchSummary">
        <span>
          {displayedCharacters.length}{' '}
          {displayedCharacters.length === 1 ? 'character' : 'characters'} found
        </span>

        <button
          type="button"
          className="secondaryButton"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>

      {/* Character creation form */}
      <div className="addCharacterSection">
        <h3>Add Character</h3>

        <div className="formGrid">
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Name"
          />

          <input
            type="text"
            value={role}
            onChange={event => setRole(event.target.value)}
            placeholder="Role"
          />

          <input
            type="text"
            value={age}
            onChange={event => setAge(event.target.value)}
            placeholder="Age"
          />

          <input
            type="text"
            value={personality}
            onChange={event => setPersonality(event.target.value)}
            placeholder="Personality"
          />

          <input
            type="text"
            value={goal}
            onChange={event => setGoal(event.target.value)}
            placeholder="Goal"
          />

          <input
            type="text"
            value={conflict}
            onChange={event => setConflict(event.target.value)}
            placeholder="Conflict"
          />
        </div>

        <textarea
          value={notes}
          onChange={event => setNotes(event.target.value)}
          placeholder="Character notes"
        />

        <button
          type="button"
          className="primaryButton"
          onClick={handleAddCharacter}
        >
          Add Character
        </button>
      </div>

      {/* Display filtered and sorted character results */}
      <div className="characterCards">
        {displayedCharacters.length === 0 ? (
          <div className="noResults">
            <p>No matching characters found.</p>

            <button
              type="button"
              className="secondaryButton"
              onClick={resetFilters}
            >
              Clear Search
            </button>
          </div>
        ) : (
          displayedCharacters.map(character => (
            <div
              key={character.id}
              className={
                character.id === selectedCharacterId
                  ? 'characterCard selectedCard'
                  : 'characterCard'
              }
            >
              {/* Clicking this area selects the character */}
              <button
                type="button"
                className="characterMain"
                onClick={() => onSelectCharacter(character.id)}
              >
                {/* Show portrait or default letter avatar */}
                {character.portrait ? (
                  <img
                    src={character.portrait}
                    alt={`${character.name} portrait`}
                    className="characterListPortrait"
                  />
                ) : (
                  <div className="avatar">
                    {character.name
                      ? character.name[0].toUpperCase()
                      : '?'}
                  </div>
                )}

                <div className="characterCardDetails">
                  <h4>{character.name || 'Unnamed Character'}</h4>

                  <p>{character.role || 'No role assigned'}</p>

                  <small>
                    {character.age
                      ? `Age ${character.age}`
                      : 'Age not added'}
                  </small>
                </div>
              </button>

              {/* Deletes this character */}
              <button
                type="button"
                className="deleteButton"
                onClick={() => onDeleteCharacter(character.id)}
                aria-label={`Delete ${character.name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default CharacterList