import {GithubDatasource} from './datasource';
import {GithubDatasourceQueryCtrl} from './query_ctrl';

class GithubConfigCtrl {}
GithubConfigCtrl.templateUrl = 'partials/config.html';

class GithubQueryOptionsCtrl {}
GithubQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  GithubDatasource as Datasource,
  GithubDatasourceQueryCtrl as QueryCtrl,
  GithubConfigCtrl as ConfigCtrl,
  GithubQueryOptionsCtrl as QueryOptionsCtrl
};
