({
  Entity: {},
  stringId: { type: 'string', unique: true },
  videoType: "VideoType",
  title: { type:'string' },
  description: { type:"string", required: false },
  host: 'string',
  source: 'string',
  thumbnail: { type: "string", required: false },
  score: 'number',
  updatedAt: 'string',
  remoteUpdatedAt: { type: 'string', required: false },
})