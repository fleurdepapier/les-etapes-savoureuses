
/* Navigation Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('NavCtrl', NavCtrl);

function NavCtrl($scope, $rootScope, $location)
{

    $rootScope.goToPage = function(page){
    	$location.path(page);
    }
	
}