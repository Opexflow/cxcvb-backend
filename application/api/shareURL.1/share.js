({
  access: "public",
  method({ id, url }) {
    const network = domain.shareURL.networks.get(context.client.ip)
    for(const client of network) {
      if(client.shareURLData.id === id) {
        client.emit('shareURL/share', { url });
      }
    }
  }
})