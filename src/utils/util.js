const moment = require('moment');

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const convertTo24Hour = (timeString) => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
};

const timeString = () => {
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const sleep = async (seconds) => {
  let ms = seconds * 100;
  await new Promise((resolve) => setTimeout(() => resolve(), ms));
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const sumQtyDay = (qtyDay) => {
  const date = new Date();
  date.setDate(date.getDate() + qtyDay);
  return date.toISOString().split("T")[0];
};

const businessWeek = () => {
  const data = new Date();
  const weekend = [0, 6]; // 0 - domingo e 6 - sabado
  return !weekend.includes(data.getDay());
};

const daysOfWeek = () => {
    const data = new Date();
    const weekend = [1]
    return !weekend.includes(data.getDay())
}
const stringToArray = (input) => {
  if (typeof input === "string") {
    return [input];
  } else {
    return input;
  }
}
const isEmptyObject = (value) => {
    if (value == null) {
      return false;
    }
}
const isHasOwnProperty = (object, param) => {
    return !isEmptyObject(object) && Object.prototype.hasOwnProperty.call(object, param); 
  }

const nextWeekStart = () => {
    const date =  moment().add(1, 'week').startOf('week');
    return date.format('YYYY-MM-DD')
  }
const nextWeekEnd = () => {
    const date =  moment().add(1, 'week').endOf('week');
    return date.format('YYYY-MM-DD')
  }

module.exports = {
    timeToMinutes,
    nextWeekStart,
    nextWeekEnd,
    convertTo24Hour,
    timeString,
    daysOfWeek,
    sleep,
    sumQtyDay,
    businessWeek,
    delay,
    isHasOwnProperty,
    stringToArray
}