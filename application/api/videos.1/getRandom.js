({
  access: "public",
  async method({ type: videoType = "all", locale }) {
    let videoTypeId = -1;
    if (videoType !== "all") {
      const videoTypeIdResp = await db.pg.row("VideoType", ["videoTypeId"], { name: videoType })
      if (!videoTypeIdResp) return new Error("Type not found")
      videoTypeId = videoTypeIdResp.videoTypeId
    }
    return db.pg.query(`
      WITH video AS (
        SELECT "videoId", "videoTypeId", "host", "source", "thumbnail", title, description FROM "Video"
      ),
      translation AS (
        SELECT "videoId", "title", "description", "locale" FROM "VideoTranslation"
        WHERE locale = $2
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
      WHERE ($2 IS NULL OR translation.locale = $2) AND ($1 = -1 OR video."videoTypeId" = $1)
      ORDER BY RANDOM() 
      LIMIT 1
    `, [videoTypeId, locale]).then(result => result.rows[0])
  }
})