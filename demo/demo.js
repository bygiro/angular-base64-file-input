(function() {
	angular.module('demoApp', ['ByGiro.base64FileInput']).controller('demoCtrl', [
		'$scope','$window', function($scope, $window) {
			$scope.model = {};		
			$scope.preview = '';

			$scope.onChange = function(){
				if(typeof $scope.model.getPreview == 'function'){
					$scope.preview = $scope.model.getPreview();
				}
			}			
		}
	]);
})();