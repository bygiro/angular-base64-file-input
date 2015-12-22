/*! angular-simple-base64-upload - v0.0.2 - 13 april 2015
* Copyright (c) G. Tomaselli <girotomaselli@gmail.com> 2015; Licensed  
* based on https://github.com/adonespitogo/angular-base64-upload  */
angular.module('ByGiro.base64FileInput', [])
.directive('base64Input', ['$window','$parse', function ($window, $parse) {
  return {
    restrict: 'A',
	scope: {
		dataVal: "=?ngModel"
	},
    link: function (scope, elem, attrs) {
      var fileObject = {},
	  el = elem[0],
	  isInputFile = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, 'input[type="file"]');

	  if(!isInputFile) return;
	  
	  var btn = angular.element('<span class="btn btn-info">file</span>');
	  btn.on('click', function(){
		  el.click();
	  });
	  
	  elem.css({
		  width:"1px",
		  height:"1px",
		  overflow:'hidden'
	  });
	  
	  elem.after(btn);
	  
	  var reader = new FileReader();
      reader.onload = function(e){
        fileObject.base64 = _arrayBufferToBase64(e.target.result);
		
        fileObject.previewType = '';
		switch(true){
			case (fileObject.type.indexOf('image/') >= 0):
				fileObject.previewType = 'image';
				break;
				
			case (fileObject.type.indexOf('text/') >= 0):
				fileObject.previewType = 'text';
				break;
				
			default:
				fileObject.previewType = 'extension';
				break;
		}		
		
		var phase = scope.$root.$$phase;
		if (phase == '$apply' || phase == '$digest') {
			scope.dataVal = fileObject;
		} else {
			scope.$apply(function(){
				scope.dataVal = fileObject;
			});
		}
      };

      elem.on('change', function(){
        var file = elem[0].files[0];
        fileObject.type = file.type;		
        fileObject.name = file.name;
        fileObject.extension = '';
		if(file.name.lastIndexOf(".") >= 0){
			fileObject.extension = file.name.substr(file.name.lastIndexOf(".")+1);
		}
		
        fileObject.size = file.size;
        fileObject.getPreview = _getPreview;		
        reader.readAsArrayBuffer(file);		
      });

      function _arrayBufferToBase64( buffer ){
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return $window.btoa( binary );
      }

      function _getPreview(){
		  preview = '';
		  
		  switch(this.previewType){
			case 'image':
				preview = "data:image/" + this.type + ";base64," + this.base64;
				break;
			
			case 'text':
				preview = decodeURIComponent(escape($window.atob( this.base64 )));
				break;
		  }

        return preview;
      }
    }
  };
}]);
