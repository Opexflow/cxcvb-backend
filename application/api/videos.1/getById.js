({
  access:"public",
  method: ({ videoId }) => db.pg.row("Video", ["videoId", "title", "description", "host", "source", "thumbnail" ], { videoId })
})