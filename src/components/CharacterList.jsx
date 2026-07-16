import { useState } from 'react'

function CharacterList({
    selectedNovel,
    selectedCharacterId,
    onSelectCharacter,
    onAddCharacter,
    onDeleteCharacter,
    onToggleFavorite
}) {
    // Stores text entered into the search bar
    const [search, setSearch] = useState('')

    // Stores the currently selected role filter
    const [roleFilter, setRoleFilter] = useState('all')

    // Stores the selected sorting method
    const [sortOption, setSortOption] = useState('default')

    // Controls whether only favorite characters are displayed
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    // Character creation form inputs
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [age, setAge] = useState('')
    const [personality, setPersonality] = useState('')
    const [goal, setGoal] = useState('')
    const [conflict, setConflict] = useState('')
    const [notes, setNotes] = useState('')

    // Show an empty state when no novel has been selected
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

    // Creates a new character
    function handleAddCharacter() {
        // Require at least a character name
        if (!name.trim()) return

        // Send the character data to App.jsx
        onAddCharacter({
            name: name.trim(),
            role: role.trim(),
            age: age.trim(),
            personality: personality.trim(),
            goal: goal.trim(),
            conflict: conflict.trim(),
            notes: notes.trim()
        })

        // Clear all character form inputs
        setName('')
        setRole('')
        setAge('')
        setPersonality('')
        setGoal('')
        setConflict('')
        setNotes('')
    }

    // Clears search, filters, sorting, and favorite-only mode
    function resetFilters() {
        setSearch('')
        setRoleFilter('all')
        setSortOption('default')
        setShowFavoritesOnly(false)
    }

    /*
      Create a list of unique roles.
      Example:
      ["Antagonist", "Protagonist", "Supporting Character"]
    */
    const availableRoles = [
        ...new Set(
            selectedNovel.characters
                .map(character => character.role?.trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b))

    /*
      Search characters using multiple profile fields.
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
      Filter by the selected character role.
    */
    if (roleFilter !== 'all') {
        displayedCharacters = displayedCharacters.filter(
            character => character.role === roleFilter
        )
    }

    /*
      Show only starred characters when favorite-only mode is enabled.
    */
    if (showFavoritesOnly) {
        displayedCharacters = displayedCharacters.filter(
            character => character.favorite === true
        )
    }

    /*
      Sort characters.
      A copied array is sorted so the original React state
      is not modified.
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
            const ageA =
                a.age !== '' && Number.isFinite(Number(a.age))
                    ? Number(a.age)
                    : Number.MAX_SAFE_INTEGER

            const ageB =
                b.age !== '' && Number.isFinite(Number(b.age))
                    ? Number(b.age)
                    : Number.MAX_SAFE_INTEGER

            return ageA - ageB
        })
    }

    if (sortOption === 'age-high-low') {
        displayedCharacters = [...displayedCharacters].sort((a, b) => {
            const ageA =
                a.age !== '' && Number.isFinite(Number(a.age))
                    ? Number(a.age)
                    : -1

            const ageB =
                b.age !== '' && Number.isFinite(Number(b.age))
                    ? Number(b.age)
                    : -1

            return ageB - ageA
        })
    }

    // Put starred characters before non-starred characters
    if (sortOption === 'favorites-first') {
        displayedCharacters = [...displayedCharacters].sort(
            (a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite))
        )
    }

    // Count all favorite characters in the selected novel
    const favoriteCount = selectedNovel.characters.filter(
        character => character.favorite === true
    ).length

    return (
        <section className="panel characterPanel">
            {/* Panel heading and total character count */}
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
                <label htmlFor="characterSearch">
                    Search Characters
                </label>

                <input
                    id="characterSearch"
                    type="text"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search name, role, goal, conflict, notes..."
                />
            </div>

            {/* Role filtering and sorting */}
            <div className="filterGrid">
                <div>
                    <label htmlFor="roleFilter">
                        Filter by Role
                    </label>

                    <select
                        id="roleFilter"
                        value={roleFilter}
                        onChange={event => setRoleFilter(event.target.value)}
                    >
                        <option value="all">All roles</option>

                        {availableRoles.map(characterRole => (
                            <option
                                key={characterRole}
                                value={characterRole}
                            >
                                {characterRole}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="sortCharacters">
                        Sort Characters
                    </label>

                    <select
                        id="sortCharacters"
                        value={sortOption}
                        onChange={event => setSortOption(event.target.value)}
                    >
                        <option value="default">
                            Default order
                        </option>

                        <option value="favorites-first">
                            Favorites first
                        </option>

                        <option value="name-az">
                            Name: A–Z
                        </option>

                        <option value="name-za">
                            Name: Z–A
                        </option>

                        <option value="age-low-high">
                            Age: Low to High
                        </option>

                        <option value="age-high-low">
                            Age: High to Low
                        </option>
                    </select>
                </div>
            </div>

            {/* Favorite-only checkbox */}
            <label className="favoriteFilter">
                <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={event =>
                        setShowFavoritesOnly(event.target.checked)
                    }
                />

                <span>
                    Show favorites only ({favoriteCount})
                </span>
            </label>

            {/* Search result summary */}
            <div className="searchSummary">
                <span>
                    {displayedCharacters.length}{' '}
                    {displayedCharacters.length === 1
                        ? 'character'
                        : 'characters'}{' '}
                    found
                </span>

                <button
                    type="button"
                    className="secondaryButton"
                    onClick={resetFilters}
                >
                    Reset
                </button>
            </div>

            {/* Add-character form */}
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
                        onChange={event =>
                            setPersonality(event.target.value)
                        }
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

            {/* Character cards */}
            <div className="characterCards">
                {displayedCharacters.length === 0 ? (
                    <div className="noResults">
                        <p>No matching characters found.</p>

                        <button
                            type="button"
                            className="secondaryButton"
                            onClick={resetFilters}
                        >
                            Clear Filters
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
                            {/* Star or unstar the character */}
                            <button
                                type="button"
                                className={
                                    character.favorite
                                        ? 'favoriteButton favoriteActive'
                                        : 'favoriteButton'
                                }
                                onClick={() =>
                                    onToggleFavorite(character.id)
                                }
                                aria-label={
                                    character.favorite
                                        ? `Remove ${character.name} from favorites`
                                        : `Add ${character.name} to favorites`
                                }
                                title={
                                    character.favorite
                                        ? 'Remove from favorites'
                                        : 'Add to favorites'
                                }
                            >
                                {character.favorite ? '★' : '☆'}
                            </button>

                            {/* Clicking the main card selects the character */}
                            <button
                                type="button"
                                className="characterMain"
                                onClick={() =>
                                    onSelectCharacter(character.id)
                                }
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
                                    <h4>
                                        {character.name || 'Unnamed Character'}
                                    </h4>

                                    <p>
                                        {character.role || 'No role assigned'}
                                    </p>

                                    <small>
                                        {character.age
                                            ? `Age ${character.age}`
                                            : 'Age not added'}
                                    </small>
                                </div>
                            </button>

                            {/* Delete character */}
                            <button
                                type="button"
                                className="deleteButton"
                                onClick={() =>
                                    onDeleteCharacter(character.id)
                                }
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