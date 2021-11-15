({
  networks: new Map(),
  getNetwork(ip) {
    let network = domain.shareURL.networks.get(ip);
    if (network) return network;
    network = new Set();
    domain.shareURL.networks.set(ip, network);
    return network;
  },
})