import { useEffect, useState } from 'react'
import './App.css'
import StatisticsPanel from './components/StatisticsPanel'
import NovelList from './components/NovelList'
import CharacterList from './components/CharacterList'
import CharacterProfile from './components/CharacterProfile'

function App() {
  // Load saved novels from browser storage
  const [novels, setNovels] = useState(() => {
    const saved = localStorage.getItem('novels')
    return saved
      ? JSON.parse(saved)
      : [
        { id: 1, title: 'Royally Chosen', characters: [] },
        { id: 2, title: "Zinnia's Wedding Crasher", characters: [] },
        { id: 3, title: "Draven's Dilemma", characters: [] }
      ]
  })

  // Save novels whenever they change
  useEffect(() => {
    localStorage.setItem('novels', JSON.stringify(novels))
  }, [novels])

  // Selected novel and character ids
  const [selectedNovelId, setSelectedNovelId] = useState(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)

  // Find selected novel
  const selectedNovel = novels.find(novel => novel.id === selectedNovelId)

  // Find selected character
  const selectedCharacter = selectedNovel?.characters.find(
    character => character.id === selectedCharacterId
  )

  // Add a new novel
  function addNovel(title) {
    if (!title.trim()) return

    const newNovel = {
      id: Date.now(),
      title,
      characters: []
    }

    setNovels([...novels, newNovel])
  }

  // Delete a novel
  function deleteNovel(id) {
    setNovels(novels.filter(novel => novel.id !== id))

    if (selectedNovelId === id) {
      setSelectedNovelId(null)
      setSelectedCharacterId(null)
    }
  }

  // Add a new character to selected novel
  function addCharacter(characterData) {
    if (!selectedNovel) return

    const newCharacter = {
      id: Date.now(),
      ...characterData,
      favorite: false,
      whereUsed: [],
      relationships: [],
      timeline: [],
      portrait: ''
    }

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? { ...novel, characters: [...novel.characters, newCharacter] }
          : novel
      )
    )
  }

  // Delete character
  function deleteCharacter(characterId) {
    if (!selectedNovel) return

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.filter(character => character.id !== characterId)
          }
          : novel
      )
    )

    if (selectedCharacterId === characterId) {
      setSelectedCharacterId(null)
    }
  }

  // Update selected character field
  function updateCharacter(field, value) {
    if (!selectedNovel || !selectedCharacter) return

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? { ...character, [field]: value }
                : character
            )
          }
          : novel
      )
    )
  }

  // Add where-used entry
  function addWhereUsed(entry) {
    if (!selectedNovel || !selectedCharacter) return

    const newEntry = {
      id: Date.now(),
      ...entry
    }

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? {
                  ...character,
                  whereUsed: [...character.whereUsed, newEntry]
                }
                : character
            )
          }
          : novel
      )
    )
  }

  // Adds or removes a character from favorites
  function toggleFavorite(characterId) {
    // A novel must be selected before changing a character
    if (!selectedNovel) return

    setNovels(
      novels.map(novel => {
        // Leave every other novel unchanged
        if (novel.id !== selectedNovel.id) {
          return novel
        }

        return {
          ...novel,
          // Find and update only the clicked character
          characters: novel.characters.map(character =>
            character.id === characterId
              ? {
                ...character,
                // Change true to false or false to true
                favorite: !character.favorite
              }
              : character
          )
        }
      })
    )
  }

  // Add a relationship to the selected character
  function addRelationship(relationshipData) {
    if (!selectedNovel || !selectedCharacter) return

    const newRelationship = {
      id: Date.now(),
      ...relationshipData
    }

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? {
                  ...character,
                  relationships: [
                    ...(character.relationships || []),
                    newRelationship
                  ]
                }
                : character
            )
          }
          : novel
      )
    )
  }

  // Delete where-used entry
  function deleteWhereUsed(entryId) {
    if (!selectedNovel || !selectedCharacter) return

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? {
                  ...character,
                  whereUsed: character.whereUsed.filter(entry => entry.id !== entryId)
                }
                : character
            )
          }
          : novel
      )
    )
  }

  // Delete a relationship from the selected character
  function deleteRelationship(relationshipId) {
    if (!selectedNovel || !selectedCharacter) return

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? {
                  ...character,
                  relationships: (character.relationships || []).filter(
                    relationship => relationship.id !== relationshipId
                  )
                }
                : character
            )
          }
          : novel
      )
    )
  }

  // Add a timeline event to the selected character
  function addTimelineEvent(eventData) {
    if (!selectedNovel || !selectedCharacter) return

    const newEvent = {
      id: Date.now(),
      ...eventData
    }

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? {
                  ...character,
                  timeline: [...(character.timeline || []), newEvent]
                }
                : character
            )
          }
          : novel
      )
    )
  }

  // Delete a timeline event from the selected character
  function deleteTimelineEvent(eventId) {
    if (!selectedNovel || !selectedCharacter) return

    setNovels(
      novels.map(novel =>
        novel.id === selectedNovel.id
          ? {
            ...novel,
            characters: novel.characters.map(character =>
              character.id === selectedCharacter.id
                ? {
                  ...character,
                  timeline: (character.timeline || []).filter(event => event.id !== eventId)
                }
                : character
            )
          }
          : novel
      )
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>CharacterVault</h1>
        <p>Organize novels, characters, scenes, and story details.</p>
      </header>

      <StatisticsPanel selectedNovel={selectedNovel} />

      <main className="layout">
        <NovelList
          novels={novels}
          selectedNovelId={selectedNovelId}
          onSelectNovel={id => {
            setSelectedNovelId(id)
            setSelectedCharacterId(null)
          }}
          onAddNovel={addNovel}
          onDeleteNovel={deleteNovel}
        />

        <CharacterList
          selectedNovel={selectedNovel}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={setSelectedCharacterId}
          onAddCharacter={addCharacter}
          onDeleteCharacter={deleteCharacter}
          onToggleFavorite={toggleFavorite}
        />

        <CharacterProfile
          character={selectedCharacter}
          onUpdateCharacter={updateCharacter}
          onAddWhereUsed={addWhereUsed}
          onDeleteWhereUsed={deleteWhereUsed}
          onAddRelationship={addRelationship}
          onDeleteRelationship={deleteRelationship}
          onAddTimelineEvent={addTimelineEvent}
          onDeleteTimelineEvent={deleteTimelineEvent}
        />
      </main>
    </div>
  )
}

export default App