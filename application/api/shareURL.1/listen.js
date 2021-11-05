({
  access: "public",
  method({ name }) {
    context.client.shareURLData = { name, id: Date.now() + metarhia.metautil.random(1, 10) }
    const network = domain.shareURL.getNetwork(context.client.ip)
    network.add(context.client)
    context.client.on('close', () => {
      network.delete(context.client);
    });
    return 'ok';
  }
})