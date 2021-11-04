async () => {
  if (application.worker.id === 'W6') {
      const itemsCount = await db.pg.query(`SELECT COUNT('videoId') FROM "Video"`)
      if(itemsCount.rows[0].count === "0") {
        await domain.kodikdb.update({ intermediateTime: 50 })
      }
      application.scheduler.add({
        name: 'Update Kodik Films',
        every: '00:00',
        run: 'domain.kodikdb.update',
        args: { intermediateTime: 1500 }
      }); 
  }
}
