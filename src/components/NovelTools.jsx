import { useEffect, useMemo, useState } from 'react'

function NovelTools({
    novels,
    selectedNovel,
    onUpdateNovel,
    onImportWorkspace,
    onImportNovel
}) {
    /*
      Controls whether the Novel Settings section or the
      Import / Export section is currently displayed.
    */
    const [activeToolTab, setActiveToolTab] = useState('settings')

    /*
      Stores feedback for successful and unsuccessful
      import/export actions.
    */
    const [toolMessage, setToolMessage] = useState('')

    /*
      Clear temporary messages whenever the selected novel changes.
    */
    useEffect(() => {
        setToolMessage('')
    }, [selectedNovel?.id])

    /*
      Calculate writing progress from the selected novel's
      current and target word counts.
  
      useMemo avoids recalculating the percentage unless either
      word-count value changes.
    */
    const writingProgress = useMemo(() => {
        if (!selectedNovel) return 0

        const currentWordCount = Number(selectedNovel.currentWordCount)
        const targetWordCount = Number(selectedNovel.targetWordCount)

        /*
          Invalid, empty, zero, or negative target values cannot
          produce a useful percentage.
        */
        if (
            !Number.isFinite(currentWordCount) ||
            !Number.isFinite(targetWordCount) ||
            targetWordCount <= 0
        ) {
            return 0
        }

        /*
          Limit the displayed progress to 100%.
    
          A writer may exceed the original target, but the visual
          progress bar should remain inside its container.
        */
        return Math.min(
            Math.round((currentWordCount / targetWordCount) * 100),
            100
        )
    }, [
        selectedNovel?.currentWordCount,
        selectedNovel?.targetWordCount
    ])

    /*
      Convert a title into a safe file name.
  
      Example:
      "Draven's Dilemma" becomes "dravens-dilemma"
    */
    function createSafeFileName(title) {
        const safeTitle = String(title || 'character-vault')
            .toLowerCase()
            .trim()
            .replace(/['’]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        return safeTitle || 'character-vault'
    }

    /*
      Download JavaScript data as a formatted JSON file.
    */
    function downloadJsonFile(data, fileName) {
        /*
          Convert the JavaScript object into readable JSON.
    
          The value 2 adds indentation so the exported file
          remains easy to inspect manually.
        */
        const jsonContent = JSON.stringify(data, null, 2)

        /*
          Blob creates a temporary downloadable file inside
          the browser.
        */
        const fileBlob = new Blob(
            [jsonContent],
            {
                type: 'application/json'
            }
        )

        /*
          Create a temporary browser URL for the Blob.
        */
        const downloadUrl = URL.createObjectURL(fileBlob)

        /*
          Create a temporary anchor element and use it to
          start the download.
        */
        const downloadLink = document.createElement('a')

        downloadLink.href = downloadUrl
        downloadLink.download = fileName

        document.body.appendChild(downloadLink)
        downloadLink.click()
        downloadLink.remove()

        /*
          Release the temporary browser URL after downloading.
        */
        URL.revokeObjectURL(downloadUrl)
    }

    /*
      Export only the currently selected novel.
    */
    function exportSelectedNovel() {
        if (!selectedNovel) {
            setToolMessage('Select a novel before exporting.')
            return
        }

        /*
          Include metadata so future versions of CharacterVault
          can identify the file type.
        */
        const exportData = {
            format: 'charactervault-novel',
            version: 1,
            exportedAt: new Date().toISOString(),
            novel: selectedNovel
        }

        const fileName =
            `${createSafeFileName(selectedNovel.title)}-backup.json`

        downloadJsonFile(exportData, fileName)

        setToolMessage(
            `"${selectedNovel.title}" was exported successfully.`
        )
    }

    /*
      Export the complete CharacterVault workspace.
    */
    function exportWorkspace() {
        const exportData = {
            format: 'charactervault-workspace',
            version: 1,
            exportedAt: new Date().toISOString(),
            novels
        }

        downloadJsonFile(
            exportData,
            'charactervault-workspace-backup.json'
        )

        setToolMessage(
            'The complete CharacterVault workspace was exported successfully.'
        )
    }

    /*
      Validate the basic structure of a novel before importing it.
    */
    function isValidNovel(novel) {
        return (
            novel &&
            typeof novel === 'object' &&
            typeof novel.title === 'string' &&
            Array.isArray(novel.characters)
        )
    }

    /*
      Create a safe imported novel object.
  
      Imported IDs are replaced to reduce the chance of collisions
      with novels and characters that already exist.
    */
    function normalizeImportedNovel(importedNovel) {
        const novelTime = Date.now()

        return {
            ...importedNovel,

            // Assign a new novel ID
            id: novelTime + Math.random(),

            // Ensure required novel fields exist
            title:
                importedNovel.title?.trim() ||
                'Imported Novel',

            genre: importedNovel.genre || '',
            synopsis: importedNovel.synopsis || '',
            writingStatus:
                importedNovel.writingStatus || 'Planning',
            currentWordCount:
                importedNovel.currentWordCount || '',
            targetWordCount:
                importedNovel.targetWordCount || '',
            cover: importedNovel.cover || '',

            /*
              Give every imported character a new ID.
      
              Nested relationship, timeline, and Where Used IDs are
              also refreshed where possible.
            */
            characters: (importedNovel.characters || []).map(
                (character, characterIndex) => ({
                    ...character,

                    id:
                        novelTime +
                        characterIndex +
                        Math.random(),

                    favorite: Boolean(character.favorite),
                    portrait: character.portrait || '',
                    tags: Array.isArray(character.tags)
                        ? character.tags
                        : [],

                    whereUsed: Array.isArray(character.whereUsed)
                        ? character.whereUsed.map(
                            (entry, entryIndex) => ({
                                ...entry,
                                id:
                                    novelTime +
                                    characterIndex +
                                    entryIndex +
                                    Math.random()
                            })
                        )
                        : [],

                    relationships: Array.isArray(
                        character.relationships
                    )
                        ? character.relationships.map(
                            (relationship, relationshipIndex) => ({
                                ...relationship,
                                id:
                                    novelTime +
                                    characterIndex +
                                    relationshipIndex +
                                    Math.random()
                            })
                        )
                        : [],

                    timeline: Array.isArray(character.timeline)
                        ? character.timeline.map(
                            (event, eventIndex) => ({
                                ...event,
                                id:
                                    novelTime +
                                    characterIndex +
                                    eventIndex +
                                    Math.random()
                            })
                        )
                        : []
                })
            )
        }
    }

    /*
      Read and import a selected JSON file.
    */
    function handleImportFile(event) {
        const selectedFile = event.target.files[0]

        // Stop when no file was selected
        if (!selectedFile) return

        // Only accept JSON files
        if (
            selectedFile.type &&
            selectedFile.type !== 'application/json'
        ) {
            setToolMessage(
                'Please select a valid JSON backup file.'
            )

            event.target.value = ''
            return
        }

        const reader = new FileReader()

        /*
          This runs after FileReader finishes reading the file.
        */
        reader.onload = () => {
            try {
                /*
                  Convert the imported JSON text into JavaScript data.
                */
                const importedData = JSON.parse(reader.result)

                /*
                  Import a complete workspace backup.
                */
                if (
                    importedData.format ===
                    'charactervault-workspace' &&
                    Array.isArray(importedData.novels)
                ) {
                    const validNovels =
                        importedData.novels.filter(isValidNovel)

                    if (validNovels.length === 0) {
                        throw new Error(
                            'The workspace does not contain valid novels.'
                        )
                    }

                    /*
                      Replacing the workspace can remove current LocalStorage
                      data, so request confirmation first.
                    */
                    const shouldReplace = window.confirm(
                        'Importing this workspace will replace all novels currently stored in CharacterVault. Continue?'
                    )

                    if (!shouldReplace) {
                        setToolMessage(
                            'Workspace import was cancelled.'
                        )

                        event.target.value = ''
                        return
                    }

                    const normalizedNovels =
                        validNovels.map(normalizeImportedNovel)

                    onImportWorkspace(normalizedNovels)

                    setToolMessage(
                        `${normalizedNovels.length} novels were imported successfully.`
                    )

                    event.target.value = ''
                    return
                }

                /*
                  Import a single CharacterVault novel backup.
                */
                if (
                    importedData.format ===
                    'charactervault-novel' &&
                    isValidNovel(importedData.novel)
                ) {
                    const normalizedNovel =
                        normalizeImportedNovel(importedData.novel)

                    onImportNovel(normalizedNovel)

                    setToolMessage(
                        `"${normalizedNovel.title}" was imported successfully.`
                    )

                    event.target.value = ''
                    return
                }

                /*
                  Also support a plain novel object when it contains
                  the required title and characters properties.
                */
                if (isValidNovel(importedData)) {
                    const normalizedNovel =
                        normalizeImportedNovel(importedData)

                    onImportNovel(normalizedNovel)

                    setToolMessage(
                        `"${normalizedNovel.title}" was imported successfully.`
                    )

                    event.target.value = ''
                    return
                }

                throw new Error(
                    'The selected file is not a supported CharacterVault backup.'
                )
            } catch (error) {
                console.error('Import failed:', error)

                setToolMessage(
                    error.message ||
                    'The selected JSON file could not be imported.'
                )
            }

            /*
              Reset the file input so the same file can be selected again.
            */
            event.target.value = ''
        }

        /*
          Handle browser file-reading errors.
        */
        reader.onerror = () => {
            setToolMessage(
                'The selected file could not be read.'
            )

            event.target.value = ''
        }

        reader.readAsText(selectedFile)
    }

    /*
      Handle novel cover uploads.
  
      The image is stored as a Base64 string, matching the existing
      character portrait system.
    */
    function handleCoverUpload(event) {
        const selectedFile = event.target.files[0]

        if (!selectedFile || !selectedNovel) return

        /*
          Prevent non-image files from being uploaded.
        */
        if (!selectedFile.type.startsWith('image/')) {
            setToolMessage(
                'Please choose a valid image for the novel cover.'
            )

            event.target.value = ''
            return
        }

        /*
          Large Base64 images can fill LocalStorage quickly.
    
          Limit covers to approximately two megabytes.
        */
        const maximumFileSize = 2 * 1024 * 1024

        if (selectedFile.size > maximumFileSize) {
            setToolMessage(
                'The cover image must be smaller than 2 MB.'
            )

            event.target.value = ''
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            onUpdateNovel(
                selectedNovel.id,
                'cover',
                reader.result
            )

            setToolMessage(
                'The novel cover was updated.'
            )

            event.target.value = ''
        }

        reader.onerror = () => {
            setToolMessage(
                'The cover image could not be read.'
            )

            event.target.value = ''
        }

        reader.readAsDataURL(selectedFile)
    }

    /*
      Remove the selected novel's cover.
    */
    function removeCover() {
        if (!selectedNovel) return

        onUpdateNovel(
            selectedNovel.id,
            'cover',
            ''
        )

        setToolMessage(
            'The novel cover was removed.'
        )
    }

    /*
      Novel Tools only appears after a novel is selected.
    */
    if (!selectedNovel) {
        return null
    }

    return (
        <section className="novelToolsSection">
            {/* Section heading */}
            <div className="novelToolsHeader">
                <div>
                    <span className="novelToolsEyebrow">
                        Phase 18
                    </span>

                    <h2>Novel Workspace</h2>

                    <p>
                        Manage project details and create portable
                        CharacterVault backups.
                    </p>
                </div>

                {/* Display the current writing status */}
                <span className="novelStatusBadge">
                    {selectedNovel.writingStatus || 'Planning'}
                </span>
            </div>

            {/* Tool navigation */}
            <div
                className="novelToolsTabs"
                role="tablist"
                aria-label="Novel workspace tools"
            >
                <button
                    type="button"
                    className={
                        activeToolTab === 'settings'
                            ? 'activeNovelToolTab'
                            : ''
                    }
                    onClick={() => {
                        setActiveToolTab('settings')
                        setToolMessage('')
                    }}
                >
                    Novel Settings
                </button>

                <button
                    type="button"
                    className={
                        activeToolTab === 'backup'
                            ? 'activeNovelToolTab'
                            : ''
                    }
                    onClick={() => {
                        setActiveToolTab('backup')
                        setToolMessage('')
                    }}
                >
                    Import / Export
                </button>
            </div>

            {/* Novel Settings tab */}
            {activeToolTab === 'settings' && (
                <div className="novelSettingsLayout">
                    {/* Cover section */}
                    <div className="novelCoverPanel">
                        <h3>Novel Cover</h3>

                        {selectedNovel.cover ? (
                            <img
                                src={selectedNovel.cover}
                                alt={`${selectedNovel.title} cover`}
                                className="novelCoverImage"
                            />
                        ) : (
                            <div className="novelCoverPlaceholder">
                                <span>
                                    {selectedNovel.title
                                        ? selectedNovel.title[0].toUpperCase()
                                        : '?'}
                                </span>

                                <p>No cover uploaded</p>
                            </div>
                        )}

                        <div className="novelCoverActions">
                            <label className="uploadButton">
                                Upload Cover

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                />
                            </label>

                            {selectedNovel.cover && (
                                <button
                                    type="button"
                                    onClick={removeCover}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <p className="inputHelpText">
                            Use JPG, PNG, or WebP. Maximum size: 2 MB.
                        </p>
                    </div>

                    {/* Novel metadata form */}
                    <div className="novelMetadataPanel">
                        <h3>Project Details</h3>

                        <label htmlFor="novelTitle">
                            Novel Title
                        </label>

                        <input
                            id="novelTitle"
                            type="text"
                            value={selectedNovel.title || ''}
                            onChange={event =>
                                onUpdateNovel(
                                    selectedNovel.id,
                                    'title',
                                    event.target.value
                                )
                            }
                        />

                        <div className="novelSettingsGrid">
                            <div>
                                <label htmlFor="novelGenre">
                                    Genre
                                </label>

                                <input
                                    id="novelGenre"
                                    type="text"
                                    value={selectedNovel.genre || ''}
                                    onChange={event =>
                                        onUpdateNovel(
                                            selectedNovel.id,
                                            'genre',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Fantasy, romance, mystery..."
                                />
                            </div>

                            <div>
                                <label htmlFor="writingStatus">
                                    Writing Status
                                </label>

                                <select
                                    id="writingStatus"
                                    value={
                                        selectedNovel.writingStatus ||
                                        'Planning'
                                    }
                                    onChange={event =>
                                        onUpdateNovel(
                                            selectedNovel.id,
                                            'writingStatus',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="Planning">
                                        Planning
                                    </option>

                                    <option value="Drafting">
                                        Drafting
                                    </option>

                                    <option value="Revising">
                                        Revising
                                    </option>

                                    <option value="Editing">
                                        Editing
                                    </option>

                                    <option value="Complete">
                                        Complete
                                    </option>
                                </select>
                            </div>
                        </div>

                        <label htmlFor="novelSynopsis">
                            Synopsis
                        </label>

                        <textarea
                            id="novelSynopsis"
                            value={selectedNovel.synopsis || ''}
                            onChange={event =>
                                onUpdateNovel(
                                    selectedNovel.id,
                                    'synopsis',
                                    event.target.value
                                )
                            }
                            placeholder="Write a short summary of the novel..."
                        />

                        <h3 className="wordCountHeading">
                            Writing Progress
                        </h3>

                        <div className="novelSettingsGrid">
                            <div>
                                <label htmlFor="currentWordCount">
                                    Current Word Count
                                </label>

                                <input
                                    id="currentWordCount"
                                    type="number"
                                    min="0"
                                    value={
                                        selectedNovel.currentWordCount || ''
                                    }
                                    onChange={event =>
                                        onUpdateNovel(
                                            selectedNovel.id,
                                            'currentWordCount',
                                            event.target.value
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="targetWordCount">
                                    Target Word Count
                                </label>

                                <input
                                    id="targetWordCount"
                                    type="number"
                                    min="0"
                                    value={
                                        selectedNovel.targetWordCount || ''
                                    }
                                    onChange={event =>
                                        onUpdateNovel(
                                            selectedNovel.id,
                                            'targetWordCount',
                                            event.target.value
                                        )
                                    }
                                    placeholder="80000"
                                />
                            </div>
                        </div>

                        {/* Writing progress display */}
                        <div className="writingProgressCard">
                            <div className="writingProgressHeader">
                                <span>Novel Progress</span>

                                <strong>
                                    {writingProgress}%
                                </strong>
                            </div>

                            <div
                                className="writingProgressTrack"
                                role="progressbar"
                                aria-label="Novel writing progress"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                aria-valuenow={writingProgress}
                            >
                                <div
                                    className="writingProgressFill"
                                    style={{
                                        width: `${writingProgress}%`
                                    }}
                                />
                            </div>

                            <p>
                                {Number(
                                    selectedNovel.currentWordCount || 0
                                ).toLocaleString()}{' '}
                                of{' '}
                                {Number(
                                    selectedNovel.targetWordCount || 0
                                ).toLocaleString()}{' '}
                                words
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Import and Export tab */}
            {activeToolTab === 'backup' && (
                <div className="backupToolsGrid">
                    {/* Export selected novel */}
                    <article className="backupToolCard">
                        <span className="backupToolIcon">
                            📘
                        </span>

                        <h3>Export Selected Novel</h3>

                        <p>
                            Download the selected novel, including its
                            characters, portraits, tags, relationships,
                            timelines, appearances, and project settings.
                        </p>

                        <button
                            type="button"
                            className="primaryButton"
                            onClick={exportSelectedNovel}
                        >
                            Export Novel
                        </button>
                    </article>

                    {/* Export complete workspace */}
                    <article className="backupToolCard">
                        <span className="backupToolIcon">
                            🗂️
                        </span>

                        <h3>Export Workspace</h3>

                        <p>
                            Download every novel currently saved inside
                            CharacterVault as one complete backup.
                        </p>

                        <button
                            type="button"
                            className="primaryButton"
                            onClick={exportWorkspace}
                        >
                            Export All Novels
                        </button>
                    </article>

                    {/* Import JSON backup */}
                    <article className="backupToolCard">
                        <span className="backupToolIcon">
                            📥
                        </span>

                        <h3>Import Backup</h3>

                        <p>
                            Import a CharacterVault novel or complete
                            workspace from a previously exported JSON file.
                        </p>

                        <label className="backupImportButton">
                            Choose JSON File

                            <input
                                type="file"
                                accept=".json,application/json"
                                onChange={handleImportFile}
                            />
                        </label>
                    </article>
                </div>
            )}

            {/* Import/export feedback */}
            {toolMessage && (
                <p
                    className="novelToolMessage"
                    role="status"
                >
                    {toolMessage}
                </p>
            )}
        </section>
    )
}

export default NovelTools