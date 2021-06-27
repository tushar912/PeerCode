module.exports = {
    generateRoom: () => {
      let currentDate = new Date();
      currentDate = String(currentDate);
      currentDate =
        currentDate.slice(8, 10) +
        currentDate.slice(0, 2).toLowerCase() +
        currentDate.slice(16, 18) +
        currentDate.slice(19, 21) +
        currentDate.slice(11, 15) +
        currentDate.slice(4, 6).toLowerCase() +
        currentDate.slice(22, 24) +
        currentDate.slice(6, 7);
      return currentDate;
    } 
  }