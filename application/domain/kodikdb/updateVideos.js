({ url, type, intermediateTime }) => new Promise(async (resolve, reject) => {
  const videoTypeId = await db.pg.col('VideoType', 'videoTypeId', { name: type }).then(rows => rows[0])
  const parser = npm.JSONStream.parse('*')
  const videoQueue = lib.utils.createQueue()
  let isFinished = false;
  videoQueue.setIntermediateTime(intermediateTime)
  videoQueue.onfinish(async () => {
    await db.pg.query(`REINDEX INDEX "videoTokensIdx"`)
    if(isFinished) resolve()
  })
  parser.on('data', video => {
    videoQueue.add(async () => {
      const rows = await db.pg.col('Video', 'videoId', { stringId: video.id })
      if(rows.length) return;
      await db.pg.insert("Video", {
        stringId: video.id,
        videoTypeId,
        title: video.title,
        title_original: video.title_orig || video.title,
        description: video.material_data?.description || "",
        host: "Kodik",
        source: video.player_link,
        thumbnail: video.material_data?.poster_url || '/images/not-thumbnail.png',
      })
      await db.pg.query(`UPDATE "Video" video SET "videoTokens" = to_tsvector(video.title || ' ' || video.title_original) WHERE "stringId" = $1`, [video.id])
    })
  })
  parser.on('end', () => isFinished = true)
  node.https.get(url, res => res.pipe(parser))
})
  