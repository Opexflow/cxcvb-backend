(query) => {
  const allowedSites = {
    'Odnoklassniki': /https?:\/\/ok.ru/,
    'YouTube': 'https://www.youtube.com/watch?v='
  };
  function seperateTime(text) {
    const timeMatch = text.match(/^\d\d?:\d\d?/)
    if(!timeMatch) return text 
    return timeMatch[0] + " " + text.slice(timeMatch[0].length)
  }
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
  return lib
    .serpmaster
    .search(query)
    .then(response => response[0].content.results.organic)
    .then(items => items.filter(item => {
      for (const [host, url] of Object.entries(allowedSites)) {
        if (
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
      const genericVideoData = { title, host, description: seperateTime(desc), updatedAt }
      switch (item.host) {
        case "YouTube": {
          const videoId = new URL(item.url).searchParams.get('v')
          return {
            ...genericVideoData,
            stringId: host.concat("-", videoId),
            source: `https://www.youtube.com/embed/${videoId}`,
            thumbnail: `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          }
        }
        case "Odnoklassniki": {
          const { url } = item
          const videoId = url.slice(url.lastIndexOf('/') + 1, url.length);
          const source = `https://ok.ru/videoembed/${videoId}`;
          return {
            ...genericVideoData,
            stringId: host.concat("-", videoId),
            source,
            thumbnail: await loadOKThumbnail(source),
          };
        }
      }
    }))
    .then(promises => Promise.all(promises))
    .then(async results => {
      const scrappedVideoTypeId = await db.pg.col('VideoType', 'videoTypeId', { name: 'Scrapped' }).then(rows => rows[0])
      for (const video of results) {
        const rows = await db.pg.col('Video', 'videoId', { stringId: video.stringId })
        if (rows.length) continue;
        await db.pg.insert("Video", {
          videoTypeId: scrappedVideoTypeId,
          ...video,
        })
        db.pg.query(`UPDATE "Video" video SET "videoTokens" = to_tsvector(video.title) WHERE "stringId" = $1`, [video.stringId])
      }
      return results
    })
}