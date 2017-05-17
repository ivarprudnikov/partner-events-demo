const API_KEY = "fa5c35dab788d7902944adea558a";
const BASE_URL = "https://candidate.hubteam.com/candidateTest/v2";

var Partners = require("./model/Partners");
var CountryEvents = require("./model/CountryEvents");
var request = require("request");
var apiRequest = request.defaults({
	baseUrl: BASE_URL,
	qs: {
		userKey: API_KEY
	},
	json: true
});

function getPartners(callback) {

	apiRequest({
		uri: "/partners"
	}, function (error, response, body) {

		var partners;

		if (error) {
			throw new Error(error);
		}

		if (response && response.statusCode === 200) {
			partners = new Partners(body.partners);
		}

		callback(partners);
	});
}

getPartners(function (partners) {

	console.log(partners.size());
	var countryEvents = new CountryEvents(partners);
	console.log(JSON.stringify(countryEvents, null, 2));

	apiRequest({
		uri: "/results",
		body: countryEvents,
		method: "POST"
	}, function (error, response, body) {
		if (error) {
			throw new Error(error);
		}

		if (response && response.statusCode === 200) {
			console.log("All done!");
		} else {
			console.log("Try again!", response.statusCode);
		}
	})
});



