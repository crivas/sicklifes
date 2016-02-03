/**
 * Created by Bouse on 09/01/2015
 */

(function () {

  'use strict';

  angular.module('sicklifes')

    .controller('playersDetailsCtrl', function ($scope, $rootScope, $http, $timeout, apiFactory, $location, $stateParams, arrayMappers, textManipulator, objectUtils, managersService, updateDataUtils, momentService) {

      ////////////////////////////////////////
      /////////////// public /////////////////
      ////////////////////////////////////////

      $rootScope.loading = true;

      /**
       * @description player
       */
      $scope.player = {};

      /**
       * @description league images
       */
      $scope.leagueImages = textManipulator.leagueImages;

      ////////////////////////////////////////
      ////////////// private /////////////////
      ////////////////////////////////////////

      /**
       * @description defines $scope.managersData - call when firebase data has loaded
       * @param result
       */
      var loadData = function (result) {

        $scope.managersData = $rootScope.managersData.data;

        if (angular.isDefined($rootScope.allPlayersIndex)) {
          console.log('player found in allPlayers index');
          $scope.allPlayers = $rootScope.allPlayersIndex;
        }

        //////////////////

        findPlayerByID();

      };

      /**
       * @description find more data on a player by id in the route
       */
      var findPlayerByID = function () {

        var foundPlayer = false;

        // check source
        if (angular.isDefined($scope.allPlayers) && angular.isDefined($scope.allPlayers.data) && angular.isDefined($scope.allPlayers.data[$stateParams.playerId]) && !Array.isArray($scope.allPlayers)) {

          $scope.player = $scope.allPlayers.data[$stateParams.playerId];
          foundPlayer = true;

        } else {

          _.some($scope.managersData, function (manager) {

            if (angular.isDefined(manager.players[$stateParams.playerId])) {
              $scope.player = manager.players[$stateParams.playerId];
              foundPlayer = true;
              return true;
            }

          });

        }

        // check the data of the source data
        if (foundPlayer && angular.isDefined($scope.player._lastSyncedOn) && !momentService.isPastYesterday($scope.player._lastSyncedOn)) {

          console.log('foundPlayer and is up to date', $scope.player.playerName);
          requestUpdateOnPlayer();

        } else {

          console.log('not found player and/or is out of date');
          requestUpdateOnPlayer();

        }

      };

      /**
       * @description
       */
      var requestUpdateOnPlayer = function () {

        if (angular.isUndefinedOrNull($stateParams.playerId)) {
          throw new Error('$stateParams.playerId was not defined, don\'t do that');
        }

        $scope.player = objectUtils.playerResetGoalPoints($scope.player);
        $scope.player.id = $stateParams.playerId;
        $scope.matchingManager = managersService.findPlayerInManagers($stateParams.playerId).manager;

        apiFactory.getPlayerProfile('soccer', $stateParams.playerId)
          .then(arrayMappers.playerInfo.bind(this, $scope.player))
          .then(arrayMappers.playerMapPersonalInfo.bind(this, $scope.player))
          .then(arrayMappers.playerGamesLog.bind(this, {
            player: $scope.player,
            manager: $scope.matchingManager
          }))
          .then(function (result) {

            $scope.player = result;
            $scope.player._lastSyncedOn = momentService.syncDate();

            var lastDays = $scope.lastDays(30);
            var data = [];

            lastDays.forEach(function (calendarDay) {

              $scope.player.gameLogs.eplCompleteLog.forEach(function (log) {

                if (log.datePlayed === calendarDay) {
                  console.log('MATCHING', log.goals);
                  data.push(log.goals);
                } else {
                  data.push(0);
                }

              });

            });

            console.log('player', $scope.player);

            $rootScope.loading = false;

            //$scope.saveToPlayerIndex($scope.player.id , $scope.player);

          });

      };

      /**
       * @description init function
       */
      var init = function () {

        updateDataUtils.updateCoreData(loadData);

      };

      init();

    });

})();
