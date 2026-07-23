function StatisticsPanel({ selectedNovel }) {
    /*
      Do not display the dashboard until the user selects a novel.
    */
    if (!selectedNovel) {
        return null
    }

    /*
      Safely retrieve the characters array.
  
      The fallback empty array prevents errors if an older novel
      does not contain a characters property.
    */
    const characters = selectedNovel.characters || []

    /*
      Total number of characters in the selected novel.
    */
    const totalCharacters = characters.length

    /*
      Count only characters whose favorite property is true.
    */
    const favoriteCharacters = characters.filter(
        character => character.favorite === true
    ).length

    /*
      Calculate the total number of saved relationship entries.
  
      reduce() loops through every character and adds the number
      of relationships stored inside that character.
    */
    const totalRelationships = characters.reduce(
        (total, character) =>
            total + (character.relationships?.length || 0),
        0
    )

    /*
      Calculate the total number of timeline events stored across
      every character in the selected novel.
    */
    const totalTimelineEvents = characters.reduce(
        (total, character) =>
            total + (character.timeline?.length || 0),
        0
    )

    /*
      Calculate how many chapter and scene appearance entries exist.
  
      These entries come from the "Where Used" feature.
    */
    const totalAppearances = characters.reduce(
        (total, character) =>
            total + (character.whereUsed?.length || 0),
        0
    )

    /*
      Create an array containing only valid numeric ages.
    */
    const validAges = characters
        .map(character => {
            // Convert the stored age into a number
            const numericAge = Number(character.age)

            /*
              Return null when the age is empty or not a valid number.
      
              null values will be removed in the next filter step.
            */
            if (
                character.age === undefined ||
                character.age === null ||
                String(character.age).trim() === '' ||
                !Number.isFinite(numericAge)
            ) {
                return null
            }

            return numericAge
        })
        .filter(age => age !== null)

    /*
       Calculate the average age.
  
      If no valid ages exist, display a dash instead of trying
      to divide by zero.
    */
    const averageAge =
        validAges.length > 0
            ? (
                validAges.reduce(
                    (total, age) => total + age,
                    0
                ) / validAges.length
            ).toFixed(1)
            : '—'

    return (
        <section className="statisticsSection">
            {/* Dashboard heading */}
            <div className="statisticsHeader">
                <div>
                    <h2>Novel Overview</h2>

                    <p>
                        Live statistics for{' '}
                        <strong>{selectedNovel.title}</strong>
                    </p>
                </div>

                {/* Shows how many statistics are currently displayed */}
                <span className="statisticsBadge">
                    6 stats
                </span>
            </div>

            {/* Dashboard statistic cards */}
            <div className="statisticsGrid">
                {/* Total characters */}
                <article className="statCard">
                    <span className="statIcon" aria-hidden="true">
                        👥
                    </span>

                    <div>
                        <p className="statLabel">
                            Characters
                        </p>

                        <p className="statValue">
                            {totalCharacters}
                        </p>
                    </div>
                </article>

                {/* Favorite characters */}
                <article className="statCard">
                    <span className="statIcon" aria-hidden="true">
                        ★
                    </span>

                    <div>
                        <p className="statLabel">
                            Favorites
                        </p>

                        <p className="statValue">
                            {favoriteCharacters}
                        </p>
                    </div>
                </article>

                {/* Relationship entries */}
                <article className="statCard">
                    <span className="statIcon" aria-hidden="true">
                        🔗
                    </span>

                    <div>
                        <p className="statLabel">
                            Relationships
                        </p>

                        <p className="statValue">
                            {totalRelationships}
                        </p>
                    </div>
                </article>

                {/* Timeline events */}
                <article className="statCard">
                    <span className="statIcon" aria-hidden="true">
                        🕒
                    </span>

                    <div>
                        <p className="statLabel">
                            Timeline Events
                        </p>

                        <p className="statValue">
                            {totalTimelineEvents}
                        </p>
                    </div>
                </article>

                {/* Chapter and scene appearances */}
                <article className="statCard">
                    <span className="statIcon" aria-hidden="true">
                        📖
                    </span>

                    <div>
                        <p className="statLabel">
                            Appearances
                        </p>

                        <p className="statValue">
                            {totalAppearances}
                        </p>
                    </div>
                </article>

                {/* Average numeric character age */}
                <article className="statCard">
                    <span className="statIcon" aria-hidden="true">
                        #
                    </span>

                    <div>
                        <p className="statLabel">
                            Average Age
                        </p>

                        <p className="statValue">
                            {averageAge}
                        </p>
                    </div>
                </article>
            </div>
        </section>
    )
}

export default StatisticsPanel