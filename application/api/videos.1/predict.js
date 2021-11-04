// TODO: Change name of file to suggest.js
({
  access: "public",
  method: async ({ query }) => {
    if(typeof query !== "string") return new Error("query parameter must be a string")
    if (query.length > 150) return new Error("Maximum length of query is 50")
    return db.pg
      .query(`SELECT DISTINCT "title" FROM "Video" WHERE lower(title) LIKE lower($1) LIMIT 10`, [`%${query}%`])
      .then(result => result.rows)
  }
})
