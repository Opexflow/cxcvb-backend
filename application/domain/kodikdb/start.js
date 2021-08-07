async () => {
  console.log(application.worker.id)
  if (application.worker.id === 'W6') {
      application.scheduler.add({
        name: 'Update Kodik Films',
        every: '00:00',
        run: 'domain.kodikdb.update',
      }); 
    // await domain.kodikdb.update()
  }
}