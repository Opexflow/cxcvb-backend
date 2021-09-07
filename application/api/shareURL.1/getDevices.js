({
  access: "public", 
  method: () => {
    const networkName = `client-LAN/${metarhia.metautil.ipToInt(context.client.ip)}`;
    return db.redis.get(networkName)
      .then(connections => connections ? JSON.parse(connections) : [])
      .then(connections => connections.filter(connection => connection.id != context.client.shareURL.connectionId))
  }
})