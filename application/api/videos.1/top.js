({
  access: "public",
  method: () => db.pg.select("Video", [
      "videoId", 
      "title",
      "description",
      "host",
      "source", 
      "thumbnail" 
    ])
    .order('score')
    .limit(20)
})