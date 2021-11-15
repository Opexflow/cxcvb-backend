({
  access: "public",
  method: ({ videoId, locale }) => {
    return locale ?
      db.pg.query(`
        SELECT 
          video."videoId", 
          video.source,
          video.host,
          video.thumbnail,
          translation.title,
          translation.description
        FROM 
          "Video" as video,
          "VideoTranslation" as translation
        WHERE
          video."videoId" = $1 AND
          video."videoId" = translation."videoId" AND 
          translation.locale = $2
    `, [videoId, locale]).then(result => result.rows[0])
      : db.pg.row("Video", [
        "videoId",
        "title",
        "description",
        "host",
        "source",
        "thumbnail"
      ], { videoId })
  }
})