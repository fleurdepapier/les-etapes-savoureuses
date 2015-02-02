


var currentLanguage = "fr";
var online = navigator.onLine || false;
var app = null;

var baseURL = "http://app.dev.lesetapessavoureuses.fr/";
var baseURLWordpress = "http://dev.lesetapessavoureuses.fr/";



// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
function onDeviceReady() {
	navigator.network.isReachable("google.com", reachableCallback, {});
}

// Check network status
function reachableCallback(reachability) {
	// There is no consistency on the format of reachability
	var networkState = reachability.code || reachability;
	var states = {};
	states[NetworkStatus.NOT_REACHABLE]                      = 'No network connection';
	states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
	states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK]         = 'WiFi connection';
	if (networkState != 0) online = true;


	initApplication();
}


$(document).ready(function() { 

	$(document).bind('deviceready', function(){
		onDeviceReady();
	});
	
});




function initApplication(){

	app = new angular.module('app', ['ngRoute', 'appControllers', 'ngAnimate', 'snap', 'ngStorage', 'ngTouch', 'ngResource', 'ngMap', 'ngSanitize']);

	app.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
		.when('/home/:page', {
			templateUrl: 'templates/home.html',
			controller: 'HomeCtrl'
		})
		.when('/themes/:idTheme', {
			templateUrl: 'templates/sousthemes.html',
			controller: 'SousThemesCtrl'
		})
		.when('/themes/:idTheme/:idSousTheme', {
			templateUrl: 'templates/listeEtapes.html',
			controller: 'ListeEtapesCtrl'
		})
		.when('/etapes/:idFiche', {
			templateUrl: 'templates/etape.html',
			controller: 'EtapeCtrl'
		})
		.when('/tutoriel', {
			templateUrl: 'templates/tutoriel.html',
			controller: 'TutorielCtrl'
		})
		.when('/actualites', {
			templateUrl: 'templates/actualites.html',
			controller: 'ActualitesCtrl'
		})
		.when('/actualites/:idActu', {
			templateUrl: 'templates/actualite-single.html',
			controller: 'ActualiteSingleCtrl'
		})
		.when('/jouer', {
			templateUrl: 'templates/jouer.html',
			controller: 'JouerCtrl'
		})
		.when('/apropos/:page', {
			templateUrl: 'templates/apropos.html',
			controller: 'AProposCtrl'
		})
		.when('/application-mobile', {
			templateUrl: 'templates/application.html',
		})
		.otherwise({
			redirectTo: '/home/themes'
		});
		
	}]);




	app.run(function($window, $rootScope, $location, $resource, $templateCache, $localStorage)
	{
		$rootScope.geolocationError = false;

		$rootScope.getPosition = function(){
			if( $rootScope.currentLatitude != null && $rootScope.currentLongitude != null )
				return;

			geoPosition.getCurrentPosition(geoSuccess, geoError, {timeout:5000, maximumAge:0,enableHighAccuracy : true});
		}

		function geoSuccess(position) {
			$rootScope.currentLatitude = position.coords.latitude;
			$rootScope.currentLongitude = position.coords.longitude;
			$rootScope.$broadcast('acote-handler');
		}

		function geoError() {
			$rootScope.geolocationError = true;
		}

		if (geoPosition.init()) {
		   $rootScope.getPosition();
		}

		$templateCache.removeAll();
		$rootScope.themes == null;
		$rootScope.online = navigator.onLine;

		$rootScope.$storage = $localStorage.$default({ });

		$rootScope.firstBuild = 'first-build';
		var firstCall = true;

		if( $rootScope.$storage.tutorialSeen == undefined )
		{
			$rootScope.$storage.tutorialSeen = true;
			$rootScope.firstBuild = 'tutoriel';
			firstCall = true;
			$location.path('/tutoriel');
		}
		else{
			firstCall = true;
			//$rootScope.firstBuild = 'first-build';
			$location.path('/home/themes');
		}

		$rootScope.$on('$routeChangeStart', function(next, current){	

			if( current.$$route != null )
			{
				var currentName = $rootScope.currentCtrl;
				var nextName = current.$$route.controller;
				console.log(currentName, nextName);
				if( currentName == null )
				{
					$rootScope.animSide = "no-anim";
				}

				// Default
				$rootScope.animSide = "fadeAnimation";
				$rootScope.aproposPage = null;

				if( currentName == "HomeCtrl" && nextName == "HomeCtrl" )
				{
					$rootScope.animSide = "no-anim";
				}
				if( currentName == "HomeCtrl" && nextName == "SousThemesCtrl" )
				{
					$rootScope.animSide = "left";
				}
				if( currentName == "SousThemesCtrl" && nextName == "HomeCtrl" )
				{
					$rootScope.animSide = "right";
				}
				if( currentName == "SousThemesCtrl" && nextName == "ListeEtapesCtrl" )
				{
					$rootScope.animSide = "left";
				}
				if( currentName == "ListeEtapesCtrl" && nextName == "SousThemesCtrl" )
				{
					$rootScope.animSide = "right";
				}
				if( currentName == "ListeEtapesCtrl" && nextName == "EtapeCtrl" )
				{
					$rootScope.animSide = "left";
				}
				if( currentName == "SousThemesCtrl" && nextName == "EtapeCtrl" )
				{
					$rootScope.animSide = "left";
				}
				if( currentName == "HomeCtrl" && nextName == "EtapeCtrl" )
				{
					$rootScope.animSide = "left";
				}
				if( currentName == "EtapeCtrl" )
				{
					$rootScope.animSide = "right";
				}

				if( currentName == "ActualitesCtrl" && nextName == "ActualiteSingleCtrl" )
				{
					$rootScope.animSide = "left";
				}
				if( currentName == "ActualiteSingleCtrl" && nextName == "ActualitesCtrl" )
				{
					$rootScope.animSide = "right";
				}
				
				$rootScope.currentCtrl = current.$$route.controller;

			}
			
		});

			

		$rootScope.getlibelle = function(data){
			if( data == null )
				return null;

			if( currentLanguage == "en" && data.libelleEn != null ){
				return data.libelleEn;
			}
			else if( currentLanguage == "fr" && data.libelleFr != null ){
				return data.libelleFr;
			}
			else{
				return null;
			}
		}

		// Detecter les changements de connexion a internet
		$rootScope.isOnline = online;
		$window.addEventListener("offline", function()
		{
			console.log('offline');
			$rootScope.$apply(function(){ $rootScope.isOnline = false;});
		}, false);
		$window.addEventListener("online", function()
		{
			console.log('online');
			$rootScope.$apply(function() {$rootScope.isOnline = true;});
		}, false);


	});

	app.filter('unsafe', function($sce) {
	    return function(val) {
	        return $sce.trustAsHtml(val);
	    };
	});


	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
	    $('html').addClass('ipad ios7');
	}

}


