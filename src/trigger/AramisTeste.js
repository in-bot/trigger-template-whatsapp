const util = require("../utils/util")

async function triggerRulesAramisTestes() {

    const timeString = util.timeString();
    const timeIn24HourFormat = util.convertTo24Hour(timeString);
    
    let comparisonTime = "09:00"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "09:30"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "10:00"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "10:30"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "11:00"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "11:30"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "12:00"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "12:30"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "13:00"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
    comparisonTime = "13:30"; //HORARIO CORRETO   
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
}

module.exports = triggerRulesAramisTestes;
