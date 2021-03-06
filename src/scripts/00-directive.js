function template(tmpl, context, filter) {
    'use strict';

    return tmpl?tmpl.replace(/\{([^\}]+)\}/g, function (m, key) {
        // If key don't exists in the context we should keep template tag as is
        return key in context ? (filter ? filter(context[key]) : context[key]) : m;
    }):tmpl;
}

var app = angular.module('ngSocial', []);

app.directive('ngSocialButtons', ['$compile', '$q', '$parse', '$http', '$location',
    function ($compile, $q, $parse, $http, $location) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                'url': '=',
                'title': '=',
                'description': '=',
                'image': '=',
                'showcounts': '='
            },
            replace: true,
            transclude: true,
            template: '<div class="ng-social-container ng-cloak"><ul class="ng-social" ng-transclude></ul></div>',
            controller: ['$scope', '$q', '$http', function ($scope, $q, $http) {
                var getUrl = function () {
                    return $scope.url || $location.absUrl();
                };
                var ctrl = {
                    init: function (scope, element, options) {
                        if (options.counter) {
                            ctrl.getCount(scope.options).then(function(count) {
                                scope.count = count;
                            });
                        }
                    },
                    link: function (options) {
                        options = options || {};
                        var urlOptions = options.urlOptions || {};
                        urlOptions.url = getUrl();
                        urlOptions.title = $scope.title;
                        urlOptions.image = $scope.image;
                        urlOptions.description = $scope.description || '';
                        return ctrl.makeUrl(options.clickUrl || options.popup.url, urlOptions);
                    },
                    clickShare: function (e, options) {
                        if (e.shiftKey || e.ctrlKey) {
                            return;
                        }
                        e.preventDefault();

                        if (options.track && typeof _gaq != 'undefined' && angular.isArray(_gaq)) {
                            _gaq.push(['_trackSocial', options.track.name, options.track.action, $scope.url]);
                        }

                        var process = true;
                        if (angular.isFunction(options.click)) {
                            process = options.click.call(this, options);
                        }
                        if (process) {
                            var url = ctrl.link(options);
                            ctrl.openPopup(url, options.popup);
                        }
                    },
                    openPopup: function (url, params) {
                        var left = Math.round(screen.width / 2 - params.width / 2),
                            top = 0;
                        if (screen.height > params.height) {
                            top = Math.round(screen.height / 3 - params.height / 2);
                        }

                        var win = window.open(
                            url,
                            'sl_' + this.service,
                            'left=' + left + ',top=' + top + ',' +
                            'width=' + params.width + ',height=' + params.height +
                            ',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
                        );
                        if (win) {
                            win.focus();
                        } else {
                            location.href = url;
                        }
                    },
                    getCount: function (options) {
                        var def = $q.defer();
                        /*var urlOptions = options.urlOptions || {};
                        urlOptions.url = getUrl();
                        urlOptions.title = $scope.title;
                        var url = ctrl.makeUrl(options.counter.url, urlOptions),
                            showcounts = angular.isUndefined($scope.showcounts) ? true : $scope.showcounts;

                        if (showcounts) {
                            if (options.counter.get) {
                                options.counter.get(url, def, $http);
                            } else {
                                try {
                                    $http.jsonp(url).success(function (res) {
                                        if (options.counter.getNumber) {
                                            def.resolve(options.counter.getNumber(res));
                                        } else {
                                            def.resolve(res);
                                        }
                                    }).error(function (err) {
                                        console.log('error getting share count on ' + url + ' ' + err);
                                    });
                                }catch(e){
                                    console.log(e);
                                }
                            }
                        }*/
                        def.resolve('');
                        return def.promise;

                    },
                    makeUrl: function (url, context) {
                        return template(url, context, encodeURIComponent);
                    }
                };
                return ctrl;
            }]
        };
    }
    ]);
