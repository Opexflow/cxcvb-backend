({
  access:'public',
  method: async ({ deviceName }) => {
    const networkName = `client-LAN/${metarhia.metautil.ipToInt(context.client.ip)}`;
    const connectionId = npm.uuid.v4();
    const connections = await db.redis.get(networkName).then(lib.utils.toJSON) || []
    context.client.shareURL = { connectionId }
    connections.push({
      id: connectionId,
      deviceName: Date.now().toString(16) + " " + deviceName
    })
    await db.redis.set(networkName, JSON.stringify(connections))
    
    db.redis.subscriber.on('message', (channel, message) => {
      if(channel !== 'shareURL/share') return;
      const messageJSON = JSON.parse(message)
      if(messageJSON.connectionId === connectionId) {
        context.client.emit("shareURL/share", messageJSON.URL)
      }
    })
    db.redis.subscriber.subscribe("shareURL/share")

    context.client.on('close', () => {
      db.redis.get(networkName)
        .then(lib.utils.toJSON)
        .then(connections => connections ? connections.filter(connection => connection.id !== connectionId) : [])
        .then(connections => {
          if(connections.length) {
            db.redis.set(networkName, JSON.stringify(connections))
          } else db.redis.client.del(networkName)
        })  
    })

    return { subscribed: "shareURL/share" }
  }
})