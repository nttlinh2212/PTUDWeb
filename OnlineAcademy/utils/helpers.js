const numeral = require('numeral');
const moment = require('moment');
module.exports = {
    getCurrency(val) {
        return numeral(val).format('0,0') + ' Đ';
    },
    getStar(star1, star2, star3, star4, star5) {
        return Math.round((star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5) / (star1 + star2 + star3 + star4 + star5));
    },
    getTotalRatings(star1, star2, star3, star4, star5) {
        return (star1 + star2 + star3 + star4 + star5);
    },
    getDate(datetime) {
        return moment(datetime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    },
    getMySQLDateTime(jsdate) {
        return moment(jsdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    },
    getMySQLDateTime1(jsdate) {
        return moment(jsdate, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss');
    },
    getTime(seconds) {
        seconds = +Math.round(seconds);
        //console.log(seconds, moment.duration(seconds, 'seconds').format("hh:mm:ss"));
        var date = new Date(0);
        date.setSeconds(seconds); // specify value for SECONDS here
        var timeString = date.toISOString().substr(11, 8);
        console.log(timeString)
        return timeString;
        //moment.duration(seconds, 'seconds').format("hh:mm:ss");
    },
    getSecond(time) {
        return moment.duration(time).asSeconds();
    },
    getDayLeft(end) {
        start = new Date();
        end = new Date(end);
        s = moment(start, 'YYYY-MM-DD HH:mm:ss');
        e = moment(end, 'YYYY-MM-DD HH:mm:ss');
        // console.log(s,e);
        const days = Math.floor(moment.duration(e.diff(s)).asDays());
        console.log(days+'dàyleft');
        return days;
    }
};