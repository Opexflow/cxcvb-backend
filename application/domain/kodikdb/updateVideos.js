({ url, type, intermediateTime }) => new Promise(async (resolve, reject) => {
  const videoTypeId = await db.pg.col('VideoType', 'videoTypeId', { name: type }).then(rows => rows[0])
  const parser = npm.JSONStream.parse('*')
  const videoQueue = lib.utils.createQueue()
  let isFinished = false;
  const updatedAt = new Date().toISOString()
  videoQueue.setIntermediateTime(intermediateTime)
  videoQueue.onfinish(async () => {
    if(isFinished) {
      await db.pg.query(`DELETE FROM "Video" WHERE "videoTypeId" = $1 AND "updatedAt" != $2`, [videoTypeId, updateAt])
      resolve()
    }
  })
  parser.on('data', video => {
    videoQueue.add(async () => {
      const tableItem = await db.pg.row('Video', ['videoId', 'remoteUpdatedAt'], { stringId: video.id })
      const newItem = {
        stringId: video.id,
        videoTypeId,
        title: video.title,
        description: video.material_data?.description || "",
        host: "Kodik",
        source: video.player_link,
        thumbnail: video.material_data?.poster_url || '/images/not-thumbnail.png',
        updatedAt,
        remoteUpdatedAt: video.updated_at,
      }
      if(tableItem) {
        if(tableItem.remoteUpdatedAt !== video.updated_at) {
           db.pg.update("Video", newItem, {
             stringId: video.stringId,
           })
           await db.pg.query(`UPDATE "Video" video SET "videoTokens" = to_tsvector(video.title || ' ' || COALESCE($2, '')) WHERE "stringId" = $1`, [video.id, video.title_original])
        }
        return;
      }
      await db.pg.insert("Video", newItem)
      await db.pg.query(`UPDATE "Video" video SET "videoTokens" = to_tsvector(video.title || ' ' || COALESCE($2, '')) WHERE "stringId" = $1`, [video.id, video.title_original])
    })
  })
  parser.on('end', () => isFinished = true)
  node.https.get(url, res => res.pipe(parser))
})
  
