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

    $routeProvider
      .when('/', {
        controller: 'RootCtrl',
        templateUrl: '/partials/root.html',
      })
      .when('/weather/:zipcode', {
        controller: 'WeatherCtrl',
        templateUrl: '/partials/weather.html',
        resolve: {
          weather (weatherFactory, $route) {
            return weatherFactory.getWeather($route.current.params.zipcode)
          },
          user (authFactory, $location) {
            return authFactory.getUser().catch(() => $location.url('/login'))
          },
        }
        // resolve takes an object with a function inside
        // https://docs.angularjs.org/api/ngRoute/provider/$routeProvider#when
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: '/partials/login.html',
      })
  })
  .controller('RootCtrl', function ($scope, $location) {
    console.log('I am a RootCtrl')
    console.log('Current user', firebase.auth().currentUser)
    $scope.gotoWeather = () => $location.url(`/weather/${$scope.zip}`)
  })
  .controller('WeatherCtrl', function ($scope, user, weather) {
    console.log('I am a WeatherCtrl')
    console.log('Current user', user)

    $scope.temperature = weather.temp
    $scope.city = weather.city
  })
  .controller('LoginCtrl', function ($scope, $location, authFactory) {
    $scope.login = () => authFactory
      .login($scope.email, $scope.password)
      .then(() => $location.url('/'))
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
  .factory('authFactory', ($q) => {
    return {
      login (email, pass) {
        // converts native ES6 promise to angular promise so no $scope.$apply needed
        return $q.resolve(firebase.auth().signInWithEmailAndPassword(email, pass))
      },

      getUser () {
        return $q((resolve, reject) => {
          // http://stackoverflow.com/questions/37370224/firebase-stop-listening-onauthstatechanged
          const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe()
            if (user) {
              resolve(user)
            } else {
              reject()
            }
          })
        })
      },
    }
  })
