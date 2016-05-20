'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GithubDatasourceQueryCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GithubDatasourceQueryCtrl = exports.GithubDatasourceQueryCtrl = function (_QueryCtrl) {
    _inherits(GithubDatasourceQueryCtrl, _QueryCtrl);

    function GithubDatasourceQueryCtrl($scope, $injector, uiSegmentSrv, $q) {
        _classCallCheck(this, GithubDatasourceQueryCtrl);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GithubDatasourceQueryCtrl).call(this, $scope, $injector));

        _this.scope = $scope;
        _this.q = $q;
        _this.uiSegmentSrv = uiSegmentSrv;

        _this.target.user_type = _this.target.user_type || 'User';
        _this.target.user = _this.target.user || '';
        _this.target.repo = _this.target.repo || '';
        _this.target.metric = _this.target.metric || '';

        _this.repoSegment = uiSegmentSrv.getSegmentForValue(_this.target.repo, 'select repository');
        _this.metricSegment = uiSegmentSrv.getSegmentForValue(_this.target.metric, 'select metric');
        return _this;
    }

    _createClass(GithubDatasourceQueryCtrl, [{
        key: 'findUser',
        value: function findUser() {
            var _this2 = this;

            if (this.target.user) {
                this.datasource.findUser(this.target.user).then(function (resp) {
                    var user = resp.data;
                    _this2.target.user = user.login;
                    _this2.target.user_type = user.type;
                });
            }
        }
    }, {
        key: 'getUserType',
        value: function getUserType() {
            return [{ value: 'user', text: 'User' }, { value: 'org', text: 'Organization' }];
        }
    }, {
        key: 'getRepos',
        value: function getRepos() {
            return this.datasource.metricFindQuery({ 'query': 'repo', 'target': this.target }).then(this.uiSegmentSrv.transformToSegments(false));
        }
    }, {
        key: 'getMetricSegments',
        value: function getMetricSegments() {
            return this.datasource.metricFindQuery({ 'query': 'metric', 'target': this.target }).then(this.uiSegmentSrv.transformToSegments(false));
        }
    }, {
        key: 'repoChanged',
        value: function repoChanged() {
            this.target.repo = this.repoSegment.value;
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
        }
    }, {
        key: 'metricSegmentChanged',
        value: function metricSegmentChanged() {
            this.target.metric = this.metricSegment.value;
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
        }
    }]);

    return GithubDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

GithubDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
