({
  access:"public",
  method() {
    if(!context.client.shareURLData) return new Error("You must start listening for accessing devices")
    const network = domain.shareURL.networks.get(context.client.ip)
    return Array.from(network)
      .filter(client => client !== context.client)
      .map(client => client.shareURLData)
  }
})