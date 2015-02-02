
/* Home Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $routeParams, $http, $rootScope, $location, $resource, $timeout)
{
	$scope.pageClass = 'page-home';
	$scope.oldpage = $routeParams.page;
	$scope.pageName = 'etapes';
	$rootScope.etapesPageName = $routeParams.page;
	$scope.pageTitle1 = "Quelle sera";
	$scope.pageTitle2 = "votre prochaine étape ?";
	$rootScope.currentTheme = null;
	$rootScope.currentSousTheme = null;

	$scope.connectionProblem = false;
	/*
	$http.get('datas/datas.json').then(function(res){
        $scope.themes = res.data.themes;           
    });
	*/

	//$rootScope.isOnline = false;

	$timeout( function(){

		$scope.contentLoading = true;

		if( $rootScope.themes == null && $rootScope.isOnline == true ){
			var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&type=page&id=16', null, {'query' : {method:'GET', params:{isArray:false}} });
			WPAPI.query( null, function(datas){
				$scope.contentLoading = false;
				$rootScope.themes = datas.posts[0].custom_fields.category;
				$rootScope.$storage.themes = $rootScope.themes;
			});
		}

		console.log( $rootScope.$storage );
		console.log( navigator.onLine );

		if( $rootScope.isOnline == false && $rootScope.$storage.themes != null && navigator.onLine == false ){
			$rootScope.themes = $rootScope.$storage.themes;
			$scope.contentLoading = false;
		}
		else if( $rootScope.isOnline == false && $rootScope.$storage.themes == null  && navigator.onLine == false  ){
			$scope.connectionProblem = true;
			$scope.contentLoading = false;
		}
	} , 1000 );


	$rootScope.$on('triggerOffline', function(event, args) {
		$rootScope.themes = $rootScope.$storage.themes;
		$scope.contentLoading = false;
		console.log('triggerOffline');
		
    });  

	
	$scope.$on('broadcastPageName', function(event, args) {
		$scope.pageName = args.pageName;
    });  

    $rootScope.updateAnimRetour = function($animRetour) {
        $scope.animRetour = $animRetour;
        $rootScope.$broadcast('broadcastAnimRetour', { animRetour: $scope.animRetour });
    };

    $scope.goToTheme = function(theme){
        $rootScope.currentTheme = theme;
    	$location.path("themes/"+theme.category_slug);
    }

    $rootScope.goToFiche = function(idEtape){
    	$location.path("etapes/"+idEtape);
    }


	$scope.setupHomeLoader = function(){

		if( $rootScope.themes != null )
			return false;

		var cl = new CanvasLoader('canvasLoader');
		cl.setColor('#ffffff'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDensity(16); // default is 40
		cl.setRange(1.5); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
		
	}

    
}