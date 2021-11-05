({
  access: "public",
  async method({ type: videoType = "all" }) {
    let videoTypeId = -1;
    if (videoType !== "all") {
      const videoTypeIdResp = await db.pg.row("VideoType", ["videoTypeId"], { name: videoType })
      if (!videoTypeIdResp) return new Error("Type not found")
      videoTypeId = videoTypeIdResp.videoTypeId
    }
    return db.pg.query(`
      SELECT       
        "videoId",
        "title",
        "host",
        "source",
        "thumbnail",
        "description"
      FROM "Video" 
      WHERE ($1 = -1 OR "videoTypeId" = $1)
      ORDER BY RANDOM() 
      LIMIT 1
    `, [videoTypeId]).then(result => result.rows[0])
  }
})