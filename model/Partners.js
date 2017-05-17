var Partner = require("./Partner");

function Partners(partners){
	this.list = partners.map(function(p){
		return new Partner(p);
	}) || [];
}

Partners.prototype.size = function(){
	return this.list.length;
}

Partners.prototype.groupByCountry = function(){
	return this.list.reduce(function(memo, val, index, arr){
		var countryName = val.country;
		memo[countryName] = memo[countryName] || [];
		memo[countryName].push(val);
		return memo;
	}, {});
}

module.exports = Partners;