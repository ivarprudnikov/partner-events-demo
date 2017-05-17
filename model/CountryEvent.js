var Calendar = require('./Calendar');

function CountryEvent(countryName, partnerList){
	this.name = countryName;
	this.attendeeCount = 0;
	this.attendees = []
	this.startDate = null;

	this.init(partnerList);
}

CountryEvent.prototype.init = function(partnerList){
	var calendar = new Calendar(partnerList);
	var result = calendar.findEventDay()
	this.attendeeCount = result.attendance
	this.attendees = result.attendees
	this.startDate = result.startDate
}

module.exports = CountryEvent;