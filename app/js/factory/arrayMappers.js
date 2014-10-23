/**
 * Created by Bouse on 10/2/2014
 */



sicklifesFantasy.factory('$arrayMapper', function ($apiFactory, $textManipulator, $q, $scoringLogic, $date) {

  var mapper = {

    requestList: [],

    /**
     *
     * @param $scope - controller $scope
     * @param team - team which contains teamPlayers
     * @param saveToFireBase
     * @param teamPlayers - from loop
     */
    forEachPlayer: function ($scope, team, teamPlayers) {

      // teamPlayers is a child of team

      teamPlayers.goals = 0; // start at 0;
      teamPlayers.points = 0; // start at 0;
      teamPlayers.domesticGoals = 0;
      teamPlayers.leagueGoals = 0;
      teamPlayers.clGoals = 0;
      teamPlayers.eGoals = 0;

      team.totalPoints = 0;
      team.clGoals = 0;
      team.eGoals = 0;
      team.domesticGoals = 0;

      team.deferredList = team.deferredList || [];

      if (angular.isDefined(teamPlayers.league) && teamPlayers.id !== null) {

        var request = $apiFactory.getData({

          endPointURL: $textManipulator.getPlayerSummaryURL(teamPlayers.league, teamPlayers.id),
          qCallBack: function (result) {

            console.log('qCallback');

            result.data.map(function (i) {

              var league = i.league.slug,
                gameGoals = i.games_goals;

              if ($textManipulator.acceptedLeague(league)) {

                teamPlayers.goals += gameGoals;

                if ($textManipulator.isLeagueGoal(league)) {
                  teamPlayers.leagueGoals += gameGoals;
                }

                if ($textManipulator.isDomesticGoal(league)) {
                  teamPlayers.domesticGoals += gameGoals;
                } else if ($textManipulator.isChampionsLeagueGoal(league)) {
                  teamPlayers.clGoals += gameGoals;
                } else if ($textManipulator.isEuropaGoal(league)) {
                  teamPlayers.eGoals += gameGoals;
                }

                teamPlayers.points += $scoringLogic.calculatePoints(gameGoals, league);

              }

            });

            team.totalPoints += teamPlayers.points;
            team.clGoals += teamPlayers.clGoals;
            team.eGoals += teamPlayers.eGoals;
            team.domesticGoals += teamPlayers.domesticGoals;

          }
        });

      }

      team.deferredList.push(request.promise);

    },

    gameMapper: function (game) {

      var gameMapsObj = {
        alignment: game.alignment === 'away' ? '@' : 'vs',
        vsTeam: game.alignment === 'away' ? game.box_score.event.home_team.full_name : game.box_score.event.away_team.full_name,
        result: function () {

          var result = '';

          if (game.alignment === 'away') {
            if (game.box_score.score.away.score > game.box_score.score.home.score) {
              result = 'W-';
            } else if (game.box_score.score.away.score < game.box_score.score.home.score) {
              result = 'L-';
            } else {
              result = 'T-';
            }
          } else {
            if (game.box_score.score.away.score < game.box_score.score.home.score) {
              result = 'W-';
            } else if (game.box_score.score.away.score > game.box_score.score.home.score) {
              result = 'L-';
            } else {
              result = 'T-';
            }
          }

          return result;

        },
        finalScore: function () {

          var final = '';

          if (game.alignment === 'away') {
            final += game.box_score.score.away.score;
            final += '-' + game.box_score.score.home.score;
          } else {
            final += game.box_score.score.home.score;
            final += '-' + game.box_score.score.away.score;
          }

          return final;

        },
        goalsScored: game.goals || '-',
        leagueName: $textManipulator.formattedLeagueName(game.box_score.event.league.slug),
        datePlayed: $date.create(game.box_score.event.game_date).format('{dd}/{MM}/{yy}')
      };

      return gameMapsObj;

    }
  };

  return mapper;

});