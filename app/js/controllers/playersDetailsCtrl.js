/**
 * Created by Bouse on 11/03/2014
 */


sicklifesFantasy.controller('playersDetailsCtrl', function ($scope, $apiFactory, $location, $routeParams, $arrayMappers, $textManipulator, $arrayFilter, $managersService, $date, $dateService, $fireBaseService) {

  ////////////////////////////////////////
  /////////////// public /////////////////
  ////////////////////////////////////////

  /*
   * TODO
   */
  $scope.loading = true;

  /*
   * TODO
   */
  $scope.admin = $routeParams.admin;

  /*
   * TODO
   */
  $scope.tableHeader = [
    {
      columnClass: 'col-md-4 col-sm-4 col-xs-6',
      text: 'Opponent'
    },
    {
      columnClass: 'col-md-2 col-sm-1 col-xs-2 text-center',
      text: 'G'
    },
    {
      columnClass: 'col-md-2 hidden-sm hidden-xs text-center',
      text: 'Final Score'
    },
    {
      columnClass: 'col-md-2 col-sm-3 hidden-xs',
      text: 'League'
    },
    {
      columnClass: 'col-md-2 col-sm-3 col-xs-4',
      text: 'Date Played'
    }
  ];

  /*
   * TODO
   */
  $scope.inLiga = false;

  /*
   * TODO
   */
  $scope.inEPL = false;

  /*
   * TODO
   */
  $scope.inSeri = false;

  /*
   * TODO
   */
  $scope.inChlg = false;

  /*
   * TODO
   */
  $scope.inEuro = false;

  /*
   * TODO
   */
  $scope.player = {};


  /*
   * go through all players in  all the managers and update the player details
   */
  $scope.getAllGameLogs = function () {

    $scope.allManagers.forEach(function (manager) {

      manager.players.forEach(function (player) {

        var ligaGamesRequest = $apiFactory.getPlayerGameDetails('liga', player.id),
          eplGamesRequest = $apiFactory.getPlayerGameDetails('epl', player.id),
          seriGamesRequest = $apiFactory.getPlayerGameDetails('seri', player.id),
          chlgGamesRequest = $apiFactory.getPlayerGameDetails('chlg', player.id),
          euroGamesRequest = $apiFactory.getPlayerGameDetails('uefa', player.id);

        player.gamesLog = [];

        ligaGamesRequest.promise.then(function (result) {
          var ligaGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
          player.gamesLog = player.gamesLog.concat(ligaGameDetails);
        });


        eplGamesRequest.promise.then(function (result) {
          var eplGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
          player.gamesLog = player.gamesLog.concat(eplGameDetails);
        });


        seriGamesRequest.promise.then(function (result) {
          var seriGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
          player.gamesLog = player.gamesLog.concat(seriGameDetails);
        });


        chlgGamesRequest.promise.then(function (result) {
          var chlgGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
          player.gamesLog = player.gamesLog.concat(chlgGameDetails);
        });


        euroGamesRequest.promise.then(function (result) {
          var euroGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
          player.gamesLog = player.gamesLog.concat(euroGameDetails);
        });

      });

    });

  };

  ////////////////////////////////////////
  ////////////// private /////////////////
  ////////////////////////////////////////

  var validLeagues = null;

  /**
   * callback for profile end point
   */
  var playerProfileCallBack = function (result) {

    var selectedInt = 0,
      id = $routeParams.playerID,
      teamName = result.data.teams[selectedInt].name,
      leagueName = function () {
        var l = '',
          n = 0;
        result.data.teams.forEach(function (team, i) {
          team.leagues.forEach(function (league, j) {
            if ($textManipulator.acceptedLeague(league.slug)) {
              n ? l += '/' + league.slug : l += league.slug;
              n += 1;
            }
          });
        });
        return l.toUpperCase();
      };

    // based on player result data return an object with the valid leagues for this player
    validLeagues = $textManipulator.getPlayerValidLeagues(result);

    $scope.player.playerName = $textManipulator.formattedFullName(result.data.first_name, result.data.last_name);
    $scope.player.playerTeam = teamName;
    $scope.player.leagueName = leagueName;
    $scope.player.teamLogo = result.data.teams[selectedInt].sportsnet_logos.large;
    $scope.player.playerImage = result.data.headshots.original;

    populatePlayerProfile(result, id);

  };

  /**
   * populates info for specific player
   */
  var populatePlayerProfile = function (result, playerID) {

    var playerLeagueProfileRequest,
      profileLeague = function () {
        var leagueString = '';
        result.data.teams.forEach(function (team, i) {
          team.leagues.forEach(function (league, j) {
            if ($textManipulator.acceptedLeague(league.slug)) {
              leagueString = league.slug;
            }
          });
        });
        return leagueString;
      };

    playerLeagueProfileRequest = $apiFactory.getPlayerProfile(profileLeague(), playerID);
    playerLeagueProfileRequest.promise.then(function (profileData) {
      $scope.player.playerPos = profileData.data.position;
      $scope.player.weight = profileData.data.weight;
      $scope.player.height = profileData.data.height_feet + '\'' + profileData.data.height_inches;
      $scope.player.birthdate = profileData.data.birthdate;
    });

    populateGamesLog();

  };
  
  $scope.leagueImages = $textManipulator.leagueImages;

  /**
   * scrapes thescore.ca api and updates javascript array
   */
  var populateGamesLog = function () {

    var ligaGamesRequest = $apiFactory.getPlayerGameDetails('liga', id),
      eplGamesRequest = $apiFactory.getPlayerGameDetails('epl', id),
      seriGamesRequest = $apiFactory.getPlayerGameDetails('seri', id),
      chlgGamesRequest = $apiFactory.getPlayerGameDetails('chlg', id),
      euroGamesRequest = $apiFactory.getPlayerGameDetails('uefa', id),
      allLeaguePromises = [];

    console.log('////////////////////////////////////////////');
    console.log('validLeagues', validLeagues);
    console.log('////////////////////////////////////////////');

    if (validLeagues.inLiga) {

      ligaGamesRequest.promise.then(function (result) {
        $scope.loading = false;
        $scope.ligaGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
        allGamesLog = allGamesLog.concat($scope.ligaGameDetails);
      }, function () {
        console.log('LIGA FAIL');
      });

      allLeaguePromises.push(ligaGamesRequest.promise);

    }

    if (validLeagues.inEPL) {

      eplGamesRequest.promise.then(function (result) {
        $scope.loading = false;
        $scope.eplGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
        allGamesLog = allGamesLog.concat($scope.eplGameDetails);
      }, function () {
        console.log('EPL FAIL');
      });

      allLeaguePromises.push(eplGamesRequest.promise);
    }

    if (validLeagues.inSeri) {

      seriGamesRequest.promise.then(function (result) {
        $scope.loading = false;
        $scope.seriGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
        allGamesLog = allGamesLog.concat($scope.seriGameDetails);
      }, function () {
        console.log('SERI FAIL');
      });
      allLeaguePromises.push(seriGamesRequest.promise);

    }

    if (validLeagues.inChlg) {

      chlgGamesRequest.promise.then(function (result) {
        $scope.loading = false;
        $scope.chlgGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
        allGamesLog = allGamesLog.concat($scope.chlgGameDetails);
      }, function () {
        console.log('CHLG FAIL');
      });

      allLeaguePromises.push(chlgGamesRequest.promise);
    }

    if (validLeagues.inEuro) {

      euroGamesRequest.promise.then(function (result) {
        $scope.loading = false;
        $scope.euroGameDetails = result.data.filter($arrayFilter.filterAfterDate).map($arrayMappers.gameMapper);
        allGamesLog = allGamesLog.concat($scope.euroGameDetails);
      }, function () {
        console.log('EURO FAIL');
      });

      allLeaguePromises.push(euroGamesRequest.promise);

    }

    $apiFactory.listOfPromises(allLeaguePromises, function () {

      console.log('ALL LEAGUE DATA FULFILLED');
      console.log('$scope.ligaGameDetails', $scope.ligaGameDetails);
      console.log('$scope.eplGameDetails', $scope.eplGameDetails);
      console.log('$scope.seriGameDetails', $scope.seriGameDetails);
      console.log('$scope.chlgGameDetails', $scope.chlgGameDetails);
      console.log('$scope.euroGameDetails', $scope.euroGameDetails);
      //saveToFirebase();

    });

  };

  /**
   * TODO
   */
  var allGamesLog = [];

  /**
   * save data to firebase
   */
  var saveToFirebase = function () {

    console.log('//////////////////////////////////////////');
    console.log('$scope.allManagers', $scope.allManagers);
    console.log('//////////////////////////////////////////');

    var saveObject = {
      _syncedFrom: 'playersDetailsCtrl',
      _lastSynedOn: $dateService.syncDate(),
      chester: $scope.allManagers[0],
      frank: $scope.allManagers[1],
      dan: $scope.allManagers[2],
      justin: $scope.allManagers[3],
      mike: $scope.allManagers[4],
      joe: $scope.allManagers[5]
    };

    $fireBaseService.syncLeagueTeamData(saveObject);

  };

  /**
   * firebase data is loaded
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

    var playerProfileRequest = $apiFactory.getPlayerProfile('soccer', id);
    playerProfileRequest.promise.then(playerProfileCallBack);


  };

  /**
   * TODO
   */
  var id = Number($routeParams.playerID);

  /**
   * TODO
   */
  var init = function () {

    id = Number($routeParams.playerID);

    $fireBaseService.initialize();

    var firePromise = $fireBaseService.getFireBaseData();

    firePromise.promise.then(fireBaseLoaded);

  };

  init();

});