({
  access: "public",
  method: async ({ query }) => {
    if(typeof query !== "string") throw new Error("query parameter must be a string")
    return db.pg
      .query(`SELECT DISTINCT "title" FROM "Video" WHERE title LIKE $1 LIMIT 10`, [`%${query}%`])
      .then(result => result.rows)
  }
})
