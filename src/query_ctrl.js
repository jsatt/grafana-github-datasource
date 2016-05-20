import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class GithubDatasourceQueryCtrl extends QueryCtrl {

    constructor($scope, $injector, uiSegmentSrv, $q)  {
        super($scope, $injector);

        this.scope = $scope;
        this.q = $q;
        this.uiSegmentSrv = uiSegmentSrv;

        this.target.user_type = this.target.user_type || 'User';
        this.target.user = this.target.user || '';
        this.target.repo = this.target.repo || '';
        this.target.metric = this.target.metric || '';

        this.repoSegment = uiSegmentSrv.getSegmentForValue(this.target.repo, 'select repository');
        this.metricSegment = uiSegmentSrv.getSegmentForValue(this.target.metric, 'select metric');
    }

    findUser() {
        if(this.target.user){
            this.datasource.findUser(this.target.user).then(resp => {
                let user = resp.data;
                this.target.user = user.login;
                this.target.user_type = user.type;
            });
        }
    }

    getUserType() {
        return [
        {value: 'user', text: 'User'},
        {value: 'org', text: 'Organization'}
        ]
    }

    getRepos() {
        return this.datasource.metricFindQuery({'query': 'repo', 'target': this.target})
            .then(this.uiSegmentSrv.transformToSegments(false));
    }

    getMetricSegments() {
        return this.datasource.metricFindQuery({'query': 'metric', 'target': this.target})
            .then(this.uiSegmentSrv.transformToSegments(false));
    }

    repoChanged() {
        this.target.repo = this.repoSegment.value;
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }

    metricSegmentChanged() {
        this.target.metric = this.metricSegment.value;
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}

GithubDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

