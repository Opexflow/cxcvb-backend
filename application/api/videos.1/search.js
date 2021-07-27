({
  access: 'public',
  method: async ({ query }) => {
    if (!query || !query.length) {
      return new Error('query parameter is required');
    }
    const cached = await lib.redis.get(`videos/search/${query}`);
    if (cached) {
      return JSON.parse(cached);
    }
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
    return await lib
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
        switch(item.host) {
          case "YouTube": {
            const videoId = new URL(item.url).searchParams.get('v')
            return {
              title,
              description: desc,
              host,
              source : `https://www.youtube.com/embed/${videoId}`,
              thumbnail: `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            }
          }
          case "Odnoklassniki": {
            const { url } = item
            const videoId = url.slice(url.lastIndexOf('/') + 1, url.length);
            const source = `https://ok.ru/videoembed/${videoId}`;
            return {
              title,
              host,
              description: desc,
              source,
              thumbnail: await loadOKThumbnail(source)
            };
          }
        }
      }))
      .then(promises => Promise.all(promises))
      .then(async results => {
        lib.redis.set(`videos/search/${query}`, JSON.stringify(results))
        return results;
      })
  }
})