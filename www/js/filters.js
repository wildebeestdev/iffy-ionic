angular
    .module('iffyFilters', [])
    .filter('customFilter', function() {
		return function($scope) {

			$scope.persons = [{type: 1, name: 'Gjelina'}, {type:2, name: 'Sugarfish'}, {type:1, name: 'Camila'}, {type:3, name: 'Lemonade Venice'}];
		$scope.myFunction = function(val) {
		   
		return (val.type != 2);
		};
	}
	
});


