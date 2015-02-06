angular.module('navigation',[])
    .directive('navigation',['$location', 'ParseService', 'GlobalService', function($location, ParseService, GlobalService){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavCtrl($scope, $location, ParseService, GlobalService);
	    },
	    scope:true,
            templateUrl: "components/nav/nav.html"
	};
    }]);
