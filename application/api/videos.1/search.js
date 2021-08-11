({
  access: 'public',
  method: ({ query, page = 1, count = 10 }) => new Promise(async (resolve) => {
    if (!query || !query.length) {
      return new Error('query parameter is required');
    }
    if(count > 30) {
      return new Error("Max count is 30")
    }
    await db.pg.query(`
        SELECT 
        "title", 
        "host", 
        "source", 
        "thumbnail",
        "updatedAt",
        "description" FROM "Video" 
        WHERE "videoTokens" @@ plainto_tsquery($1)
        ORDER BY ts_rank("videoTokens", plainto_tsquery($1)) DESC
        OFFSET $2 
        LIMIT $3
      `,[query, (page - 1) * count, count])
      .then(result => result.rows)
      .then(resolve)
      
    const allowedSites = {
      'Odnoklassniki': /https?:\/\/ok.ru/,
      'YouTube': 'https://www.youtube.com/watch?v='
    };
    const loadOKThumbnail = (source) => 
      npm.axios(source)
      .then(resp => resp.data)
      .then(body => {
        const searchingText = '<img src="'
        let src = ''
        for (let i = body.search(searchingText) + 10; body[i] != '"'; i++) {
          src += body[i]
        }
        return src.replaceAll(';', '&');
    })
    lib
      .serpmaster
      .search(query)
      .then(response => response[0].content.results.organic)
      .then(items => items.filter(item => {
        for (const [host, url] of Object.entries(allowedSites)) {
          if(
            typeof url === 'string' && item.url.includes(url) || 
            typeof url === 'object' && url.test(item.url)
          ) {
            item.host = host;
            return true;
          }
        } 
      }))
      .then(items => items.map(async item => {
        const { title, desc, host } = item;
        const updatedAt = new Date().toISOString()
        switch(item.host) {
          case "YouTube": {
            const videoId = new URL(item.url).searchParams.get('v')
            return {
              stringId: host.concat("-", videoId),
              title,
              description: desc,
              host,
              source: `https://www.youtube.com/embed/${videoId}`,
              thumbnail: `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              updatedAt,
            }
          }
          case "Odnoklassniki": {
            const { url } = item
            const videoId = url.slice(url.lastIndexOf('/') + 1, url.length);
            const source = `https://ok.ru/videoembed/${videoId}`;
            return {
              stringId: host.concat("-", videoId),
              title,
              host,
              description: desc,
              source,
              thumbnail: await loadOKThumbnail(source),
              updatedAt,
            };
          }
        }
      }))
      .then(promises => Promise.all(promises))
      .then(async results => {
        const scrappedVideoTypeId = await db.pg.col('VideoType', 'videoTypeId', { name: 'Scrapped' }).then(rows => rows[0])
        for (const video of results) {
          const rows = await db.pg.col('Video', 'videoId', { stringId: video.stringId })
          if(rows.length) continue;
          await db.pg.insert("Video", {
            videoTypeId: scrappedVideoTypeId,
            ...video,
          })
          db.pg.query(`UPDATE "Video" video SET "videoTokens" = to_tsvector(video.title) WHERE "stringId" = $1`, [video.stringId])
        }
      })
  })
})