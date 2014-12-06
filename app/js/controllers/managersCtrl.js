/**
 * Created by Bouse on 10/24/2014
 */


sicklifesFantasy.controller('managersCtrl', function ($scope, localStorageService, $apiFactory, $fireBaseService, $routeParams, $arrayMappers, $arrayLoopers, $arrayFilter, $textManipulator, $dateService, $managersService, $location) {

  ////////////////////////////////////////
  /////////////// public /////////////////
  ////////////////////////////////////////

  /**
   * TODO
   */
  $scope.loading = true;

  /**
   * TODO
   */
  $scope.admin = $routeParams.admin;

  /**
   * TODO
   */
  $scope.tableHeader = [
    {
      columnClass: 'col-md-4 col-sm-5 col-xs-6',
      text: 'Player',
      hoverText: 'Player',
      orderCriteria: 'player'
    },
    {
      columnClass: 'col-md-3 col-sm-4 hidden-xs',
      text: 'Team',
      hoverText: 'Team',
      orderCriteria: 'team'
    },
    {
      columnClass: 'col-md-2 hidden-sm hidden-xs',
      text: 'League',
      hoverText: 'League Goals',
      orderCriteria: 'league'
    },
    {
      columnClass: 'col-md-1 col-sm-1 col-xs-2 text-center',
      text: 'DG',
      hoverText: 'Domestic Goals',
      orderCriteria: 'domestic'
    },
    {
      columnClass: 'col-md-1 col-sm-1 col-xs-2 text-center',
      text: 'LG',
      hoverText: 'Champions League Goals',
      orderCriteria: 'champions'
    },
    {
      columnClass: 'col-md-1 col-sm-1 col-xs-2 text-center',
      text: 'P',
      hoverText: 'Total Points',
      orderCriteria: 'points()'
    }
  ];

  /**
   * TODO
   */
  $scope.changeManager = function (selectedManager) {

    $scope.selectedManager = selectedManager;
    $location.url($location.path() + '?manager=' + selectedManager.managerName); // route change

  };

  /**
   * called from ng-click, makes a request from TheScore to get new data
   */
  $scope.updateData = function () {

    console.log('--- updateData ---');
    console.log('////////////////////////////////////');
    console.log('$scope.allManagers', $scope.allManagers);
    console.log('////////////////////////////////////');

    var allLeaguePromises = [];

    $scope.allManagers.forEach(function (manager) {

      manager.totalPoints = 0;
      manager.totalGoals = 0;
      manager.monthlyGoalsLog = [];
      manager.filteredMonthlyGoalsLog = [];

      manager.players.forEach(function (player) {

        player.domesticGoals = 0;
        player.leagueGoals = 0;
        player.points = 0;

        var playerProfileRequest = $apiFactory.getPlayerProfile('soccer', player.id);

        playerProfileRequest.promise.then(function (result) {

          // based on player result data return an object with the valid leagues for this player
          var validLeagues = $textManipulator.getPlayerValidLeagues(result),
            ligaGamesRequest = $apiFactory.getPlayerGameDetails('liga', player.id),
            eplGamesRequest = $apiFactory.getPlayerGameDetails('epl', player.id),
            seriGamesRequest = $apiFactory.getPlayerGameDetails('seri', player.id),
            chlgGamesRequest = $apiFactory.getPlayerGameDetails('chlg', player.id),
            euroGamesRequest = $apiFactory.getPlayerGameDetails('uefa', player.id);

          if (validLeagues.inLiga) {
            ligaGamesRequest.promise.then(function (result) {
              var newInfo = result.data.filter($arrayFilter.filterValidDate.bind($scope, player)).map($arrayMappers.monthlyMapper.bind($scope, manager, player));
              manager.monthlyGoalsLog = manager.monthlyGoalsLog.concat(newInfo);
              manager.filteredMonthlyGoalsLog = manager.filteredMonthlyGoalsLog.concat(newInfo);
            });
            allLeaguePromises.push(ligaGamesRequest.promise);
          }

          if (validLeagues.inEPL) {
            eplGamesRequest.promise.then(function (result) {
              var newInfo = result.data.filter($arrayFilter.filterValidDate.bind($scope, player)).map($arrayMappers.monthlyMapper.bind($scope, manager, player));
              manager.monthlyGoalsLog = manager.monthlyGoalsLog.concat(newInfo);
              manager.filteredMonthlyGoalsLog = manager.filteredMonthlyGoalsLog.concat(newInfo);
            });
            allLeaguePromises.push(eplGamesRequest.promise);
          }

          if (validLeagues.inSeri) {
            seriGamesRequest.promise.then(function (result) {
              var newInfo = result.data.filter($arrayFilter.filterValidDate.bind($scope, player)).map($arrayMappers.monthlyMapper.bind($scope, manager, player));
              manager.monthlyGoalsLog = manager.monthlyGoalsLog.concat(newInfo);
              manager.filteredMonthlyGoalsLog = manager.filteredMonthlyGoalsLog.concat(newInfo);
            });
            allLeaguePromises.push(seriGamesRequest.promise);
          }

          if (validLeagues.inChlg) {
            chlgGamesRequest.promise.then(function (result) {
              var newInfo = result.data.filter($arrayFilter.filterValidDate.bind($scope, player)).map($arrayMappers.monthlyMapper.bind($scope, manager, player));
              manager.monthlyGoalsLog = manager.monthlyGoalsLog.concat(newInfo);
              manager.filteredMonthlyGoalsLog = manager.filteredMonthlyGoalsLog.concat(newInfo);
            });
            allLeaguePromises.push(chlgGamesRequest.promise);
          }

          if (validLeagues.inEuro) {
            euroGamesRequest.promise.then(function (result) {
              var newInfo = result.data.filter($arrayFilter.filterValidDate.bind($scope, player)).map($arrayMappers.monthlyMapper.bind($scope, manager, player));
              manager.monthlyGoalsLog = manager.monthlyGoalsLog.concat(newInfo);
              manager.filteredMonthlyGoalsLog = manager.filteredMonthlyGoalsLog.concat(newInfo);
            });
            allLeaguePromises.push(euroGamesRequest.promise);
          }

        });

      });

    });

  };

  $scope.saveToFireBase = function () {

    console.log('////////////////////////////////////');
    console.log('$scope.allManagers', $scope.allManagers);
    console.log('////////////////////////////////////');

    var saveObject = {
      _syncedFrom: 'managersCtrl',
      _lastSyncedOn: $dateService.syncDate(),
      chester: $scope.allManagers[0],
      frank: $scope.allManagers[1],
      dan: $scope.allManagers[2],
      justin: $scope.allManagers[3],
      mike: $scope.allManagers[4],
      joe: $scope.allManagers[5]
    };

    $fireBaseService.syncLeagueTeamData(saveObject);

  };

  ////////////////////////////////////////
  ////////////// private /////////////////
  ////////////////////////////////////////

  /**
   * defines $scope.selectedTeam
   */
  var chooseTeam = function () {

    if ($routeParams.manager) {
      $scope.allManagers.forEach(function (manager) {
        if (manager.managerName === $routeParams.manager) {
          $scope.selectedManager = manager;
        }
      });
    } else {
      $scope.selectedManager = $scope.allManagers[0];
    }

    //console.log('$scope.selectedManager', $scope.selectedManager);
    //$location.url($location.path() + '?team=' + $scope.selectedTeam.managerName); // route change

  };

  /**
   * modifies array that table is binded to
   */
  var populateTable = function () {

    var masterDefferedList = [];

    $scope.allManagers.forEach(function (manager) {

      manager.deferredList = [];

      // loops through all players and makes request for all goals
      manager.players.forEach($arrayLoopers.forEachPlayer.bind($scope, $scope, manager));

      masterDefferedList = masterDefferedList.concat(manager.deferredList);

      manager.deferredList = null;

    });

    console.log('masterDefferedList.length', masterDefferedList.length);

    $apiFactory.listOfPromises(masterDefferedList, function () {
      console.log('ALL DONE');
    });

  };

  /**
   * contains a reference to each league by key
   */
  var allLeaguesObj = {};

  /**
   * call when firebase data has loaded
   * defines $scope.allManagers
   * @param data
   */
  var fireBaseLoaded = function (data) {

    console.log('fireBaseLoaded');

    $scope.loading = false;

    $scope.allManagers = [
      data.leagueTeamData.chester,
      data.leagueTeamData.frank,
      data.leagueTeamData.dan,
      data.leagueTeamData.justin,
      data.leagueTeamData.mike,
      data.leagueTeamData.joe
    ];

    chooseTeam();

  };

  /**
   * retrieve data from local storage
   */
  var getFromLocalStorage = function () {

    console.log('getFromLocalStorage');
    $scope.loading = false;
    var localManagers = localStorageService.get('leagueTeamData');
    console.log('localManagers', localManagers);

  };


  /**
   * all requests complete
   */
  var allRequestComplete = function () {

    console.log('allRequestComplete');
    $scope.loading = false;
    chooseTeam();
    populateTable();

  };

  /**
   * init function
   */
  var init = function () {

    $fireBaseService.initialize();

    var firePromise = $fireBaseService.getFireBaseData();

    firePromise.promise.then(fireBaseLoaded, getFromLocalStorage);

  };

  init();

});


