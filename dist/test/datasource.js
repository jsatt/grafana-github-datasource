'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GithubDatasource = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _table_model = require('app/core/table_model');

var TableModel = _interopRequireWildcard(_table_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GithubDatasource = exports.GithubDatasource = function () {
    function GithubDatasource(instanceSettings, $q, backendSrv) {
        _classCallCheck(this, GithubDatasource);

        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;

        this.q = $q;
        this.backendSrv = backendSrv;
    }

    _createClass(GithubDatasource, [{
        key: 'query',
        value: function query(options) {
            var _this = this;

            var opts = angular.copy(options);
            var query = this.buildQueryParameters(opts);

            if (query.targets.length <= 0) {
                return this.q.when([]);
            }

            return this.q.all(_lodash2.default.map(query.targets, function (target) {
                return _this.buildSeries(target);
            })).then(function (results) {
                return { 'data': results };
            });;
        }
    }, {
        key: 'testDatasource',
        value: function testDatasource() {
            return this.backendSrv.datasourceRequest({
                url: this.url,
                method: 'GET'
            }).then(function (response) {
                if (response.status === 200) {
                    return { status: "success", message: "Data source is working", title: "Success" };
                }
            });
        }
    }, {
        key: 'findUser',
        value: function findUser(user_str) {
            return this.backendSrv.datasourceRequest({
                url: this.url + '/users/' + user_str,
                method: 'GET'
            });
        }
    }, {
        key: 'metricFindQuery',
        value: function metricFindQuery(options) {
            if (options.query === 'repo') {
                return this.getRepos(options.target);
            } else if (options.query === 'metric') {
                if (options.target.user && options.target.repo) {
                    return this.q.when([{ 'text': 'BranchStatus' }]);
                }
            }

            return this.q.when([]);
        }
    }, {
        key: 'buildQueryParameters',
        value: function buildQueryParameters(options) {
            //remove placeholder targets
            options.targets = _lodash2.default.filter(options.targets, function (target) {
                return target.metric;
            });

            return options;
        }
    }, {
        key: 'getUserType',
        value: function getUserType(type) {
            if (type === 'Organization') {
                return 'orgs';
            } else {
                return 'users';
            }
        }
    }, {
        key: 'getRepos',
        value: function getRepos(target) {
            var user_type = this.getUserType(target.user_type);
            return this.backendSrv.datasourceRequest({
                url: this.url + '/' + user_type + '/' + target.user + '/repos',
                params: { 'per_page': 100 },
                method: 'GET'
            }).then(function (resp) {
                return _lodash2.default.map(resp.data, function (v, i) {
                    return { 'text': v.name, 'value': v.name };
                });
            }, function (resp, a, b, c) {
                console.error(resp, a, b, c);
            });
        }
    }, {
        key: 'getBranches',
        value: function getBranches(target) {
            return this.backendSrv.datasourceRequest({
                url: this.url + '/repos/' + target.user + '/' + target.repo + '/branches',
                params: { 'per_page': 100 },
                method: 'GET'
            });
        }
    }, {
        key: 'getRefStatus',
        value: function getRefStatus(target, ref) {
            return this.backendSrv.datasourceRequest({
                url: this.url + '/repos/' + target.user + '/' + target.repo + '/commits/' + ref + '/status',
                params: { 'per_page': 100 },
                method: 'GET'
            });
        }
    }, {
        key: 'buildSeries',
        value: function buildSeries(target) {
            var _this2 = this;

            var self = this;
            if (target.metric === 'BranchStatus') {
                var _ret = function () {
                    var table = new TableModel.default();
                    table.columns = [{ 'text': 'Branch' }, { 'text': 'Status', 'sort': true }];
                    var rows = [];

                    return {
                        v: _this2.getBranches(target).then(function (resp) {
                            return self.q.all(_lodash2.default.map(resp.data, function (branch) {
                                var row = { 'name': branch.name, 'status': -1 };
                                rows.push(row);
                                return self.getRefStatus(target, branch.name).then(function (resp) {
                                    var status_map = {
                                        'success': 1,
                                        'pending': 0,
                                        'failure': -1
                                    };
                                    row.status = status_map[resp.data.state];
                                });
                            }));
                        }).then(function () {
                            ;
                            _lodash2.default.forEach(rows, function (row) {
                                table.rows.push([row.name, row.status]);
                            });
                            return table;
                        })
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
            return [];
        }
    }]);

    return GithubDatasource;
}();
//# sourceMappingURL=datasource.js.map
