/**
 * Created by Bouse on 09/01/2015
 */

(function () {

  'use strict';

  angular.module('sicklifes')

    .controller('adminCtrl', function ($scope, $timeout, fireBaseService, apiFactory, updateDataUtils, momentService, managersService) {

      /**
       * TODO
       */
      $scope.loading = true;

      /**
       * TODO
       */
      $scope.managersTableHeader = [
        {
          columnClass: 'col-md-3 col-sm-3 col-xs-4',
          text: 'Player',
          hoverText: 'Player',
          orderCriteria: 'playerName'
        },
        {
          columnClass: 'col-md-2 col-sm-3 col-xs-4',
          text: 'Team',
          hoverText: 'Team',
          orderCriteria: 'teamName'
        },
        {
          columnClass: 'col-md-2 col-sm-2 hidden-xs',
          text: 'League',
          hoverText: 'League',
          orderCriteria: 'leagueName'
        },
        {
          columnClass: 'col-md-1 col-sm-2 col-xs-2 text-center',
          text: 'TG',
          hoverText: 'Total Goals',
          orderCriteria: 'goals'
        },
        {
          columnClass: 'col-md-1 hidden-sm hidden-xs text-center',
          text: 'DG',
          hoverText: 'Domestic Goals',
          orderCriteria: 'domesticGoals'
        },
        {
          columnClass: 'col-md-1 hidden-sm hidden-xs text-center',
          text: 'CLG',
          hoverText: 'Champions League Goals',
          orderCriteria: 'clGoals'
        },
        {
          columnClass: 'col-md-1 hidden-sm hidden-xs text-center',
          text: 'ELG',
          hoverText: 'Europa League Goals',
          orderCriteria: 'eGoals'
        },
        {
          columnClass: 'col-md-1 col-sm-2 col-xs-2 text-center',
          text: 'TP',
          hoverText: 'Total Points',
          orderCriteria: 'points()'
        }
      ];

      $scope.allPlayersTableHeader = [
        {
          columnClass: 'col-md-1 col-sm-2 col-xs-2',
          text: 'ID'
        },
        {
          columnClass: 'col-md-3 col-sm-4 col-xs-4',
          text: 'Player'
        },
        {
          columnClass: 'col-md-3 col-sm-6 col-xs-4',
          text: 'Owned By'
        },
        {
          columnClass: 'col-md-2 col-sm-6 col-xs-4',
          text: 'League'
        },
        {
          columnClass: 'col-md-3 col-sm-6 col-xs-4',
          text: 'Team'
        }
      ];


      /**
       * save data to firebase
       */
      $scope.saveToFireBase = function () {

        console.log('////////////////////////////////////');
        console.log('$scope.allPlayers', $scope.allPlayers, '|', $scope.allPlayers.length);
        console.log('////////////////////////////////////');

        var allPlayersObject = {
          _syncedFrom: 'adminCtrl',
          _lastSyncedOn: momentService.syncDate(),
          allPlayers: $scope.allPlayers
        };

        fireBaseService.syncPlayerPoolData(allPlayersObject);

        console.log('////////////////////////////////////');
        console.log('$scope.managerData', $scope.managerData);
        console.log('////////////////////////////////////');

        var managersObject = {
          _syncedFrom: 'adminCtrl',
          _lastSyncedOn: momentService.syncDate(),
          chester: $scope.managerData[0],
          frank: $scope.managerData[1],
          dan: $scope.managerData[2],
          justin: $scope.managerData[3],
          mike: $scope.managerData[4],
          joe: $scope.managerData[5]
        };

        fireBaseService.syncManagersData(managersObject);

      };

      /**
       *
       */
      $scope.resetToDefault = function () {

        $scope.managerData = managersService.getAllPlayers();

        console.log('////////////////////////////////////');
        console.log('$scope.managerData', $scope.managerData);
        console.log('////////////////////////////////////');

      };

      $scope.allPlayers = [];

      /**
       * click function binding to fetch player pool data after firebase is loaded
       * @type {null}
       */
      $scope.updatePlayerPoolData = null;

      /**
       * click function binding to fetch manager and player data after firebase is loaded
       * @type {null}
       */
      $scope.updateAllManagerData = null;

      ////////////////////////////////////
      ////////////////////////////////////
      ////////////////////////////////////

      var chooseTeam = function () {

        if ($routeParams.manager) {
          $scope.managerData.forEach(function (manager) {
            if (manager.managerName === $routeParams.manager) {
              $scope.selectedManager = manager;
            }
          });
        } else {
          $scope.selectedManager = $scope.managerData[0];
        }

      };

      /**
       * call when firebase data has loaded
       * defines $scope.managerData
       * @param data
       */
      var fireBaseLoaded = function (data) {

        $scope.allPlayers = data.allPlayersData.allPlayers;

        $scope.managerData = [
          data.managerData.chester,
          data.managerData.frank,
          data.managerData.dan,
          data.managerData.justin,
          data.managerData.mike,
          data.managerData.joe
        ];

        $scope.updatePlayerPoolData = updateDataUtils.updatePlayerPoolData.bind($scope, $scope.allPlayers);

        $scope.updateAllManagerData = updateDataUtils.updateAllManagerData.bind($scope, $scope.managerData);

        chooseTeam();

        console.log('syncDate allPlayersData', data.allPlayersData._lastSyncedOn);
        console.log('syncDate leagueData', data.leagueData._lastSyncedOn);
        console.log('syncDate managerData', data.managerData._lastSyncedOn);

        $scope.loading = false;

      };

      /**
       * init function
       */
      var init = function () {

        fireBaseService.initialize($scope);
        var firePromise = fireBaseService.getFireBaseData();
        firePromise.promise.then(fireBaseLoaded);

      };

      /**
       * all requests complete
       */
      var allRequestComplete = function () {

        $scope.loading = false;
        $scope.populateTable();

      };

      $timeout(init, 250);

    });

})();