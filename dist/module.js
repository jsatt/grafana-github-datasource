'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  var GithubDatasource, GithubDatasourceQueryCtrl, GithubConfigCtrl, GithubQueryOptionsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      GithubDatasource = _datasource.GithubDatasource;
    }, function (_query_ctrl) {
      GithubDatasourceQueryCtrl = _query_ctrl.GithubDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', GithubConfigCtrl = function GithubConfigCtrl() {
        _classCallCheck(this, GithubConfigCtrl);
      });

      GithubConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', GithubQueryOptionsCtrl = function GithubQueryOptionsCtrl() {
        _classCallCheck(this, GithubQueryOptionsCtrl);
      });

      GithubQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('Datasource', GithubDatasource);

      _export('QueryCtrl', GithubDatasourceQueryCtrl);

      _export('ConfigCtrl', GithubConfigCtrl);

      _export('QueryOptionsCtrl', GithubQueryOptionsCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
