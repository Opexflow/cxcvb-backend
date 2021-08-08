async () => {
  console.log(application.worker.id)
  if (application.worker.id === 'W6') {
      const itemsCount = await db.pg.query(`SELECT COUNT('videoId') FROM "Video"`)
      if(itemsCount.rows[0].count == 0) {
        await domain.kodikdb.update({ intermediaTime: 0 })
      }
      application.scheduler.add({
        name: 'Update Kodik Films',
        every: '00:00',
        run: 'domain.kodikdb.update',
        args: { intermediaTime: 1500 }
      }); 
  }
}