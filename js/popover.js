var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.typeMessage = 'PopOverTest';
  $scope.change = function(type){
    if(type == 'good'){
      $scope.typeMessage = '<input type="text">very good';
    }else if(type == 'bad'){
      $scope.typeMessage = '<p style="color:red;">very bad</p>';
    }
  };
});

app.directive('nextLevel', function () {
        return {
            restrict: 'EA',
            scope:{ popoverHtml:'@'},
            template: '<a ui-sref="register" tabindex="0" linkdisabled="{{type}}"  class="btn btn-block btn-success ng-class: {disabled: !(type)}" role="button" >next</a>',
            link: function (scope, el, attrs){
              $(el[0]).popover({
                    trigger: 'click',
                    html: true,
                    toggle:'popover',   
                    title: 'notice !!',
                    content: scope.popoverHtml,  // Access the popoverHtml html
                    placement: 'bottom'
                });
                
              attrs.$observe('popoverHtml', function(val){
                $(el[0]).popover('hide');
                var popover = $(el[0]).data('bs.popover');
                 popover.options.content = val;
                console.log(popover); 
              })
              
              
            } 
        };   
    });

