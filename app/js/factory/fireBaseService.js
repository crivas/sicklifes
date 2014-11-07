/**
 * Created by Bouse on 10/2/2014
 */


sicklifesFantasy.factory('$fireBaseService', function ($q, $firebase, localStorageService, $leagueTeams) {

  var ref,
    sync;

  var fireBaseObj = {
    
    list: null,

    initialize: function () {
      console.log('initialize');
      ref = new Firebase('https://glaring-fire-9383.firebaseio.com/');
      sync = $firebase(ref);
      // create a synchronized array for use in our HTML code
      fireBaseObj.list = sync.$asArray();
    },

    getFireBaseData: function () {

      console.log('getFireBaseData');

      var defer = $q.defer();

      ref.on('value', function (snapshot) {

        defer.resolve(snapshot.val());

      }, function (errorObject) {

        console.log('The read failed: ' + errorObject.code);

      });

      return defer;

    },

    syncLeagueData: function (saveObject) {

      console.log('syncLeagueData');
      var usersRef = ref.child('leagueData');
      usersRef.set(angular.copy(saveObject));
      localStorageService.set('leagueData', saveObject);

    },

    syncLeagueTeamData: function (saveObject) {

      console.log('syncLeagueTeamData');
      var usersRef = ref.child('leagueTeamData');
      usersRef.set(angular.copy(saveObject));
      localStorageService.set('leagueTeamData', saveObject);

    }

  };

  return fireBaseObj;

});