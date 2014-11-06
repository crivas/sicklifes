/**
 * Created by Bouse on 10/24/2014
 */


sicklifesFantasy.controller('managersCtrl', function ($scope, localStorageService, $apiFactory, $fireBaseService, $routeParams, $arrayMappers, $arrayLoopers, $dateService, $leagueTeams, $location) {

  /**
   * TODO
   */
  $scope.loading = true;

  $scope.admin = $routeParams.admin;

  /**
   * TODO
   */
  $scope.tableHeader = [
    {
      columnClass: 'col-md-4 col-sm-5 col-xs-6',
      text: 'Player',
      hoverText: 'Player',
      orderCriteria: ''
    },
    {
      columnClass: 'col-md-3 col-sm-4 hidden-xs',
      text: 'Team',
      hoverText: 'Team',
      orderCriteria: ''
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
  $scope.changeTeam = function (selectedTeam) {

    $scope.selectedTeam = selectedTeam;
    $location.url($location.path() + '?team=' + selectedTeam.personName); // route change

  };

  /**
   * builds table
   */
  $scope.populateTable = function () {

    console.log('$scope.populateTable');

    var masterDefferedList = [];

    $scope.allManagers.forEach(function (manager) {

      manager.deferredList = [];

      // loops through all players and makes request for all goals
      manager.players.forEach($arrayLoopers.forEachPlayer.bind($scope, $scope, manager));

      masterDefferedList = masterDefferedList.concat(manager.deferredList);

      manager.deferredList = null;

    });

    $apiFactory.listOfPromises(masterDefferedList, function () {
      console.log('deferredList COMPLETE');
    });

  };

  /**
   * called from ng-click, makes a request from TheScore to get new data
   */
  $scope.updateData = function () {

    console.log('updateData');

    allLeaguesObj = {};

    // makes a request for all leagues in a loop returns a list of promises
    var allPromises = $apiFactory.getAllLeagues();

    // waits for an array of promises to resolve, sets allLeagues data
    $apiFactory.listOfPromises(allPromises, function (result) {

      $scope.allLeagues = [];

      result.forEach(function (league, index) {
        var goalsMap = league.data.goals.map($arrayMappers.goalsMap.bind($arrayMappers, league.leagueURL));
        allLeaguesObj[league.leagueName] = goalsMap;
        $scope.allLeagues = $scope.allLeagues.concat(goalsMap);
      });

      allRequestComplete();

    });

  };

  $scope.saveToFireBase = function () {

    console.log('////////////////////////////////////');
    console.log('$scope.allManagers', $scope.allManagers);
    console.log('////////////////////////////////////');

    var saveObject = {
      _syncedFrom: 'managersCtrl',
      _lastSyncedOn: $dateService.syncDate(),
      __allLeagues: $scope.allLeagues,
      chester: $scope.allManagers[0],
      frank: $scope.allManagers[1],
      dan: $scope.allManagers[2],
      justin: $scope.allManagers[3],
      mike: $scope.allManagers[4],
      joe: $scope.allManagers[5]
    };

    $fireBaseService.syncLeagueTeamData(saveObject);

  };

  ////////////////////////////////////
  ////////////////////////////////////
  ////////////////////////////////////

  /**
   * defines $scope.selectedTeam
   */
  var chooseTeam = function () {

    if ($routeParams.team) {
      $scope.allManagers.forEach(function (team) {
        if (team.personName === $routeParams.team) {
          $scope.selectedTeam = team;
        }
      });
    } else {
      $scope.selectedTeam = $scope.allManagers[0];
    }

    console.log('$scope.selectedTeam', $scope.selectedTeam);

    $location.url($location.path() + '?team=' + $scope.selectedTeam.personName); // route change

  };

  var allLeaguesObj = {};

  /**
   * init function
   */
  var init = function () {

    // TODO - implement localStorage save
    $fireBaseService.initialize();

    var firePromise = $fireBaseService.getFireBaseData();

    firePromise.promise.then(function (data) {

      $scope.loading = false;

      $scope.allManagers = [
        data.leagueTeamData.chester,
        data.leagueTeamData.frank,
        data.leagueTeamData.dan,
        data.leagueTeamData.justin,
        data.leagueTeamData.mike,
        data.leagueTeamData.joe
      ];

      //$scope.allPlayers = data._allLeagues;

      chooseTeam();


    });

  };

  /**
   * all requests complete
   */
  var allRequestComplete = function () {

    console.log('allRequestComplete');

    $scope.loading = false;

    chooseTeam();

    $scope.populateTable();

  };

  init();

});


