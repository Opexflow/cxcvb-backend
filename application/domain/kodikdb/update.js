async ({ intermediateTime }) => {
  await domain.kodikdb.updateVideos({
    url: 'https://dumps.kodik.biz/serials.json',
    type: 'Serial',
    intermediateTime,
  })

  await domain.kodikdb.updateVideos({
    url: 'https://dumps.kodik.biz/films.json',
    type: 'Movie',
    intermediateTime,
  })
}