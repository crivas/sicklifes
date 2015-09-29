/**
 * Created by Bouse on 09/01/2015
 */

(function () {

  'use strict';

  angular.module('sicklifes')

    .controller('monthlyWinnersCtrl', function ($scope, $timeout, $managersService, $stateParams, $state, $rootScope, $updateDataUtils, $objectUtils, $arrayFilter, $fireBaseService, $localStorage, $momentService) {

      ////////////////////////////////////////
      /////////////// public /////////////////
      ////////////////////////////////////////

      $scope.dataKeyName = 'managersData';

      $rootScope.loading = true;

      var startYear = '2015';
      var endYear = '2016';

      /**
       * table headers
       */
      $scope.tableHeader = [
        {
          columnClass: 'col-md-3 col-sm-4 col-xs-4',
          text: 'Player'
        },
        {
          columnClass: 'col-md-2 hidden-sm hidden-xs',
          text: 'Opponent'
        },
        {
          columnClass: 'col-md-1 col-sm-2 col-xs-2 text-center',
          text: 'Goals'
        },
        {
          columnClass: 'col-md-2 col-sm-2 col-xs-3 text-center',
          text: 'Score'
        },
        {
          columnClass: 'col-md-2 col-sm-2 hidden-xs',
          text: 'League'
        },
        {
          columnClass: 'col-md-2 col-sm-2 col-xs-3',
          text: 'Date'
        }
      ];

      /**
       * all months dropdown options
       * @type {{monthName: string, range: string[]}[]}
       */
      $scope.allMonths = [
        {
          monthName: 'All Months',
          range: ['August 1 ' + startYear, 'June 30 ' + endYear]
        },
        {
          monthName: 'August ' + startYear,
          range: ['August 1 ' + startYear, 'August 31 ' + startYear]
        },
        {
          monthName: 'September ' + startYear,
          range: ['September 1 ' + startYear, 'September 30 ' + startYear]
        },
        {
          monthName: 'October ' + startYear,
          range: ['October 1 ' + startYear, 'October 31 ' + startYear]
        },
        {
          monthName: 'November ' + startYear,
          range: ['November 1 ' + startYear, 'November 30 ' + startYear]
        },
        {
          monthName: 'December ' + startYear,
          range: ['December 1 ' + startYear, 'December 31 ' + startYear]
        },
        {
          monthName: 'January ' + endYear,
          range: ['January 1 ' + endYear, 'January 31 ' + endYear]
        },
        {
          monthName: 'February ' + endYear,
          range: ['February 1 ' + endYear, 'February 28 ' + endYear]
        },
        {
          monthName: 'March ' + endYear,
          range: ['March 1 ' + endYear, 'March 31 ' + endYear]
        },
        {
          monthName: 'April ' + endYear,
          range: ['April 1 ' + endYear, 'April 30 ' + endYear]
        },
        {
          monthName: 'May ' + endYear,
          range: ['May 1 ' + endYear, 'May 31 ' + endYear]
        },
        {
          monthName: 'June ' + endYear,
          range: ['June 1 ' + endYear, 'June 30 ' + endYear]
        }
      ];

      /**
       * the select box model
       * @type {{monthName: string, range: string[]}}
       */
      $scope.selectedMonth = $scope.allMonths[0];

      /**
       * when month option is changed
       */
      $scope.changeMonth = function (month) {
        $scope.selectedMonth = month;
        updateFilter();
      };

      /**
       *
       * @param selectedManager
       */
      $scope.changeManager = function (selectedManager) {

        $scope.selectedManager = selectedManager;
        $state.go($state.current.name, { managerId: selectedManager.managerName.toLowerCase() });

      };

      /**
       *
       * @param managerData
       */
      $scope.onManagersRequestFinished = function (managerData) {
        $rootScope.loading = false;
        //$rootScope.loading = false;
        $scope.managerData = $scope.populateManagersData(managerData);
        $scope.chooseManager($stateParams.managerId);
        //$scope.saveRoster();
      };

      ////////////////////////////////////////
      ////////////// private /////////////////
      ////////////////////////////////////////

      /**
       * filters game log by selected month
       */
      var updateFilter = function () {

        console.log('monthlyWinnersCtrl --> updateFilter');

        _.each($scope.managersData, function (manager) {

          _.each(manager.players, function (player) {

            manager = $objectUtils.cleanManager(manager, false);
            manager.filteredMonthlyGoalsLog = _.filter(manager.monthlyGoalsLog, $arrayFilter.filterOnMonth.bind($scope, manager, $scope.selectedMonth, player));

          });

        });

      };

      /**
       * callback for when firebase is loaded
       * @param result {object} - response
       */
      var loadData = function (result) {

        console.log('///////////////////');
        console.log('result:', result);
        console.log('///////////////////');

        $rootScope.fireBaseReady = true;

        if ($scope.checkYesterday(result._lastSyncedOn)) {

          console.log('-- data is too old --');

          $rootScope.loading = false;

          console.log('syncDate:', result._lastSyncedOn);

          $scope.startFireBase(function () {

            $rootScope.fireBaseReady = true;

            // define managerData on scope and $rootScope
            $scope.managerData = $scope.populateManagersData(result.data);

            // define the current manager
            $scope.chooseManager($stateParams.managerId);

            // define selectedManager by managerId
            $scope.selectedManager = $scope.managerData[$stateParams.managerId];

            $updateDataUtils.updateAllManagerData(onManagersRequestFinished);

          });

        } else {

          console.log('-- data is up to date --');

          $rootScope.loading = false;
          $scope.managerData = $scope.populateManagersData(result.data);
          $scope.chooseManager($stateParams.managerId);

        }

      };

      /**
       *
       * @param managerData
       */
      var onManagersRequestFinished = function (managerData) {
        console.log('onManagersRequestFinished');
        $rootScope.loading = false;
        //$scope.managerData = $scope.populateManagersData(managerData);
        //$scope.chooseManager($stateParams.managerId);
        $scope.saveRoster();
      };

      var init = function () {

        if (angular.isDefined($rootScope[$scope.dataKeyName])) {

          console.log('load from $rootScope');
          loadData($rootScope[$scope.dataKeyName]);

        } else if (angular.isDefined($localStorage[$scope.dataKeyName])) {

          console.log('load from local storage');
          loadData($localStorage[$scope.dataKeyName]);

        } else {


          $scope.startFireBase(function (firebaseData) {

            console.log('load from firebase');
            loadData(firebaseData[$scope.dataKeyName]);

          });

        }

        $scope.updateAllManagerData = $updateDataUtils.updateAllManagerData;

      };

      init();

    });

})();