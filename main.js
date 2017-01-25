angular
  .module('anguweathar', ['ngRoute'])
  .config(($routeProvider) => {
    console.log('Config executing')

    firebase.initializeApp({
      apiKey: "AIzaSyDfKMbHscf_4oQ5oL0EGh0u6zP9Gunp9l0",
      authDomain: "c17-jquery-auth.firebaseapp.com",
      databaseURL: "https://c17-jquery-auth.firebaseio.com",
      storageBucket: "c17-jquery-auth.appspot.com",
      messagingSenderId: "936314115006"
    })

    const checkForAuth = {
      checkForAuth: function ($location) {
        console.log('This will fire just before the WeatherCtrl')
        if (firebase.auth().currentUser === null) {
          $location.url('/')
        }
      }
    }

    $routeProvider
      .when('/', {
        controller: 'RootCtrl',
        templateUrl: '/partials/root.html',
      })
      .when('/weather/:zipcode', {
        controller: 'WeatherCtrl',
        templateUrl: '/partials/weather.html',
        resolve: checkForAuth
        // resolve takes an object with a function inside
        // https://docs.angularjs.org/api/ngRoute/provider/$routeProvider#when
      })
  })
  .run(($location) => {
    console.log('Run Executing')

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // ???
        console.log('Logged In', user)
      } else {

      }
    })
  })
  .controller('RootCtrl', function ($scope, $location) {
    console.log('I am a RootCtrl')
    console.log('Current user', firebase.auth().currentUser)
    $scope.gotoWeather = () => $location.url(`/weather/${$scope.zip}`)
  })
  .controller('WeatherCtrl', function ($scope, $routeParams, weatherFactory) {
    console.log('I am a WeatherCtrl')
    console.log('Current user', firebase.auth().currentUser)

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
