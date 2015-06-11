var asyncBalancer = function(ajaxFnA, ajaxFnB, callback) {
	var flag = false
	var returnedData

	var initialResponse = function(){
		if (flag) {
			callback([returnedData, data])
		} else {
			flag = true
			returnedData = data
		}
	}

	ajaxFnA(initialResponse)
	ajaxFnB(initialResponse)
}

var getPosition = function(callback) {
	var afterCoords = function(geoposition) {
		callback(geoposition.coords)
	}
	navigator.geolocation.getCurrentPosition(afterCoords)
}


var getStationData = function(callback) {

	var successFunction = function(stationArray) {
		callback(stationArray)
	}

	$.ajax({
		url: "/live",
		method: "GET",
		success: successFunction
	})

}


$(document).on("ready", function(){

	var templateFn = Handlebars.compile( $("#stationTemplate").html() )

	var afterAjax = function(dataArray) {
		var coordinates = dataArray[0]
		var stationData = dataArray[1]

		stationData = _.sortBy(stationData, function(station){
			var latDelta = Math.pow(station.latitude - coordinates.latititude, 2)
			var longDelta = Math.pow(station.longitude - coordinates.longtitude, 2)
			return longDelta+latDelta
		})

		stationData = _.first(stationData, 10)

		_.each(stationData, function(station){
			var htmlString = templateFn(station)
			$("#copyLocation").append(htmlString)
		})
	}

	asyncBalancer(getPosition, getStationData, afterAjax)

})