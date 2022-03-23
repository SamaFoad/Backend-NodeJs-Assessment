export const toHHMMSS = (seconds: number): string => {
    seconds = parseInt(seconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = seconds - hours * 3600 - minutes * 60;
    let hoursString: string;
    let minutesString: string;
    let secondsString: string;
    if (hours < 10) {
      hoursString = '0' + hours;
    } else {
      hoursString = hours.toString();
    }
    if (minutes < 10) {
      minutesString = '0' + minutes;
    } else {
      minutesString = minutes.toString();
    }
    if (seconds < 10) {
      secondsString = '0' + seconds;
    } else {
      secondsString = seconds.toString();
    }
    return hoursString + ':' + minutesString + ':' + secondsString;
  };

export const getDateTimeNow = () => {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  return dateTime;
};

export const getDateNow = () => {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  return date;
};
  