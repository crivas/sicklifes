/**
 * Created by Bouse on 09/01/2015
 */

(function () {

  'use strict';

  angular.module('sicklifes')

    .factory('$objectUtils', function ($momentService) {

      return {

        /**
         * resets goal and points count for a manager
         */
        cleanManager: function (m, cleanLogs) {

          cleanLogs = cleanLogs || false;

          m.totalGoals = 0;
          m.totalPoints = 0;
          m.domesticGoals = 0;
          m.clGoals = 0;
          m.eGoals = 0;
          if (cleanLogs) {
            m.monthlyGoalsLog = [];
            m.filteredMonthlyGoalsLog = [];
          }
          return m;

        },

        /**
         *
         * @param p
         * @returns {*}
         */
        playerResetGoalPoints: function (p) {

          p.goals = 0;
          p.points = 0;
          p.domesticGoals = 0;
          p.clGoals = 0;
          p.eGoals = 0;
          return p;

        },

        /**
         *
         * @param m
         */
        managerResetGoalPoints: function (m) {

          m.totalGoals = 0;
          m.totalPoints = 0;
          m.domesticGoals = 0;
          m.clGoals = 0;
          m.eGoals = 0;
          return m;

        },

        /**
         * resets goal and points count for a player
         */
        cleanPlayer: function (p, draftMode) {

          if (p) {
            p.dateOfTransaction = draftMode ? $momentService.leagueStartDate() : $momentService.transactionDate();
            p.goals = 0;
            p.points = 0;
            p.domesticGoals = 0;
            p.clGoals = 0;
            p.eGoals = 0;
            p.playedInLigaGames = false;
            p.playedInEPLGames = false;
            p.playedInSeriGames = false;
            _.each(p.player, function(playerData, key) {
              p[key] = playerData;
            });
            delete p.player;
            return p;
          } else {
            return {};
          }

        }

      };

    });

})();