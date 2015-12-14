'use strict';

var PCBuildApp = angular.module('PCBuildApp', ['ngRoute']);

PCBuildApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
          templateUrl: 'main_view/view.html',
          controller: 'PCBuildController'
        }).
        otherwise({
          redirectTo: '/'
        });
  }]);

PCBuildApp.controller('PCBuildController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http.get('http://speedycomputing.net/customcomputer/parts.php').success(function(data) {
    $scope.parts = data;
    var param;
    for (param in $routeParams){
      if ($scope.mainTypes.indexOf(param) != -1){
        var ps = $routeParams[param].split("|");
        var part;
        for (part in $scope.parts[param]) {
          if (ps.indexOf($scope.parts[param][part].id) != -1) {
            $scope.select(param,$scope.parts[param][part]);
          }
        }
      }
    }
  });

  $scope.mainTypes = ["CASE","CPU","CPUFAN","MB","RAM","GPU","HD","PS","OS"];
  var type;
  $scope.filters = {};
  for (type in $scope.mainTypes){
    //console.log($scope.mainTypes[type]);
    $scope.filters[$scope.mainTypes[type]] = {};
    $scope.filters[$scope.mainTypes[type]].filters = {};
  }

  $scope.part_style = function(url,type,part){
    var style = {};
    if (typeof $scope.parts[type].selected == 'undefined' || $scope.parts[type].selected.indexOf(part) == -1){
      style['background-image'] = "linear-gradient(to bottom, rgba(36, 46, 56, 0.5) 0%,rgba(36, 46, 56, 0.7) 40%), url("+url+")";
    }else{
      style['background-image'] = "linear-gradient(to bottom, rgba(86, 73, 53, 0.5) 0%,rgba(86, 73, 53, 0.7) 40%), url("+url+")";
    }
    return style;
  };

  $scope.select = function(type,part){
    console.log(type);
    if (type != 'HD' || typeof $scope.parts[type].selected == 'undefined'){
      $scope.parts[type].selected = [];
    }
    $scope.parts[type].selected.push(part);
    var key;
    for (key in part.filters) {
      //console.log(key);
      $scope.filters[key].filters[type] = part.filters[key];
    }
  };

  $scope.compatible = function(a,b){
    var s = a.split(",");
    var p;
    for (p in s){
      if (b.indexOf(s[p]) > -1){
        //console.log(p,b);
        return true;
      }
    }
    return false;
    /*console.log($index);
    var f,t;
    for(f in $scope.filters[type].filters){
      var split = $scope.filters[type].filters[f].split(",");
      for (t in split){
        if(part.filters[f].indexOf(split[t]) == -1){
          return false;
        }
      }
    }
    return true;*/
  }

  $scope.unselect = function(type,part){
    var index = $scope.parts[type].selected.indexOf(part);
    if (index != -1) {
    $scope.parts[type].selected.splice(index,1);
      var key;
      for (key in part.filters) {
        delete $scope.filters[key].filters[type];
      }
    }
  }

  $scope.total = function(){
    var total = 0.00;
    if (typeof $scope.parts == 'undefined')return 0.00;
    for (type in $scope.mainTypes){
      if (typeof $scope.parts[$scope.mainTypes[type]].selected != 'undefined') {
        var s;
        for (s in $scope.parts[$scope.mainTypes[type]].selected) {
          total += parseFloat($scope.parts[$scope.mainTypes[type]].selected[s].price);
        }
      }
    }
    return total;
  }
}]);
