angular.module("sicklifesFantasy").run(["$templateCache", function($templateCache) {$templateCache.put("views/leagues.html","<nav-menu></nav-menu>\r\n\r\n<preloader loading=\'loading\'></preloader>\r\n\r\n<div ng-if=\'!loading\' class=\'panel-body\'>\r\n\r\n  <h2>Leagues</h2>\r\n\r\n  <select class=\'form-control\' ng-model=\'selectedLeague\' ng-options=\'option.name for option in allLeagues\'\r\n          ng-change=\'changeLeague(selectedLeague)\'></select>\r\n\r\n  <div class=\'fantasy-table\'>\r\n\r\n    <h2>{{selectedLeague.name}}</h2>\r\n\r\n    <div class=\'header\'>\r\n      <div ng-class=\'[header.columnClass]\' ng-repeat=\'header in tableHeader\'>{{header.text}}</div>\r\n    </div>\r\n\r\n    <div class=\'table-body\'>\r\n      <div class=\'row\' ng-repeat=\'scorer in selectedLeague.source\'>\r\n        <div class=\'col-md-1 col-sm-2 col-xs-2 small-hpadding\'>{{scorer.rank}}</div>\r\n        <div class=\'col-md-5 col-sm-4 col-xs-8 small-hpadding\'><a ng-href=\'#/player-details/{{scorer.id}}\'>{{scorer.playerName}}</a></div>\r\n        <div class=\'col-md-4 col-sm-4 hidden-xs small-hpadding bold small-text\'>{{scorer.teamName}}</div>\r\n        <div class=\'col-md-2 col-sm-2 col-xs-2 text-center small-hpadding\'>{{scorer.goals}}</div>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n\r\n</div>\r\n\r\n\r\n");
$templateCache.put("views/player-details.html","<nav-menu></nav-menu>\r\n\r\n<preloader loading=\'loading\'></preloader>\r\n\r\n<div ng-if=\'!loading\' class=\'panel-body\'>\r\n\r\n  <h2>Players Details</h2>\r\n\r\n  <div class=\'jumbotron\'>\r\n\r\n    <h1 class=\'player-name\'>{{player.playerName}}</h1>\r\n\r\n    <img class=\'inline-image\' width=\'60\' height=\'60\' ng-src=\'{{player.teamLogo}}\'/>\r\n\r\n    <h3 class=\'inline-image\'>{{player.playerTeam}}</h3>\r\n\r\n    <img class=\'pull-left profile-pic\' width=\'100\' height=\'100\' ng-src=\'{{player.playerImage}}\'/>\r\n\r\n  </div>\r\n\r\n  <player-details-table game-details=\'ligaGameDetails\' table-header=\'tableHeader\' league-name=\'LIGA Games\'></player-details-table>\r\n\r\n  <player-details-table game-details=\'eplGameDetails\' table-header=\'tableHeader\' league-name=\'EPL Games\'></player-details-table>\r\n\r\n  <player-details-table game-details=\'seriGameDetails\' table-header=\'tableHeader\' league-name=\'Serie A Games\'></player-details-table>\r\n\r\n  <player-details-table game-details=\'chlgGameDetails\' table-header=\'tableHeader\' league-name=\'Champions League Games\'></player-details-table>\r\n\r\n  <player-details-table game-details=\'euroGameDetails\' table-header=\'tableHeader\' league-name=\'Europa League Games\'></player-details-table>\r\n\r\n</div>");
$templateCache.put("views/players.html","<nav-menu></nav-menu>\r\n\r\n<preloader loading=\'loading\'></preloader>\r\n\r\n<div ng-if=\'!loading\' class=\'panel-body\'>\r\n\r\n  <h2>Players</h2>\r\n\r\n  <select class=\'form-control\' ng-model=\'selectedTeam\' ng-options=\'option.personName for option in allTeams\'\r\n          ng-change=\'changeTeam(selectedTeam)\'></select>\r\n\r\n  <p><b>Name:</b> {{selectedTeam.personName}}</p>\r\n\r\n  <!--<p><b>Team Name:</b> {{selectedTeam.teamName}}</p>-->\r\n\r\n  <p><b>Total Points:</b> {{selectedTeam.totalPoints}}</p>\r\n\r\n  <div class=\'fantasy-table\'>\r\n\r\n    <div class=\'header\'>\r\n      <div ng-class=\'[header.columnClass]\' ng-repeat=\'header in tableHeader\'><a class=\'clickable\'>{{header.text}}</a>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\'table-body\'>\r\n      <div class=\'row\' ng-repeat=\'scorer in selectedTeam.players\'>\r\n        <div class=\'col-md-4 col-sm-5 col-xs-6\'><a ng-href=\'#/player-details/{{scorer.id}}\'>{{scorer.playerName}}</a></div>\r\n        <div class=\'col-md-3 col-sm-4 hidden-xs small-text bold\'>{{scorer.teamName}}</div>\r\n        <div class=\'col-md-2 hidden-sm hidden-xs\'>{{scorer.league}}</div>\r\n        <div class=\'col-md-1 col-sm-1 col-xs-2 text-center\'>{{scorer.domesticGoals}}</div>\r\n        <div class=\'col-md-1 col-sm-1 col-xs-2 text-center\'>{{scorer.leagueGoals}}</div>\r\n        <div class=\'col-md-1 col-sm-1 col-xs-2 text-center\'>{{scorer.points}}</div>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n\r\n</div>");
$templateCache.put("views/standings.html","<nav-menu></nav-menu>\r\n\r\n<preloader loading=\'loading\'></preloader>\r\n\r\n<div ng-if=\'!loading\' class=\'panel-body\'>\r\n\r\n  <h2>Standings</h2>\r\n\r\n  <div class=\'fantasy-table\'>\r\n\r\n    <div class=\'header\'>\r\n      <div ng-class=\'[header.columnClass]\' ng-repeat=\'header in tableHeader\'><a class=\'clickable\' ng-title=\'{{header.hoverTitle}}\'>{{header.text}}</a></div>\r\n    </div>\r\n\r\n    <div class=\'table-body\'>\r\n      <div class=\'row\' ng-repeat=\'team in allTeams | orderBy:\"totalPoints\":true\'>\r\n        <div class=\'col-md-4 col-xs-4 small-hpadding\'><a ng-href=\'#/players?team={{team.personName}}\'>{{team.personName}}</a></div>\r\n        <div class=\'col-md-2 col-xs-2 small-hpadding text-center\'>{{team.domesticGoals}}</div>\r\n        <div class=\'col-md-2 col-xs-2 small-hpadding text-center\'>{{team.clGoals}}</div>\r\n        <div class=\'col-md-2 col-xs-2 small-hpadding text-center\'>{{team.eGoals}}</div>\r\n        <div class=\'col-md-2 col-xs-2 small-hpadding text-center\'>{{team.totalPoints}}</div>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n\r\n</div>\r\n\r\n\r\n");
$templateCache.put("views/directives/nav.html","<ul class=\'nav nav-pills sicklifes-menu\'>\r\n  <li ng-class=\'{active:isActive(\"/leagues/\")}\'><a href=\'#/leagues\'>Leagues</a></li>\r\n  <li ng-class=\'{active:isActive(\"/players/\")}\'><a href=\'#/players\'>Players</a></li>\r\n  <li ng-class=\'{active:isActive(\"/standings/\")}\'><a href=\'#/standings\'>Standings</a></li>\r\n</ul>\r\n");
$templateCache.put("views/directives/player-details-table.html","<div class=\'fantasy-table\' ng-if=\'gameDetails.length > 0\'>\r\n\r\n  <h4>{{leagueName}}</h4>\r\n\r\n  <div class=\'header\'>\r\n    <div ng-class=\'[header.columnClass]\' ng-repeat=\'header in tableHeader\'><a class=\'clickable\'>{{header.text}}</a>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\'table-body\'>\r\n    <div class=\'row\' ng-repeat=\'game in gameDetails\'>\r\n      <div class=\'col-sm-5 col-xs-10\'>{{game.alignment}} {{game.vsTeam}}</div>\r\n      <div class=\'col-sm-1 col-xs-2 text-center\'>{{game.goalsScored}}</div>\r\n      <div class=\'col-sm-3 hidden-xs\'>{{game.leagueName}}</div>\r\n      <div class=\'col-sm-3 hidden-xs\'>{{game.datePlayed}}</div>\r\n    </div>\r\n  </div>\r\n\r\n</div>");
$templateCache.put("views/directives/preloader.html","<div ng-if=\'loading\' class=\'ajax-loader\'>\r\n  <div class=\'equalizer-bars\'>\r\n    <div class=\'rect1\'></div>\r\n    <div class=\'rect2\'></div>\r\n    <div class=\'rect3\'></div>\r\n    <div class=\'rect4\'></div>\r\n    <div class=\'rect5\'></div>\r\n  </div>\r\n</div>");}]);