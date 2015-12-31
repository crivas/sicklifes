/**
 * Created by Bouse on 09/01/2015
 */

(function () {

  'use strict';

  angular.module('sicklifes')

    .factory('arrayFilter', function (momentService) {

      var arrayFilters = {};

      /**
       * @description the date the league starts capturing data
       * @returns {string}
       */
      arrayFilters.leagueStartDate = 'August 1 2015';

      /**
       * @description filters out any games after aug 1
       * @returns {boolean}
       */
      arrayFilters.filterAfterDate = function (game) {
        //var gameDate = momentService.getDate(new Date(game.box_score.event.game_date));
        var gameDate = moment(new Date(game.datePlayed));
        return gameDate.isAfter(arrayFilters.leagueStartDate);
      };

      /**
       * @description filters out any games after from players added or dropped aug 1
       * @returns {boolean}
       */
      arrayFilters.filterOnValidGoals = function (player, game) {
        var gameDate = moment(new Date(game.datePlayed));
        if (player.status === 'added') {
          return gameDate.isAfter(player.dateOfTransaction);
        } else if (player.status === 'dropped') {
          return gameDate.isBefore(player.dateOfTransaction);
        } else {
          return gameDate.isAfter(arrayFilters.leagueStartDate)
        }
      };

      /**
       * @description
       * @param selectedMonth
       * @param game
       * @returns {boolean}
       */
      arrayFilters.isSelectedMonth = function (selectedMonth, game) {
        var gameDate = game.rawDatePlayed || moment(new Date(game.box_score.event.game_date)),
          scoredAGoal = game.goals ? true : false,
          isBetween = gameDate.isBetween(selectedMonth.range[0], selectedMonth.range[1]);
        return isBetween && scoredAGoal;
      };

      /**
       * @description filters on specific month and if 1 or more goals
       * @param manager
       * @param selectedMonth
       * @param player
       * @param game
       * @returns {boolean}
       */
      arrayFilters.filterOnMonth = function (selectedMonth, game) {
        var gameDate = momentService.getDate(game.originalDate),
          isBetween = gameDate.isBetween(selectedMonth.range[0], selectedMonth.range[1]);
        return isBetween;
      };

      return arrayFilters;

    });

})();
