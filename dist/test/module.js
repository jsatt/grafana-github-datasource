'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GithubConfigCtrl = function GithubConfigCtrl() {
  _classCallCheck(this, GithubConfigCtrl);
};

GithubConfigCtrl.templateUrl = 'partials/config.html';

var GithubQueryOptionsCtrl = function GithubQueryOptionsCtrl() {
  _classCallCheck(this, GithubQueryOptionsCtrl);
};

GithubQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

exports.Datasource = _datasource.GithubDatasource;
exports.QueryCtrl = _query_ctrl.GithubDatasourceQueryCtrl;
exports.ConfigCtrl = GithubConfigCtrl;
exports.QueryOptionsCtrl = GithubQueryOptionsCtrl;
//# sourceMappingURL=module.js.map
