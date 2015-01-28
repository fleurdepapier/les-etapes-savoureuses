
/* Sous Themes Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('SousThemesCtrl', HomeCtrl);

function SousThemesCtrl($scope, $routeParams, $http, $rootScope, $location, $timeout)
{
	$scope.pageClass = 'page-sousthemes';
	$scope.slugTheme = $routeParams.idTheme;
	$scope.listeEtapes = null;
	$rootScope.currentSousTheme = null;
	
	$rootScope.etapesPageName = "themes";
	$scope.theme = $rootScope.currentTheme;
	$scope.headerRetourTitle = $scope.theme.category_name;
	$scope.headerRetourHref = "#/home/themes";


	$timeout( function(){
		$scope.contentLoading = true;
		
		if( $scope.theme.sub_cat == false )
		{
			// Il n'y a pas de sous cat, on va chercher la liste des étapes
			var url = baseURLWordpress+'sitra/requetesitra.php?selectionIds='+$scope.theme.selection_id;
			
			// On lance la requette un peu apres pour que l'animation soit fluide

			if( $rootScope.isOnline == true ){
				$http.get(url).success(function(response){
					$scope.listeEtapes =  $rootScope.randomizeArray(response.objetsTouristiques);
					$scope.contentLoading = false;
					
					if( $rootScope.$storage.listeEtapes == null )
						$rootScope.$storage.listeEtapes = new Array();

					$rootScope.$storage.listeEtapes[''+$scope.theme.selection_id] = $scope.listeEtapes;
				});
			}

			if( $rootScope.isOnline == false && $rootScope.$storage.listeEtapes != null && $rootScope.$storage.listeEtapes[''+$scope.theme.selection_id] != null){
				$scope.listeEtapes = $rootScope.$storage.listeEtapes[''+$scope.theme.selection_id];
			}
			else if( $rootScope.isOnline == false && ( $rootScope.$storage.listeEtapes == null || $rootScope.$storage.listeEtapes[''+$scope.theme.selection_id] == null ) ){
				$location.path("home/themes");
			}

		}
		else{
			// On lance les requettes de chaque selections pour récupérer le nombre d'étapes de chaque categories
			for( var i = 0 ; i < $scope.theme.sub_cat.length ; i++ )
			{
				
				var url = baseURLWordpress+'/sitra/getNumFounds.php?selectionIds='+$scope.theme.sub_cat[i].sub_cat_selection_id;

				if( $rootScope.isOnline == true ){
					$http.get(url).success(function(response){

						for( var j = 0 ; j < $scope.theme.sub_cat.length ; j++ )
						{
							console.log("query");
							if( response.query.selectionIds[0] == $scope.theme.sub_cat[j].sub_cat_selection_id ){
								$scope.theme.sub_cat[j].numFound = response.numFound;
								$scope.contentLoading = false;
								return;
							}
						}
					});
				}
				else{
					$scope.contentLoading = false;
				}
				
			}
		}

	} , 1000 );
	

	


    $scope.updateAnimRetour = function($animRetour) {
        $scope.animRetour = $animRetour;
        $rootScope.$broadcast('broadcastAnimRetour', { animRetour: $scope.animRetour });
    };

    $scope.goToSousTheme = function(soustheme){
    	$scope.animToLeft = true;
        $rootScope.$broadcast('broadcastAnimRetour', { animRetour: false });
        $rootScope.currentSousTheme = soustheme;
    	$location.path("themes/"+$scope.theme.category_slug+"/"+soustheme.sub_cat_slug);
    }

    $rootScope.randomizeArray = function(array){
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

	$scope.setupLoader = function(){
		console.log('setupLoader');
		var cl = new CanvasLoader('contentLoadingSousThemes');
		cl.setColor('#FFFFFF'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDensity(16); // default is 40
		cl.setRange(1.5); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
		
	}
}