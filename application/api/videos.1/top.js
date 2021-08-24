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
    .desc('score')
    .limit(20)
})
