
/* ListeEtapes Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('ListeEtapesCtrl', ListeEtapesCtrl);

function ListeEtapesCtrl($scope, $routeParams, $http, $rootScope, $location, $timeout)
{
	$scope.pageClass = 'page-listeetapes';
	
	$rootScope.etapesPageName = "themes";
	$scope.theme = $rootScope.currentTheme;
	$scope.soustheme = $rootScope.currentSousTheme;
	$scope.headerRetourTitle = $scope.soustheme.sub_cat_name;
	$scope.headerRetourHref = "#/themes/"+$scope.theme.category_slug;


	$timeout( function(){

		$scope.contentLoading = true;

		// Il n'y a pas de sous cat, on va chercher la liste des étapes
		var url = baseURLWordpress+'sitra/requetesitra.php?selectionIds='+$scope.soustheme.sub_cat_selection_id;

		//$rootScope.isOnline = false;
		if( $rootScope.isOnline == true ){
			// On lance la requette un peu apres pour que l'animation soit fluide
			$http.get(url).success(function(response){
				//console.log(response);
				$scope.listeEtapes =  $rootScope.randomizeArray(response.objetsTouristiques);
				$scope.contentLoading = false;


				if( $rootScope.$storage.listeEtapes == null )
					$rootScope.$storage.listeEtapes = new Array();

				$rootScope.$storage.listeEtapes[''+$scope.soustheme.sub_cat_selection_id] = $scope.listeEtapes;
			});
		}

		if( $rootScope.isOnline == false && $rootScope.$storage.listeEtapes[''+$scope.soustheme.sub_cat_selection_id] != null){
			$scope.listeEtapes = $rootScope.$storage.listeEtapes[''+$scope.soustheme.sub_cat_selection_id];
		}
		else if( $rootScope.isOnline == false && $rootScope.$storage.listeEtapes[''+$scope.soustheme.sub_cat_selection_id] == null ){
			$location.path("home/themes");
		}

	} , 1000 );
	

	

    $scope.updateAnimRetour = function($animRetour) {
        $scope.animRetour = $animRetour;
        $rootScope.$broadcast('broadcastAnimRetour', { animRetour: $scope.animRetour });
    };

    $scope.setupLoader = function(){
		console.log('setupLoader ListeEtapesCtrl');
		var cl = new CanvasLoader('canvasLoaderListeEtapes');
		cl.setColor('#FFFFFF'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDensity(16); // default is 40
		cl.setRange(1.5); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
		
	}
}