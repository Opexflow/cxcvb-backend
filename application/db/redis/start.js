async () => {
  if (application.worker.id === 'W1') {
    console.debug('Connect to redis');
  }
  const client = npm.redis.createClient();
  const publisher = npm.redis.createClient()
  const subscriber = npm.redis.createClient()
  db.redis.client = client;
  db.redis.publisher = publisher;
  db.redis.subscriber = subscriber;
  client.on('error', () => {
    if (application.worker.id === 'W1') {
      console.warn('No redis service detected, so quit client');
    }
    client.quit();
    publisher.quit();
  });
};
