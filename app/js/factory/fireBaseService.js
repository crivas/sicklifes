/**
 * Created by Bouse on 09/01/2015
 */

(function () {

  'use strict';

  angular.module('sicklifes')

    .factory('fireBaseService', function ($q, $firebase, $rootScope, $localStorage) {

      var ref,
        sync,
        syncObject;

      return {

        list: null,

        initialize: function (scope) {

          ref = new Firebase('https://glaring-fire-9383.firebaseio.com/');
          sync = $firebase(ref);

          // create a synchronized array for use in our HTML code
          //var syncArray = sync.$asArray();
          syncObject = sync.$asObject();

          // var list = $firebaseArray(ref);
          // var rec = list.$getRecord('foo');

          syncObject.$bindTo(scope, 'syncedObject');

        },

        getFireBaseData: function () {

          var defer = $q.defer();

          ref.on('value', function (snapshot) {
            //console.log('firebase connect:', snapshot.val());
            defer.resolve(snapshot.val());
          }, function (errorObject) {
            console.log('The read failed:', errorObject.code);
          });

          return defer.promise;

        },

        saveToLocalStorage: function (saveObject, key) {

          console.log('saveToLocalStorage -- START | key:', key);

          var cleanedData = angular.copy(saveObject);

          // save to local storage
          $localStorage[key] = cleanedData;

          $rootScope.lastSyncDate = saveObject._lastSyncedOn;
          $rootScope.source = 'local storage';

          console.log('saveToLocalStorage -- COMPLETE');


        },

        saveToFireBase: function (saveObject, key) {

          console.log('saveToFireBase -- START | key:', key);

          var defer = $q.defer(),
            cleanedData = angular.copy(saveObject),
            usersRef = ref.child(key);

          // save to local storage
          //$localStorage[key] = cleanedData;

          // save to $rootScope
          $rootScope[key] = cleanedData;

          usersRef.set(cleanedData);
          defer.resolve(true);
          console.log('saveToFireBase -- COMPLETE', key);
          return defer.promise;

        }

      };

    });

})();
