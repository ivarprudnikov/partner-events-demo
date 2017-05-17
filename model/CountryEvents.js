var CountryEvent = require('./CountryEvent');

function CountryEvents(partners){
	this.countries = null;
	this.calculateEvents(partners);
}

CountryEvents.prototype.calculateEvents = function(partners){
	var partnersByCountry = partners.groupByCountry();
	this.countries = Object.keys(partnersByCountry).map(function(country){
		return new CountryEvent(country, partnersByCountry[country]);
	});
};

module.exports = CountryEvents;