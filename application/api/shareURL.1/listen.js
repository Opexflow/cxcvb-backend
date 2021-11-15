({
  access: "public",
  method({ name }) {
    context.client.shareURLData = { name, id: Date.now() + metarhia.metautil.random(1, 10) }
    const network = domain.shareURL.getNetwork(context.client.ip)
    for(const client of network) {
      client.emit("shareURL/connected", context.client.shareURLData)
    }
    network.add(context.client)
    context.client.on('close', () => {
      network.delete(context.client);
      for(const client of network) {
        client.emit("shareURL/disconnected", context.client.shareURLData)
      }
    });
    return 'ok';
  }
})