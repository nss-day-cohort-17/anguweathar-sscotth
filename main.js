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
  .controller('WeatherCtrl', function ($scope, $routeParams, weatherFactory) {
    console.log('I am a WeatherCtrl')

    weatherFactory
      .getWeather($routeParams.zipcode)
      .then((weather) => {
        $scope.temperature = weather.temp
        $scope.city = weather.city
      })
  })
  .factory('weatherFactory', ($http) => {
    return {
      getWeather (zipcode) {
        return $http
          .get(`http://api.wunderground.com/api/69e0974e13868fe4/conditions/q/${zipcode}.json`)
          .then((response) => ({ // same as `=> return {`
              temp: response.data.current_observation.temp_f,
              city: response.data.current_observation.display_location.full,
            })
          )
      },
    }
  })
