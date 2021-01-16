function calculateDurationInDays(startDate, endDate){
    var duration = new Date(endDate).getTime() - new Date(startDate).getTime();
    return parseInt(duration /  (1000 * 3600 * 24))
  }

  export {calculateDurationInDays}