async () => {
  console.log(application.worker.id)
  if (application.worker.id === 'W6') {
      // application.scheduler.add({
      //   name: 'Update Kodik Films',
      //   every: '15:54',
      //   run: 'lib.KodikSchedule.updateFilms',
      // }); 
    await domain.kodikdb.update()
    console.log('finished mine')
  }
}