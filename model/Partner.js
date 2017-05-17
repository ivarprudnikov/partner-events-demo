function Partner(params) {
	this.firstName = params.firstName
	this.lastName = params.lastName
	this.email = params.email
	this.country = params.country
	//availableDates = [
	//	"2017-05-03",
	//	"2017-05-06"
	//]
	this.availableDates = params.availableDates || [];
}

module.exports = Partner;