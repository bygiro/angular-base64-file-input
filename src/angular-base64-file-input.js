/*! angular-simple-base64-upload - v0.0.1 - 13 april 2015
* https://github.com/adonespitogo/angular-base64-upload
* Copyright (c) G. Tomaselli <girotomaselli@gmail.com> 2015; Licensed  
* based on https://github.com/adonespitogo/angular-base64-upload  */
angular.module('ByGiro.base64FileInput', [])
.directive('base64Input', ['$window','$parse', function ($window, $parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModel) {
      var fileObject = {};

      scope.readerOnload = function(e){
        var base64 = _arrayBufferToBase64(e.target.result);
        fileObject.base64 = base64;
        scope.$apply(function(){
          ngModel.$setViewValue(angular.copy(fileObject));
        });
      };

      var reader = new FileReader();
      reader.onload = scope.readerOnload;

      elem.on('change', function() {
        var file = elem[0].files[0];
        fileObject.filetype = file.type;		
        fileObject.filename = file.name;
        fileObject.extension = '';
		if(file.name.lastIndexOf(".") >= 0){
			fileObject.extension = file.name.substr(file.name.lastIndexOf(".")+1);
		}
		
        fileObject.filesize = file.size;
        fileObject.getPreview = _getPreview;		
        reader.readAsArrayBuffer(file);
		
        fileObject.previewType = '';
		switch(true){
			case (fileObject.filetype.indexOf('image/') >= 0):
				fileObject.previewType = 'image';
				break;
				
			case (fileObject.filetype.indexOf('text/') >= 0):
				fileObject.previewType = 'text';
				break;
				
			default:
				fileObject.previewType = 'extension';
				break;
		}
		
		
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
				preview = "data:image/" + this.filetype + ";base64," + this.base64;
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
