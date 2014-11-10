/**
 * Created by Bouse on 11/03/2014
 */

sicklifesFantasy.controller('leaguesCtrl', function ($scope, $apiFactory, $date, $leagueTeams, $location, $routeParams, $arrayMappers, $dateService, $textManipulator, $fireBaseService) {

  ////////////////////////////////////////
  /////////////// public /////////////////
  ////////////////////////////////////////

  $scope.loading = true;

  $scope.admin = $routeParams.admin;

  $scope.tableHeader = [
    {
      columnClass: 'col-md-1 col-sm-1 col-xs-2 small-hpadding',
      text: 'Rank'
    },
    {
      columnClass: 'col-md-4 col-sm-5 col-xs-8 small-hpadding',
      text: 'Player'
    },
    {
      columnClass: 'col-md-2 col-sm-4 hidden-xs small-hpadding',
      text: 'Team'
    },
    {
      columnClass: 'col-md-3 hidden-sm hidden-xs small-hpadding',
      text: 'Owned By'
    },
    {
      columnClass: 'col-md-2 col-sm-2 col-xs-2 text-center small-hpadding',
      text: 'G'
    }
  ];

  $scope.allRequest = [];

  $scope.consolidatedGoalScorers = [];

  $scope.changeLeague = function (league) {
    //
  };

  $scope.updateData = function () {

    console.log('UPDATING...');

    var allLeagues = [];

    // makes a request for all leagues in a loop returns a list of promises
    var allPromises = $apiFactory.getAllLeagues();

    // waits for an array of promises to resolve, sets allLeagues data
    $apiFactory.listOfPromises(allPromises, function (result) {

      allLeagues = [];

      result.forEach(function (league, index) {
        var goalsMap = league.data.goals.map($arrayMappers.goalsMap.bind($arrayMappers, league.leagueURL));
        allLeagues.push({
          name: $textManipulator.properLeagueName(league.leagueName),
          source: goalsMap
        });
        $scope.consolidatedGoalScorers = $scope.consolidatedGoalScorers.concat(goalsMap);
      });

      $scope.allLeagues = allLeagues;

      allRequestComplete();

    });

  };

  $scope.saveToFireBase = function () {

    console.log('////////////////////////////////////');
    console.log('$scope.allLeagues', $scope.allLeagues);
    console.log('////////////////////////////////////');

    var saveObject = {
      _syncedFrom: 'leaguesCtrl',
      _lastSynedOn: $dateService.syncDate(),
      LIGA: $scope.allLeagues[0].source,
      EPL: $scope.allLeagues[1].source,
      SERI: $scope.allLeagues[2].source,
      CHLG: $scope.allLeagues[3].source,
      UEFA: $scope.allLeagues[4].source
    };

    $fireBaseService.syncLeagueData(saveObject);

  };

  ////////////////////////////////////////
  ////////////// private /////////////////
  ////////////////////////////////////////

  var allLeaguesObj = {};

  var fireBaseLoaded = function (data) {

    $scope.loading = false;

    $scope.allLeagues = [
      {
        name: $textManipulator.leagueLongNames.liga,
        source: data.leagueData.LIGA,
        img: $textManipulator.leagueImages.liga
      },
      {
        name: $textManipulator.leagueLongNames.epl,
        source: data.leagueData.EPL,
        img: $textManipulator.leagueImages.epl
      },
      {
        name: $textManipulator.leagueLongNames.seri,
        source: data.leagueData.SERI,
        img: $textManipulator.leagueImages.seri
      },
      {
        name: $textManipulator.leagueLongNames.chlg,
        source: data.leagueData.CHLG,
        img: $textManipulator.leagueImages.chlg
      },
      {
        name: $textManipulator.leagueLongNames.euro,
        source: data.leagueData.UEFA,
        img: $textManipulator.leagueImages.euro
      }
    ];

    $scope.selectedLeague = $scope.allLeagues[0];

    var syncDate = $date.create(data.leagueData._lastSynedOn);

    console.log('syncDate', data.leagueData._lastSynedOn);
    console.log('$scope.allLeagues', $scope.allLeagues);

    if (syncDate.isYesterday()) {
      $scope.updateData();
    }

  };

  var init = function () {

    $fireBaseService.initialize();

    var firePromise = $fireBaseService.getFireBaseData();

    firePromise.promise.then(fireBaseLoaded);

  };

  var allRequestComplete = function () {

    $scope.loading = false;

    $scope.selectedLeague = $scope.allLeagues[0];

    $scope.saveToFireBase();

  };

  init();

});
