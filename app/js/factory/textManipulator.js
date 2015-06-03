/**
 * Updated by Bouse on 12/06/2014
 */

angular.module('sicklifes')

  .factory('$textManipulator', function () {

    var textManipulator = {

      /**
       * returns a string sans accents
       */
      stripVowelAccent: function (str) {
        var rExps = [
          { re: /[\xC0-\xC6]/g, ch: 'A' },
          { re: /[\xE0-\xE6]/g, ch: 'a' },
          { re: /[\xC8-\xCB]/g, ch: 'E' },
          { re: /[\xE8-\xEB]/g, ch: 'e' },
          { re: /[\xCC-\xCF]/g, ch: 'I' },
          { re: /[\xEC-\xEF]/g, ch: 'i' },
          { re: /[\xD2-\xD6]/g, ch: 'O' },
          { re: /[\xF2-\xF6]/g, ch: 'o' },
          { re: /[\xD9-\xDC]/g, ch: 'U' },
          { re: /[\xF9-\xFC]/g, ch: 'u' },
          { re: /[\xD1]/g, ch: 'N' },
          { re: /[\xF1]/g, ch: 'n' }
        ];

        for (var i = 0, len = rExps.length; i < len; i++)
          str = str.replace(rExps[i].re, rExps[i].ch);

        return str;

      },

      /**
       *
       */
      isDomesticLeague: function (league) {
        return league === 'liga'.toLocaleLowerCase() || league.toLocaleLowerCase() === 'epl' || league.toLocaleLowerCase() === 'seri';
      },

      /**
       *
       */
      isTournamentLeague: function (league) {
        return league.toLocaleLowerCase() === 'chlg' || league.toLocaleLowerCase() === 'uefa';
      },

      /**
       *
       */
      isChampionsLeague: function (league) {
        return league.toLocaleLowerCase() === 'chlg';
      },

      /**
       *
       */
      isEuropaLeague: function (league) {
        return league.toLocaleLowerCase() === 'uefa' || league.toLocaleLowerCase() === 'europa';
      },

      /**
       *
       */
      isWildCardLeague: function (validLeagues) {
        return ((validLeagues.inChlg || validLeagues.inEuro) && !validLeagues.inLiga && !validLeagues.inEPL && !validLeagues.inSeri);

      },

      /**
       * unified string formatter for team names
       * @returns {string}
       */
      teamNameFormatted: function (teamStr) {
        return angular.isDefined(teamStr) ? textManipulator.stripVowelAccent(teamStr).toUpperCase() : '';
      },


      /**
       * unified string formatter for players first and last name
       * @returns {string}
       */
      formattedFullName: function (firstName, lastName) {
        return textManipulator.stripVowelAccent((firstName !== null && firstName !== undefined ? firstName + ' ' : '') + lastName.toUpperCase());
      },

      /**
       *
       */
      formattedLeagueName: function (league) {
        league = league.toLocaleLowerCase();
        if (league === 'uefa' || league === 'europa') {
          return textManipulator.leagueShortNames.euro;
        } else if (league === 'seri') {
          return textManipulator.leagueShortNames.seri;
        } else if (league === 'liga') {
          return textManipulator.leagueShortNames.liga;
        } else if (league === 'epl') {
          return textManipulator.leagueShortNames.epl;
        } else if (league === 'chlg') {
          return textManipulator.leagueShortNames.chlg;
        } else {
          return league.toUpperCase();
        }
      },

      /**
       * returns object will full league names
       */
      leagueLongNames: {
        liga: 'SPANISH PRIMERA DIVISION',
        epl: 'ENGLISH PREMIER LEAGUE',
        seri: 'ITALIAN SERIE A',
        chlg: 'CHAMPIONS LEAGUE',
        euro: 'EUROPA LEAGUE'
      },

      /**
       *
       */
      leagueShortNames: {
        liga: 'LA LIGA',
        epl: 'EPL',
        seri: 'SERIE A',
        chlg: 'CHAMPIONS',
        euro: 'EUROPA'
      },

      /**
       * returns image ref
       * @type {{liga: string, epl: string, seri: string, chlg: string, euro: string}}
       */
      leagueImages: {

        liga: './images/leagues/liga.png',
        epl: './images/leagues/epl.png',
        seri: './images/leagues/seri.png',
        chlg: './images/leagues/chlg.png',
        uefa: './images/leagues/europa.png'

      },

      /**
       *
       */
      properLeagueName: function (league) {
        league = league.toLocaleLowerCase();
        if (league === 'uefa' || league === 'europa') {
          return 'EUROPA LEAGUE';
        } else if (league === 'seri') {
          return 'SERIE A';
        } else if (league === 'liga') {
          return 'LA LIGA';
        } else if (league === 'epl') {
          return 'ENGLISH PREMIER LEAGUE';
        } else if (league === 'chlg') {
          return 'CHAMPIONS LEAGUE';
        } else {
          return league.toUpperCase();
        }
      },

      /**
       *
       */
      getLeagueByURL: function (url) {
        if (url.contains('liga')) {
          return 'liga';
        } else if (url.contains('epl')) {
          return 'epl';
        } else if (url.contains('seri')) {
          return 'seri';
        } else if (url.contains('chlg')) {
          return 'chlg';
        } else if (url.contains('uefa')) {
          return 'uefa';
        } else {
          return 'unknown';
        }
      },

      /**
       *
       * @param result
       * @returns {{}}
       */
      getPlayerValidLeagues: function (result) {
        var leagueObject = {};
        result.data.leagues.forEach(function (league) {
          if (textManipulator.acceptedLeague(league.slug)) {
            if (league.slug === 'liga') leagueObject.inLiga = true;
            if (league.slug === 'epl') leagueObject.inEPL = true;
            if (league.slug === 'seri') leagueObject.inSeri = true;
            if (league.slug === 'chlg') leagueObject.inChlg = true;
            if (league.slug === 'uefa') leagueObject.inEuro = true;
          }
        });
        return leagueObject;
      },

      /**
       *
       */
      result: function (game) {
        var result = '';
        if (game.alignment === 'away') {
          if (game.box_score.score.away.score > game.box_score.score.home.score) {
            result = 'W';
          } else if (game.box_score.score.away.score < game.box_score.score.home.score) {
            result = 'L';
          } else {
            result = 'T';
          }
        } else {
          if (game.box_score.score.away.score < game.box_score.score.home.score) {
            result = 'W';
          } else if (game.box_score.score.away.score > game.box_score.score.home.score) {
            result = 'L';
          } else {
            result = 'T';
          }
        }
        return result;
      },

      /**
       *
       */
      validLeagueNamesFormatted: function (result) {
        var l = '',
          n = 0;
        result.data.teams.forEach(function (team) {
          team.leagues.forEach(function (league) {
            if (textManipulator.acceptedLeague(league.slug)) {
              !n ? l += league.slug : l += '/' + league.slug;
              n += 1;
            }
          });
        });
        return l.toUpperCase();
      },

      /**
       *
       */
      getLeagueSlug: function (result) {

        var leagueString = '';
        result.data.teams.some(function (team, i) {
          team.leagues.some(function (league, j) {
            console.log('slug:', league.slug);
            if (textManipulator.acceptedLeague(league.slug)) {
              leagueString = league.slug;
              return true;
            }
          });
        });
        return leagueString;

      },

      /**
       *
       */
      finalScore: function (game) {
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

      acceptedLeague: function (league) {
        league = league.toLocaleLowerCase();
        return league === 'liga' || league === 'epl' || league === 'seri' || league === 'chlg' || league === 'europa' || league === 'uefa';
      },

      getPlayerPlayerRecordURL: function (leagueSlug, id) {
        return 'http://origin-api.thescore.com/' + leagueSlug.toLowerCase() + '/players/' + id + '/player_records';
      },

      getPlayerSummaryURL: function (leagueSlug, id) {
        return 'http://origin-api.thescore.com/' + leagueSlug.toLowerCase() + '/players/' + id + '/summary';
      },

      getPlayerProfileURL: function (leagueSlug, id) {
        return 'http://origin-api.thescore.com/' + leagueSlug.toLowerCase() + '/players/' + id;
      },

      getTeamInfoURL: function (id) {
        return 'http://origin-api.thescore.com/soccer/teams/' + id;
      },

      getTeamRosterURL: function (leagueSlug, id) {
        return 'http://api.thescore.com/' + leagueSlug.toLowerCase() + '/teams/' + id + '/players/?rpp=-1';
      }

    };

    return textManipulator;

  })
;
