({ url, type }) => new Promise(async (resolve, reject) => {
  const searialTypeId = await db.pg.col('VideoType', 'videoTypeId', { name: type }).then(rows => rows[0])
  const parser = npm.JSONStream.parse('*')

  let isFinished = false;
  let unfinished = 0;

  const finishIfEnd = () => {
    if(isFinished && unfinished < 1) {
      resolve()
    }
  }

  parser.on('data', async video => {
    unfinished++;
    const rows = await db.pg.col('Video', 'videoId', { stringId: video.id })
    if(rows.length)  {
      return unfinished-- && finishIfEnd();
    };
    await db.pg.insert("Video", {
      stringId: video.id,
      videoTypeId: searialTypeId,
      title: video.title,
      title_original: video.title_orig,
      description: video.material_data?.description || "",
      host: "Kodik",
      source: video.player_link,
      thumbnail: video.material_data?.poster_url || '/images/not-thumbnail.png',
    })
    await db.pg.query(`UPDATE "Video" video SET "videoTokens" = to_tsvector(video.title || ' ' || video.title_original) WHERE "stringId" = $1`, [video.id])
    unfinished--;
    finishIfEnd()
  })

  parser.on('end', () => isFinished = true)

  node.https.get(url, res => {
    res.pipe(parser)
  })
})
  