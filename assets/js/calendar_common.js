var calendarCommon = {
  CALENDAR_TYPE_LIST: 1,
  CALENDAR_TYPE_GRID: 2,
  CALENDAR_TYPE_DATE: 3,

  EVENT_APPLY_STATUS_NONE: 0,
  EVENT_APPLY_STATUS_UPCOMING: 1,
  EVENT_APPLY_STATUS_WANTED: 2,
  EVENT_APPLY_STATUS_FINISH_SOON: 3,
  EVENT_APPLY_STATUS_FINISHED_RECENTLY: 4,
  EVENT_APPLY_STATUS_FINISHED: 5,

  ICON_TYPE_IMAGE: 1,
  ICON_TYPE_CSS: 2,

  getCalendarMonthDates: function (year, month) {
    let rlt = [];
    let firstDate = new Date(year, month - 1, 1);
    let day = firstDate.getDay()
    if (day > 0) {
      let mTmp = this.getPrevMonthDate(year, month);
      let pYear = mTmp.getFullYear();
      let pMonth = mTmp.getMonth() + 1;
      let monthLastMDate = this.getMonthLastMday(pYear, pMonth);
      for (let i = day - 1; i >= 0; i--) {
        let dTmp = this.convertDate2String(new Date(pYear, pMonth - 1, monthLastMDate - i));
        rlt.push({
          "str": dTmp,
          "num": monthLastMDate - i
        });
      }
    }
    let monthLastMDate = this.getMonthLastMday(year, month);
    for (let i = 1; i <= monthLastMDate; i++) {
      let dTmp = this.convertDate2String(new Date(year, month - 1, i));
      rlt.push({
        "str": dTmp,
        "num": i
      });
    }
    let err = rlt.length % 7;
    if (err > 0) {
      let mTmp = this.getNextMonthDate(year, month);
      let nYear = mTmp.getFullYear();
      let nMonth = mTmp.getMonth() + 1;
      for (let i = 0; i < 7 - err; i++) {
        let dTmp = this.convertDate2String(new Date(nYear, nMonth - 1, i + 1));
        rlt.push({
          "str": dTmp,
          "num": i + 1
        });
      }
    }
    return rlt;
  },

  convertDate2String: function (date) {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    let tmp = date.toISOString();
    let rlt = tmp.split('T')[0];
    rlt = rlt.replace(':', '-');
    rlt = rlt.replace('/', '-');
    return rlt;
  },

  getNextDateStr: function (dateStr) {
    let date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return this.convertDate2String(date);
  },

  getPrevMonthDate: function (year, month) {
    if (month <= 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
    return new Date(year, month - 1, 1);
  },

  getNextMonthDate: function (year, month) {
    if (month >= 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    return new Date(year, month - 1, 1);
  },

  getMonthLastMday: function (year, month) {
    var monthDates = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var lastMday = monthDates[month - 1];
    if (month == 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) {
      lastMday = 29;
    }
    return lastMday;
  },

  getHolidayName: function (year, month, mday) {
    var datetime = new Date(year, month - 1, mday);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var mday = datetime.getDate();
    var wday = datetime.getDay();
    var name = this.getHolidayNameMain(year, month, mday, wday);
    if (name) {
      return name;
    }
    // 国民の休日チェック ※2021年対応
    var prevDatetime = new Date(datetime);
    prevDatetime.setDate(prevDatetime.getDate() - 1);
    var prevName = this.getHolidayNameMain(prevDatetime.getFullYear(), prevDatetime.getMonth() + 1, prevDatetime.getDate(), prevDatetime.getDay());
    var nextDatetime = new Date(datetime);
    nextDatetime.setDate(nextDatetime.getDate() + 1);
    var nextName = this.getHolidayNameMain(nextDatetime.getFullYear(), nextDatetime.getMonth() + 1, nextDatetime.getDate(), nextDatetime.getDay());
    if (prevName && nextName) {
      return '国民の休日';
    }

    // 振替休日チェック
    var targetDatetime = new Date(datetime);
    for (var i = 1; i < 7; i++) {
      targetDatetime.setDate(targetDatetime.getDate() - 1);
      if (!this.getHolidayNameMain(targetDatetime.getFullYear(), targetDatetime.getMonth() + 1, targetDatetime.getDate(), targetDatetime.getDay())) {
        break;
      }
      if (wday == i) {
        return '振替休日';
      }
    }
    return false;
  },

  getHolidayNameMain: function (year, month, mday, wday) {
    var stdHolidays = [["1-1", null, null, "元日"], ["1-15", 1948, 1999, "成人の日"], ["2-11", 1967, null, "建国記念の日"], ["4-29", 1948, 1988, "天皇誕生日"], ["4-29", 1989, 2006, "みどりの日"], ["4-29", 2007, null, "昭和の日"], ["5-1", 2019, 2019, "天皇の即位の日"], ["5-3", 1948, null, "憲法記念日"], ["5-4", 2007, null, "みどりの日"], ["5-5", 1948, null, "こどもの日"], ["7-20", 1996, 2002, "海の日"], ["7-23", 2020, 2020, "海の日"], ["7-22", 2021, 2021, "海の日"], ["7-24", 2020, 2020, "スポーツの日"], ["7-23", 2021, 2021, "スポーツの日"], ["8-10", 2020, 2020, "山の日"], ["8-8", 2021, 2021, "山の日"], ["8-11", 2016, 2019, "山の日"], ["8-11", 2022, null, "山の日"], ["9-15", 1948, 2002, "敬老の日"], ["10-10", 1966, 1999, "体育の日"], ["11-3", 1948, null, "文化の日"], ["11-23", 1948, null, "勤労感謝の日"], ["10-22", 2019, 2019, "即位礼正殿の儀"], ["12-23", 1989, 2018, "天皇誕生日"], ["2-23", 2020, null, "天皇誕生日"]];
    var mondayHolidays = [["1-2", 2000, null, "成人の日"], ["7-3", 2003, 2019, "海の日"], ["7-3", 2022, null, "海の日"], ["9-3", 2003, null, "敬老の日"], ["10-2", 2000, 2019, "体育の日"], ["10-2", 2022, null, "スポーツの日"]];

    var monthdate = month + '-' + mday;
    for (var i = 0; i < stdHolidays.length; i++) {
      var def = stdHolidays[i];
      if (def[0] == monthdate && (def[1] == null || year >= def[1]) && (def[2] == null || year <= def[2])) {
        return def[3];
      }
    }

    if (wday == 1) {
      var monthweek = month + '-' + (Math.floor((mday - 1) / 7) + 1);
      for (var i = 0; i < mondayHolidays.length; i++) {
        var def = mondayHolidays[i];
        if (def[0] == monthweek && (def[1] == null || year >= def[1]) && (def[2] == null || year <= def[2])) {
          return def[3];
        }
      }
    }

    if (month == 3 && mday == this.getShunbunDay(year)) {
      return '春分の日';
    }
    if (month == 9 && mday == this.getShuubunDay(year)) {
      return '秋分の日';
    }
    return false;
  },

  // 春分の日
  getShunbunDay: function (year) {
    return Math.floor(20.8431 + 0.242194 * (year - 1980)) - Math.floor((year - 1980) / 4);
  },

  // 秋分の日
  getShuubunDay: function (year) {
    return Math.floor(23.2488 + 0.242194 * (year - 1980)) - Math.floor((year - 1980) / 4);
  },

  getJPYear: function (year, month) {
    var result = this.getJPYearMain(year, month, null);
    return result[1];
  },

  getJPYearPrefix: function (year, month) {
    var result = this.getJPYearMain(year, month, null);
    return result[0];
  },

  getJPYearMain: function (year, month, mday) {
    var jpEraTable = { "令和": { "year": 2019, "month": 5, "mday": 1 }, "平成": { "year": 1989, "month": 1, "mday": 8 }, "昭和": { "year": 1926, "month": 12, "mday": 25 }, "大正": { "year": 1912, "month": 7, "mday": 30 }, "明治": { "year": 1868, "month": 1, "mday": 25 } };

    jpYear = year;
    era = '';
    for (key in jpEraTable) {
      var def = jpEraTable[key];
      if (year > def['year'] || (year == def['year'] && (month > def['month'] || (month == def['month'] && (mday == null || mday >= def['mday']))))) {
        jpYear = year - def['year'] + 1;
        era = key;
        break;
      }
    }
    if (era && jpYear == 1) {
      jpYear = '元';
    }
    return [era, jpYear];
  },

  createDateString: function (year, month, mday) {
    return ('0000' + year).substr(-4) + '-' + ('00' + month).substr(-2) + '-' + ('00' + mday).substr(-2);
  },

  getDateDiff: function (dateStr1, dateStr2) {
    var dateArray1 = dateStr1.split('-');
    var dateArray2 = dateStr2.split('-', 3);
    var date1 = new Date(dateArray1[0], dateArray1[1] - 1, dateArray1[2]);
    var date2 = new Date(dateArray2[0], dateArray2[1] - 1, dateArray2[2]);

    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  },

  showLoadingDialog: function () {
    if ($('#loading').size() == 0) {
      $('body').append('<div id="loading"></div>');
    }
  },

  hideLoadingDialog: function () {
    $('#loading').remove();
  },

  convertSqlDateTimeToJpString: function (str, withTime) {
    var ary1 = str.split(' ');
    var d = ary1[0].split('-', 3);
    var t = ary1[1].split('-', 3);
    if (withTime) {
      return ('0000' + d[0]).substr(-4) + '年' + ('00' + d[1]).substr(-2) + '月' + ('00' + d[2]).substr(-2) + '日 ' + ('00' + t[0]).substr(-2) + '時' + ('00' + t[1]).substr(-2) + '分'
        + ('00' + t[2]).substr(-2) + '秒';
    }
    return ('0000' + d[0]).substr(-4) + '年' + ('00' + d[1]).substr(-2) + '月' + ('00' + d[2]).substr(-2) + '日';
  }
};
