({
  access:'public',
  method: async ({ deviceName }) => {
    const networkName = `client-LAN/${metarhia.metautil.ipToInt(context.client.ip)}`;
    const connectionId = npm.uuid.v4();
    const connections = await db.redis.get(networkName).then(lib.utils.toJSON) || []
    connections.push({
      id: connectionId,
      deviceName: Date.now().toString(16) + " " + deviceName
    })
    await db.redis.set(networkName, JSON.stringify(connections))
    
    db.redis.subscriber.on('message', (channel, message) => {
      if(channel !== 'shareURL/share') return;
      const connection = JSON.parse(message)
      if(connection.id === connectionId) {
        context.client.emit("shareURL/share", messageJSON.URL)
      }
    })
    db.redis.subscriber.subscribe("shareURL/share")

    context.client.on('close', () => {
      db.redis.get(networkName)
        .then(lib.utils.toJSON)
        .then(connections => connections ? connections.filter(connection => connection.id !== connectionId) : [])
        .then(connections => db.redis.set(networkName, JSON.stringify(connections)))  
    })

    return { subscribed: "shareURL/share" }
  }
})