import _ from "lodash";
import * as TableModel from 'app/core/table_model';

export class GithubDatasource {

    constructor(instanceSettings, $q, backendSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;

        this.q = $q;
        this.backendSrv = backendSrv;
    }

    query(options) {
        let opts = angular.copy(options);
        let query = this.buildQueryParameters(opts);

        if (query.targets.length <= 0) {
            return this.q.when([]);
        }

        return this.q.all(_.map(query.targets, target => {
            return this.buildSeries(target);
        })).then(results => {
            return {'data': results} 
        });;

    }

    testDatasource() {
        return this.backendSrv.datasourceRequest({
            url: this.url,
            method: 'GET'
        }).then(response => {
            if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
            }
        });
    }

    findUser(user_str) {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/users/' + user_str,
            method: 'GET'
        })
    }

    metricFindQuery(options) {
        if(options.query === 'repo'){
            return this.getRepos(options.target);
        }else if(options.query === 'metric'){
            if(options.target.user && options.target.repo){
                return this.q.when([
                    {'text': 'BranchStatus'}
                ]);
            }
        }

        return this.q.when([]);
    }

    buildQueryParameters(options) {
        //remove placeholder targets
        options.targets = _.filter(options.targets, target => {
            return target.metric;
        });

        return options;
    }

    getUserType(type) {
        if(type === 'Organization'){
            return 'orgs';
        }else{
            return 'users';
        }
    }

    getRepos(target) {
        let user_type = this.getUserType(target.user_type);
        return this.backendSrv.datasourceRequest({
            url: this.url + '/' + user_type + '/' + target.user + '/repos',
            params: {'per_page': 100},
            method: 'GET'
        }).then(function(resp){
            return _.map(resp.data, function(v, i){
                return {'text': v.name, 'value': v.name}
            });
        }, function(resp, a,b,c){
            console.error(resp, a,b,c)
        });
    }

    getBranches(target) {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/repos/' + target.user + '/' + target.repo + '/branches',
            params: {'per_page': 100},
            method: 'GET'
        });
    }

    getRefStatus(target, ref) {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/repos/' + target.user + '/' + target.repo + '/commits/' + ref + '/status',
            params: {'per_page': 100},
            method: 'GET'
        });
    }

    buildSeries(target) {
        let self = this;
        if(target.metric === 'BranchStatus'){
            let table = new TableModel.default();
            table.columns = [
                {'text': 'Branch'},
                {'text': 'Status', 'sort': true}
            ];
            let rows = [];

            return this.getBranches(target).then(resp => {
                return self.q.all(_.map(resp.data, branch => {
                    let row = {'name': branch.name, 'status': -1}
                    rows.push(row);
                    return self.getRefStatus(target, branch.name).then(resp => {
                        let status_map = {
                            'success': 1,
                            'pending': 0,
                            'failure': -1
                        };
                        row.status = status_map[resp.data.state];
                    });
                }));
            }).then(function(){;
                _.forEach(rows, row => {
                    table.rows.push([row.name, row.status]);
                });
                return table;
            });
        }
        return [];
    }
}
