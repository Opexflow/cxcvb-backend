({
  access: 'public',
  method: ({ query, page = 1, count = 10 }) => {
    const validation = metarhia.metaschema.Schema.from({
      query: { type: 'string', length: 100 },
      page: { type: "number" },
      count: { type: "number" },
    }).check({ query, page, count })
    if (!validation.valid) return new Error(validation.errors)
    if (count > 30) return new Error("Maximum count is 30")
    if (count < 1) return new Error("Minimum count is 1")
    return db.pg.query(`
      SELECT 
      "title", 
      "host", 
      "source", 
      "thumbnail",
      "description" FROM "Video" 
      WHERE "videoTokens" @@ plainto_tsquery($1)
      ORDER BY ts_rank("videoTokens", plainto_tsquery($1)) DESC
      OFFSET $2 
      LIMIT $3
    `, [query, (page - 1) * count, count])
      .then(result => {
        if(result.rows.length) {
          domain.scrapnet(query)
          return result.rows
        }
        return domain.scrapnet(query)
      })
  }
})