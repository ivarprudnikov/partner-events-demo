var moment = require("moment")

function Calendar(partners) {
	this.partners = partners;

	/**
	 * Will get availability schedule, where keys are dates
	 * and values are slots for each partner
	 * returns {
		*  "2017-06-06": [ false, false, true, true, false ]
		*  "2017-06-07": [ true, false, false, true, false ]
		*  ...
		* }
	 */
	this.calendar = null;
	this.init();
}

Calendar.prototype.init = function () {

	var self = this;

	function buildAttendanceForDay() {
		var total = self.partners.length;
		var attendance = [];
		for (var i = 0; i < total; i++) {
			attendance.push(0);
		}
		return attendance;
	}

	function putPartnerToAttendanceList(partner, attendance) {
		var idx = self.partners.indexOf(partner);
		attendance[idx] = 1;
	}

	function buildEmptyCalendar() {

		var dates = self.partners.map(function (p) {
			return p.availableDates;
		}).reduce(function (memo, val) {
			return memo.concat(val);
		}, []).sort()

		var mFrom = moment(dates[0]);
		var mTo = moment(dates[dates.length - 1]);

		var range = moment(mTo).diff(mFrom, 'days') + 1;

		var cal = {};
		for (var i = 0; i < range; i++) {
			if (i > 0) {
				mFrom.add(1, 'days')
			}
			cal[mFrom.format('YYYY-MM-DD')] = buildAttendanceForDay();
		}

		return cal;
	}

	var cal = buildEmptyCalendar();

	// put partners to calendar
	this.partners.forEach(function (val) {
		val.availableDates.forEach(function (isoDate) {
			putPartnerToAttendanceList(val, cal[isoDate]);
		});
	})

	// sort dates
	this.calendar = Object.keys(cal).sort().reduce(function (result, key) {
		result[key] = cal[key];
		return result;
	}, {});
}

Calendar.prototype.findEventDay = function () {
	var cal = this.calendar;

	var partnerList = this.partners;
	var dates = Object.keys(this.calendar);
	var attendanceForEachStartDate = {}
	for (var i = 0; i < dates.length; i++) {

		var attendees = cal[dates[i]].reduce(collectPartners, []);
		if (i < (dates.length - 1)) {
			attendees = cal[dates[i + 1]].reduce(collectPartners, attendees)
		}

		attendanceForEachStartDate[dates[i]] = {
			attendance: attendees.length,
			startDate: attendees.length > 0 ? dates[i] : null,
			attendees: attendees.map(function (p) {
				return p.email;
			}).reduce(function (p, c) {
				if (p.indexOf(c) < 0) p.push(c);
				return p;
			}, [])
		}
	}

	function collectPartners(memo, val, idx) {
		var partner = partnerList[idx]
		if (val > 0 && memo.indexOf(partner) < 0) memo.push(partner);
		return memo;
	}

	return Object.keys(attendanceForEachStartDate).map(function (k) {
		return attendanceForEachStartDate[k];
	}).sort(function (a, b) {
		return b.attendance - a.attendance;
	})[0]
}

module.exports = Calendar;