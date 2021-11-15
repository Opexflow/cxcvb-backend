({
  access: 'public',
  method: async ({ query, page = 1, count = 10, type: videosType = "all", locale }) => {
    const validation = metarhia.metaschema.Schema.from({
      query: { type: 'string', length: 150 },
      page: { type: "number" },
      count: { type: "number" },
      videosType: "string"
    }).check({ query, page, count, videosType })
    if (!validation.valid) return new Error(validation.errors)
    if (count > 30) return new Error("Maximum count is 30")
    if (count < 1) return new Error("Minimum count is 1")

    let videosTypeId = -1;
    if (videosType !== "all") {
      const videosTypeIdResp = await db.pg.row("VideoType", ["videoTypeId"], { name: videosType })
      if (!videosTypeIdResp) return new Error("Type not found")
      videosTypeId = videosTypeIdResp.videoTypeId
    }

    const resultColumns = [
      "videoId",
      "title",
      "host",
      "source",
      "thumbnail",
      "description"
    ].map(colName => `"${colName}"`).join(",")

    const addScore = (video) => db.pg.query(`UPDATE "Video" SET score = score + 1 WHERE "videoId" = $1`, [video.videoId])
    //${resultColumns}
    const FTSDBResult = await db.pg.query(`
      WITH video AS (
        SELECT "videoId", "videoTokens", "videoTypeId", "host", "source", "thumbnail", title, description FROM "Video"
      ),
      translation AS (
        SELECT "videoId", "title", "description", "locale" FROM "VideoTranslation"
        WHERE locale = $5
      )
      SELECT 
        video."videoId",
        COALESCE(translation.title, video.title) as title,
        COALESCE(translation.description, video.description) as description,
        "host",
        "source",
        "thumbnail"
      FROM video
      FULL OUTER JOIN translation ON translation."videoId" = video."videoId"
      WHERE 
        ($5 IS NULL OR translation.locale = $5) AND 
        ($4 = -1 OR video."videoTypeId" = $4) AND
        video."videoTokens" @@ plainto_tsquery($1)
      ORDER BY ts_rank(video."videoTokens", plainto_tsquery($1)) DESC
      OFFSET $2 
      LIMIT $3
    `, [query, (page - 1) * count, count, videosTypeId, locale])
      .then(results => results.rows)
    if (FTSDBResult.length) {
      //FTSDBResult.scrapnet()
      FTSDBResult.forEach(addScore)
      return FTSDBResult
    }
    if (page != 1) return []
    const LSDBResult = await db.pg.query(`
      WITH video AS (
        SELECT "videoId", "videoTokens", "videoTypeId", "host", "source", "thumbnail", title, description 
        FROM "Video"
      ),
      translation AS (
        SELECT "videoId", "title", "description", "locale" FROM "VideoTranslation"
        WHERE locale = $4
      )
      SELECT 
        video."videoId",
        COALESCE(translation.title, video.title) as title,
        COALESCE(translation.description, video.description) as description,
        "host",
        "source",
        "thumbnail"
      FROM video
      FULL OUTER JOIN translation ON translation."videoId" = video."videoId"
      WHERE
        ($4 IS NULL OR translation.locale = $4) AND 
        ($3 = -1 OR video."videoTypeId" = $3) AND
        lower(COALESCE(translation.title, video.title)) LIKE lower($1)
      LIMIT $2
    `, [`%${query}%`, count, videosTypeId, locale]).then(results => results.rows)
    if (LSDBResult.length) {
      //domain.scrapnet()
      LSDBResult.forEach(addScore)
      return LSDBResult
    }
    // return domain.scrapnet()
    return []
  }
})