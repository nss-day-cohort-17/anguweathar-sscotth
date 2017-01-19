angular
  .module('anguweathar', ['ngRoute'])
  .config(($routeProvider) => {
    $routeProvider
      .when('/', {
        controller: 'RootCtrl',
        templateUrl: '/partials/root.html',
      })
      .when('/weather/:zipcode', {
        controller: 'WeatherCtrl',
        templateUrl: '/partials/weather.html',
      })
  })
  .controller('RootCtrl', function ($scope, $location) {
    console.log('I am a RootCtrl')
    $scope.gotoWeather = () => $location.url(`/weather/${$scope.zip}`)
  })
  .controller('WeatherCtrl', function () {
    console.log('I am a WeatherCtrl')
  })
