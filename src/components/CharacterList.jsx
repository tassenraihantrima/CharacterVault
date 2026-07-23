import { useEffect, useState } from 'react'

function CharacterList({
    selectedNovel,
    selectedCharacterId,
    onSelectCharacter,
    onAddCharacter,
    onDeleteCharacter,
    onToggleFavorite
}) {

    // Stores the text entered into the main character search field
    const [search, setSearch] = useState('')

    // Stores the currently selected role filter
    const [roleFilter, setRoleFilter] = useState('all')

    // Stores the currently selected tag filter
    const [tagFilter, setTagFilter] = useState('all')

    // Stores the selected character sorting method
    const [sortOption, setSortOption] = useState('default')

    // Controls whether only favorite characters are displayed
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    // Basic character fields
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [age, setAge] = useState('')
    const [personality, setPersonality] = useState('')
    const [goal, setGoal] = useState('')
    const [conflict, setConflict] = useState('')
    const [notes, setNotes] = useState('')

    /*
      The tags input accepts comma-separated tags.
    */
    const [tagsInput, setTagsInput] = useState('')

    /*
      Reset filters whenever the user changes novels. This prevents filters from one novel from making another
      novel appear empty when it is selected.
    */
    useEffect(() => {
        setSearch('')
        setRoleFilter('all')
        setTagFilter('all')
        setSortOption('default')
        setShowFavoritesOnly(false)
    }, [selectedNovel?.id])

    // Show instructions when no novel has been selected
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

    /*
      Converts comma-separated text into a clean tag array. Duplicate tags are removed without caring about capitalization.
    */
    function createTagsFromInput(inputValue) {
        // Split the text whenever a comma appears
        const separatedTags = inputValue.split(',')

        // Remove unnecessary spaces and empty values
        const cleanedTags = separatedTags
            .map(tag => tag.trim())
            .filter(Boolean)

        // Remove duplicate tags while keeping the first spelling entered
        return cleanedTags.filter((tag, index, allTags) => {
            return (
                allTags.findIndex(
                    currentTag =>
                        currentTag.toLowerCase() === tag.toLowerCase()
                ) === index
            )
        })
    }

    /*
      Creates a new character using the form values.
    */
    function handleAddCharacter() {
        // A character must have a name
        if (!name.trim()) return

        // Convert the tag input into a clean array
        const newCharacterTags = createTagsFromInput(tagsInput)

        /*
          Send the finished character object to App.jsx.

          App.jsx adds the id, favorite status, relationships,
          timeline, portrait, and other default values.
        */
        onAddCharacter({
            name: name.trim(),
            role: role.trim(),
            age: age.trim(),
            personality: personality.trim(),
            goal: goal.trim(),
            conflict: conflict.trim(),
            notes: notes.trim(),
            tags: newCharacterTags
        })

        // Clear every character form field after creation
        setName('')
        setRole('')
        setAge('')
        setPersonality('')
        setGoal('')
        setConflict('')
        setNotes('')
        setTagsInput('')
    }

    /*
      Clears every search, filter, and sorting option.
    */
    function resetFilters() {
        setSearch('')
        setRoleFilter('all')
        setTagFilter('all')
        setSortOption('default')
        setShowFavoritesOnly(false)
    }

    /*
      Create a unique alphabetical list of all roles used
      in the selected novel.
    */
    const availableRoles = [
        ...new Set(
            selectedNovel.characters
                .map(character => character.role?.trim())
                .filter(Boolean)
        )
    ].sort((firstRole, secondRole) =>
        firstRole.localeCompare(secondRole)
    )

    /*
      Gather all tags from all characters.

      flatMap() takes arrays stored inside each character and
      combines them into one large array.
    */
    const allCharacterTags = selectedNovel.characters.flatMap(
        character => character.tags || []
    )

    /*
      Create a unique alphabetical list of tags.
      Tags are treated as duplicates regardless of capitalization.
    */
    const availableTags = allCharacterTags
        .filter((tag, index, allTags) => {
            return (
                allTags.findIndex(
                    currentTag =>
                        currentTag.toLowerCase() === tag.toLowerCase()
                ) === index
            )
        })
        .sort((firstTag, secondTag) =>
            firstTag.localeCompare(secondTag)
        )

    /*
      Search characters using profile information and tags.

      Search now checks:
      - Name
      - Role
      - Age
      - Personality
      - Goal
      - Conflict
      - Notes
      - Tags
    */
    let displayedCharacters = selectedNovel.characters.filter(character => {
        /*
          Convert the tags array into normal text so it can be
          searched using the same search field.
        */
        const tagText = (character.tags || []).join(' ')

        // Combine all searchable information into one string
        const searchableText = `
            ${character.name || ''}
            ${character.role || ''}
            ${character.age || ''}
            ${character.personality || ''}
            ${character.goal || ''}
            ${character.conflict || ''}
            ${character.notes || ''}
            ${tagText}
        `.toLowerCase()

        // Remove extra spaces and make the search case-insensitive
        const normalizedSearch = search.trim().toLowerCase()

        return searchableText.includes(normalizedSearch)
    })

    // Filter characters by role when a specific role is selected
    if (roleFilter !== 'all') {
        displayedCharacters = displayedCharacters.filter(
            character => character.role === roleFilter
        )
    }

    /*
      Keep only characters containing the selected tag.
      The comparison ignores capitalization.
    */
    if (tagFilter !== 'all') {
        displayedCharacters = displayedCharacters.filter(character =>
            (character.tags || []).some(
                tag => tag.toLowerCase() === tagFilter.toLowerCase()
            )
        )
    }

    // Keep only favorite characters when the checkbox is selected
    if (showFavoritesOnly) {
        displayedCharacters = displayedCharacters.filter(
            character => character.favorite === true
        )
    }

    /*
      Copy arrays before sorting.
    */

    // Sort names alphabetically from A to Z
    if (sortOption === 'name-az') {
        displayedCharacters = [...displayedCharacters].sort(
            (firstCharacter, secondCharacter) =>
                (firstCharacter.name || '').localeCompare(
                    secondCharacter.name || ''
                )
        )
    }

    // Sort names alphabetically from Z to A
    if (sortOption === 'name-za') {
        displayedCharacters = [...displayedCharacters].sort(
            (firstCharacter, secondCharacter) =>
                (secondCharacter.name || '').localeCompare(
                    firstCharacter.name || ''
                )
        )
    }

    // Sort numeric ages from lowest to highest
    if (sortOption === 'age-low-high') {
        displayedCharacters = [...displayedCharacters].sort(
            (firstCharacter, secondCharacter) => {
                /*
                  Characters without valid ages are placed at
                  the bottom of the list.
                */
                const firstAge =
                    firstCharacter.age !== '' &&
                        Number.isFinite(Number(firstCharacter.age))
                        ? Number(firstCharacter.age)
                        : Number.MAX_SAFE_INTEGER

                const secondAge =
                    secondCharacter.age !== '' &&
                        Number.isFinite(Number(secondCharacter.age))
                        ? Number(secondCharacter.age)
                        : Number.MAX_SAFE_INTEGER

                return firstAge - secondAge
            }
        )
    }

    // Sort numeric ages from highest to lowest
    if (sortOption === 'age-high-low') {
        displayedCharacters = [...displayedCharacters].sort(
            (firstCharacter, secondCharacter) => {
                /*
                  Characters without valid ages are placed at
                  the bottom of the list.
                */
                const firstAge =
                    firstCharacter.age !== '' &&
                        Number.isFinite(Number(firstCharacter.age))
                        ? Number(firstCharacter.age)
                        : -1

                const secondAge =
                    secondCharacter.age !== '' &&
                        Number.isFinite(Number(secondCharacter.age))
                        ? Number(secondCharacter.age)
                        : -1

                return secondAge - firstAge
            }
        )
    }

    // Place favorite characters before non-favorite characters
    if (sortOption === 'favorites-first') {
        displayedCharacters = [...displayedCharacters].sort(
            (firstCharacter, secondCharacter) =>
                Number(Boolean(secondCharacter.favorite)) -
                Number(Boolean(firstCharacter.favorite))
        )
    }

    // Place characters with the most tags first
    if (sortOption === 'most-tags') {
        displayedCharacters = [...displayedCharacters].sort(
            (firstCharacter, secondCharacter) =>
                (secondCharacter.tags?.length || 0) -
                (firstCharacter.tags?.length || 0)
        )
    }

    // Count favorite characters inside the selected novel
    const favoriteCount = selectedNovel.characters.filter(
        character => character.favorite === true
    ).length

    /*
      Determine whether any filter is currently active.

      This helps the interface explain why fewer characters
      may be displayed.
    */
    const filtersAreActive =
        search.trim() !== '' ||
        roleFilter !== 'all' ||
        tagFilter !== 'all' ||
        showFavoritesOnly ||
        sortOption !== 'default'

    return (
        <section className="panel characterPanel">
            {/* Panel heading and total character count */}
            <div className="characterPanelHeader">
                <div>
                    <h2>Characters</h2>

                    <p className="panelSubtitle">
                        {selectedNovel.title}
                    </p>
                </div>

                <span
                    className="characterCount"
                    title="Total characters in this novel"
                >
                    {selectedNovel.characters.length}
                </span>
            </div>

            {/* Main character search */}
            <div className="searchSection">
                <label htmlFor="characterSearch">
                    Search Characters
                </label>

                <input
                    id="characterSearch"
                    type="search"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search names, details, notes, or tags..."
                />
            </div>

            {/*
              Role, tag, and sorting controls.
              Three controls are displayed together on wider screens.
            */}
            <div className="advancedFilterGrid">
                {/* Role filter */}
                <div>
                    <label htmlFor="roleFilter">
                        Filter by Role
                    </label>

                    <select
                        id="roleFilter"
                        value={roleFilter}
                        onChange={event =>
                            setRoleFilter(event.target.value)
                        }
                    >
                        <option value="all">
                            All roles
                        </option>

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

                {/* Tag filter */}
                <div>
                    <label htmlFor="tagFilter">
                        Filter by Tag
                    </label>

                    <select
                        id="tagFilter"
                        value={tagFilter}
                        onChange={event =>
                            setTagFilter(event.target.value)
                        }
                    >
                        <option value="all">
                            All tags
                        </option>

                        {availableTags.map(tag => (
                            <option
                                key={tag}
                                value={tag}
                            >
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sorting menu */}
                <div>
                    <label htmlFor="sortCharacters">
                        Sort Characters
                    </label>

                    <select
                        id="sortCharacters"
                        value={sortOption}
                        onChange={event =>
                            setSortOption(event.target.value)
                        }
                    >
                        <option value="default">
                            Default order
                        </option>

                        <option value="favorites-first">
                            Favorites first
                        </option>

                        <option value="most-tags">
                            Most tags
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

            {/* Search and filtering summary */}
            <div className="searchSummary">
                <div>
                    <span>
                        {displayedCharacters.length}{' '}
                        {displayedCharacters.length === 1
                            ? 'character'
                            : 'characters'}{' '}
                        found
                    </span>

                    {filtersAreActive && (
                        <span className="activeFilterText">
                            Filters active
                        </span>
                    )}
                </div>

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

                {/* Basic character information */}
                <div className="formGrid">
                    <input
                        type="text"
                        value={name}
                        onChange={event =>
                            setName(event.target.value)
                        }
                        placeholder="Name"
                    />

                    <input
                        type="text"
                        value={role}
                        onChange={event =>
                            setRole(event.target.value)
                        }
                        placeholder="Role"
                    />

                    <input
                        type="text"
                        value={age}
                        onChange={event =>
                            setAge(event.target.value)
                        }
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
                        onChange={event =>
                            setGoal(event.target.value)
                        }
                        placeholder="Goal"
                    />

                    <input
                        type="text"
                        value={conflict}
                        onChange={event =>
                            setConflict(event.target.value)
                        }
                        placeholder="Conflict"
                    />
                </div>

                {/* Tags entered as comma-separated text */}
                <label htmlFor="newCharacterTags">
                    Character Tags
                </label>

                <input
                    id="newCharacterTags"
                    type="text"
                    value={tagsInput}
                    onChange={event =>
                        setTagsInput(event.target.value)
                    }
                    placeholder="hero, royal family, secret identity"
                />

                <p className="inputHelpText">
                    Separate multiple tags using commas.
                </p>

                {/* General character notes */}
                <textarea
                    value={notes}
                    onChange={event =>
                        setNotes(event.target.value)
                    }
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

            {/* Character result cards */}
            <div className="characterCards">
                {displayedCharacters.length === 0 ? (
                    /*
                      Empty search-result state.
                    */
                    <div className="noResults">
                        <h4>No matching characters</h4>

                        <p>
                            Try changing your search, role, tag,
                            or favorite filter.
                        </p>

                        <button
                            type="button"
                            className="secondaryButton"
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /*
                      Display every character that passed all
                      search and filtering conditions.
                    */
                    displayedCharacters.map(character => (
                        <article
                            key={character.id}
                            className={
                                character.id === selectedCharacterId
                                    ? 'characterCard selectedCard'
                                    : 'characterCard'
                            }
                        >
                            {/* Favorite star button */}
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

                            {/* Main clickable character card content */}
                            <button
                                type="button"
                                className="characterMain"
                                onClick={() =>
                                    onSelectCharacter(character.id)
                                }
                            >
                                {/* Portrait or default letter avatar */}
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
                                    {/* Character name */}
                                    <h4>
                                        {character.name ||
                                            'Unnamed Character'}
                                    </h4>

                                    {/* Character role */}
                                    <p>
                                        {character.role ||
                                            'No role assigned'}
                                    </p>

                                    {/* Character age */}
                                    <small>
                                        {character.age
                                            ? `Age ${character.age}`
                                            : 'Age not added'}
                                    </small>

                                    {/* Character tag badges */}
                                    {(character.tags || []).length > 0 && (
                                        <div
                                            className="characterTagList"
                                            aria-label={`${character.name} tags`}
                                        >
                                            {(character.tags || []).map(
                                                tag => (
                                                    <span
                                                        key={tag}
                                                        className="characterTag"
                                                    >
                                                        {tag}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Delete-character button */}
                            <button
                                type="button"
                                className="deleteButton"
                                onClick={() =>
                                    onDeleteCharacter(character.id)
                                }
                                aria-label={`Delete ${character.name}`}
                                title="Delete character"
                            >
                                ×
                            </button>
                        </article>
                    ))
                )}
            </div>
        </section>
    )
}

export default CharacterList