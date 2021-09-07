({
  access: 'public',
  method: async ({ query, page = 1, count = 10 }) => {
    const validation = metarhia.metaschema.Schema.from({
      query: { type: 'string', length: 150 },
      page: { type: "number" },
      count: { type: "number" },
    }).check({ query, page, count })
    if (!validation.valid) return new Error(validation.errors)
    if (count > 30) return new Error("Maximum count is 30")
    if (count < 1) return new Error("Minimum count is 1")

    const addScore = (video) => db.pg.query(`UPDATE "Video" SET score = score + 1 WHERE "videoId" = $1`, [video.videoId])

    const FTSDBResult = await db.pg.query(`
      SELECT 
        "videoId",
        "title", 
        "host", 
        "source", 
        "thumbnail",
        "description" 
      FROM "Video" 
      WHERE "videoTokens" @@ plainto_tsquery($1)
      ORDER BY ts_rank("videoTokens", plainto_tsquery($1)) DESC
      OFFSET $2 
      LIMIT $3
    `, [query, (page - 1) * count, count])
      .then(results => results.rows)
    if (FTSDBResult.length) {
      //FTSDBResult.scrapnet()
      FTSDBResult.forEach(addScore)
      return FTSDBResult
    }
    if (page != 1) return []
    const LSDBResult = await db.pg.query(`
      SELECT
        "videoId",
        "title", 
        "host", 
        "source", 
        "thumbnail",
        "description"
      FROM "Video"
      WHERE lower(title) LIKE lower($1)
      LIMIT 12
    `, [`%${query}%`]).then(results => results.rows)
    if (LSDBResult.length) {
      //domain.scrapnet()
      LSDBResult.forEach(addScore)
      return LSDBResult
    }
    // return domain.scrapnet()
    return []
  }
})