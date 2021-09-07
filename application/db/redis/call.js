(methodName, ...args) => new Promise((resolve, reject) => {
  db.redis.client[methodName](...args, (err, data) => {
    if(err) reject(err)
    else resolve(data)
  })
})