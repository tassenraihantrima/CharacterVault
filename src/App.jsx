import './App.css'

function App() {
  const novels = [
    { id: 1, title: 'Novel 1' },
    { id: 2, title: 'Novel 2' },
    { id: 3, title: 'Novel 3' }
  ]

  function createNovel() {
    // create a new novel object 
    const newNovel = {
      id: novels.length + 1,
      title: `Novel ${novels.length + 1}`
    }

    // add the new novel to the novels array
    setNovels([...novels, newNovel])
  }
  return (
    <div>
      <h1>CharacterVault</h1>

      <h2>My Novels</h2>

      <button onClick={createNovel}>Create Novel</button>

      <ul>
        {novels.map(novel => (
          <li key={novel.id}>{novel.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
