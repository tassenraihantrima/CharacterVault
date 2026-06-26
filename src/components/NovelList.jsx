import { useState } from 'react'

function NovelList({ novels, selectedNovelId, onSelectNovel, onAddNovel, onDeleteNovel }) {
  // Stores new novel input
  const [title, setTitle] = useState('')

  function handleAddNovel() {
    onAddNovel(title)
    setTitle('')
  }

  return (
    <section className="panel">
      <h2>Novels</h2>

      <div className="inputRow">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New novel title"
        />

        <button onClick={handleAddNovel}>Add</button>
      </div>

      <div className="list">
        {novels.map(novel => (
          <div
            key={novel.id}
            className={novel.id === selectedNovelId ? 'listItem active' : 'listItem'}
          >
            <button className="nameButton" onClick={() => onSelectNovel(novel.id)}>
              {novel.title}
            </button>

            <button className="deleteButton" onClick={() => onDeleteNovel(novel.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NovelList