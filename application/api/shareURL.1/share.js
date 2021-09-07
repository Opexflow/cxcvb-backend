({
  access: "public",
  method: ({ connectionId, URL }) => {
    db.redis.publisher.publish("shareURL/share", JSON.stringify({ connectionId, URL }))
  }
})