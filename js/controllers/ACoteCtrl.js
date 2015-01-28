
/* Home Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('ACoteCtrl', ACoteCtrl);

function ACoteCtrl($scope, $routeParams, $http, $rootScope, $location, $resource, $timeout)
{

	var placesIndex = -1;
	var service = new google.maps.DistanceMatrixService();

	$rootScope.etapesPageName = "acotedemoi";

	if( $rootScope.listEtapeTriee != null )
		return;


	$scope.contentLoading = true;

	$rootScope.$on('acote-handler', function(event, args){ 
		$rootScope.geolocationError = false;
	    $rootScope.listEtapeTriee = new Array();

		$scope.origin = new google.maps.LatLng($rootScope.currentLatitude, $rootScope.currentLongitude);

		var selectionIds = "";
		$rootScope.selectionsDatas = new Array();
		for( var i=0 ; i< $rootScope.themes.length ; i++ )
		{
			if( $rootScope.themes[i].in_all_etapes == true ){
				selectionIds += $rootScope.themes[i].selection_id+",";
				datas = new Object();
				datas.selection_id = $rootScope.themes[i].selection_id;
				datas.color = $rootScope.themes[i].category_color;
				datas.name = $rootScope.themes[i].category_short_name;
				datas.slug = $rootScope.themes[i].category_slug;
				$rootScope.selectionsDatas[datas.selection_id] = datas;
			}
		}
		selectionIds = selectionIds.substring(0, selectionIds.length-1);

		var url = baseURLWordpress+'/sitra/requeteSitraMultiSelection.php?selectionIds='+selectionIds;

		$http.get(url).success(function(response){

			$scope.listEtapesProches = new Array();
			
			for( var i=0 ; i<response.response.length ; i++ ){

				for( var j=0 ; j<response.response[i].objetsTouristiques.length ; j++ )
				{
					if( response.response[i].objetsTouristiques[j].localisation.geolocalisation.geoJson ) {

						var destination = response.response[i].objetsTouristiques[j].localisation.geolocalisation.geoJson.coordinates;
						if( destination != null ){

							destination = new google.maps.LatLng(destination[1],destination[0]);

							response.response[i].objetsTouristiques[j].idSelection = response.response[i].query.selectionIds[0];
							response.response[i].objetsTouristiques[j].destination = destination;
							$scope.listEtapesProches.push( response.response[i].objetsTouristiques[j] );

						}
					}
				}
			}
			$scope.calculateDistance(null,null);
				
		});

			

	});


	$timeout( function(){
	
		if( $rootScope.currentLatitude != null && $rootScope.currentLongitude != null ){
			$rootScope.$broadcast('acote-handler');
			$scope.error = false;
		}
		else{
			$scope.error = true;
		}

	} , 1000 );
	



    $scope.calculateDistance = function(response, statuts){
		if(response) {
			$scope.listEtapesProches[placesIndex].km = response.rows[0].elements[0].distance;
			$scope.listEtapesProches[placesIndex].km.valueRounded = Math.round($scope.listEtapesProches[placesIndex].km.value/1000);
			//console.log( $scope.listEtapesProches[placesIndex] );

			$scope.addNouvelleEtape($scope.listEtapesProches[placesIndex]);
		}

		placesIndex ++;

		if(placesIndex < $scope.listEtapesProches.length) {

			var destination = $scope.listEtapesProches[placesIndex].destination;

			service.getDistanceMatrix(
			{
				origins: [$scope.origin],
				destinations: [destination],
				travelMode: google.maps.TravelMode.DRIVING,
				avoidHighways: false,
				avoidTolls: false,
			}, $scope.calculateDistance); 

		} 
    }

    $scope.addNouvelleEtape = function(etape){
    	$rootScope.listEtapeTriee.push(etape);
    	
    	$rootScope.listEtapeTriee.sort( function(a,b){
	    	if( a.km.value < b.km.value )
	    		return -1;
	    	else if (a.km.value > b.km.value)
	    		return 1;
	    	else
	    		return 0;
	    });

		$scope.contentLoading = false;
		$rootScope.$apply();
    }

    $scope.setupLoader = function(){
		console.log('setupLoader');
		var cl = new CanvasLoader('canvasLoaderAcote');
		cl.setColor('#ffffff'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDensity(16); // default is 40
		cl.setRange(1.5); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
		
	}
}