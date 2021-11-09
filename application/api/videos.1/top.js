({
  access: "public",
  method: ({ locale }) => {
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
          video."videoId" = translation."videoId" AND 
          translation.locale = $1
        ORDER BY "score" DESC
        LIMIT 20
    `, [locale]).then(result => result.rows)
      : db.pg.select("Video", [
        "videoId",
        "title",
        "description",
        "host",
        "source",
        "thumbnail"
      ])
        .desc('score')
        .limit(20)
  }
})
