myApp.controller('projectController', ['$scope', 'projectFactory', '$routeParams', 'snackbar', '$location', 'action', 'clientFactory', 'estimateFactory',

    function($scope, projectFactory, $routeParams, snackbar, $location, action, clientFactory, estimateFactory) {

        /*loading all projects*/
        if (action && action.projects != undefined) {
            action.projects.success(function(response) {
                console.log('all projects', response);
                $scope.projects = response;
            });
        }

        if (action && action.clients != undefined) {
            action.clients.success(function(response) {
                console.log('all clients', response);
                $scope.clients = response;
            });
        }

        /*load single project data*/
        if ($routeParams.id) {
            $scope.singleProjectId = $routeParams.id;
            projectFactory.getProjectById($routeParams.id).success(function(response) {
                console.log('Single project', response);
                $scope.singleProject = response;
                $scope.showSingleProject = true;
            });
        }

        if ($routeParams.estimateId) {
            estimateFactory.getEstimateById($routeParams.estimateId).success(function(response) {
                console.log('Need to load estimate', response);
                $scope.singleEstimate = response;
                projectFactory.getProjectById(response.project_id).success(function(response) {
                    console.log('Single project', response);
                    $scope.singleProject = response;
                    $scope.showSingleEstimate = true;
                });
            });
        }

        angular.extend($scope, {
            singleProject: {},
            showSingleProject: false,
            showSingleEstimate: false,
            projectEstimte: {},
            singleEstimate: {},
            newEstimateFormSubmit: false,
            newProject: {}
        });

        angular.extend($scope, {
            editEstiate: function(editEstimateForm) {
                if (editEstimateForm.$valid) {
                    var estimateData = {
                        id: $scope.singleEstimate.id,
                        desc: $scope.singleEstimate.desc,
                        hours_allocated: $scope.singleEstimate.hours_allocated,
                        status: $scope.singleEstimate.status
                    };

                    estimateFactory.updateEstimate(estimateData).success(function(response) {
                        console.log('estimate edited', response);
                        $location.path('/projects/' + $scope.singleProject.id);
                        snackbar.create("Estimate saved", 1000);
                    });
                } else {
                    $scope.newEstimateFormSubmit = true;
                    snackbar.create("Your form has errors!!", 1000);
                }
            },
            addNewProject: function(addProjectForm) {
                if (addProjectForm.$valid) {
                    console.log($scope.newProject);
                    var newProjectData = {
                        name: $scope.newProject.name,
                        client: $scope.newProject.client_id[0].id
                    };
                    projectFactory.saveNewProject(newProjectData).success(function(response) {
                        console.log('save new project', response);
                        $location.path('/projects');
                        snackbar.create("Project added", 1000);
                    })
                } else {
                    $scope.newEstimateFormSubmit = true;
                    snackbar.create("Your form has errors!!", 1000);
                }
            },
            saveProjectEstimate: function(addProjectEstimateForm) {
                if (addProjectEstimateForm.$valid) {
                    console.log('$scope.projectEstimte', $scope.projectEstimte);
                    var estimateData = {
                        project_id: $routeParams.id,
                        desc: $scope.projectEstimte.desc,
                        hours_allocated: $scope.projectEstimte.hours_allocated,
                    };

                    projectFactory.saveProjectEstimate(estimateData).success(function(response) {
                        console.log(response);
                        $location.path('/projects/' + $routeParams.id);
                        snackbar.create("Estimate added", 1000);
                    });
                } else {
                    $scope.newEstimateFormSubmit = true;
                    snackbar.create("Your form has errors!!", 1000);
                }
            }
        });
    }
]);

myApp.factory('projectFactory', ['$http', function($http) {
    var projectFactory = {};

    projectFactory.getProjectList = function() {
        return $http.get(baseUrl + 'api/get-project-list');
    }

    projectFactory.getProjectById = function(id) {
        return $http.get(baseUrl + 'api/get-project-by-id/' + id);
    }

    projectFactory.saveProjectEstimate = function(estimateData) {
        return $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'api/save-project-estimate',
            method: 'POST',
            data: estimateData
        });
    }

    projectFactory.saveNewProject = function(newProjectData) {
        return $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'api/save-new-project',
            method: 'POST',
            data: newProjectData
        });
    }

    return projectFactory;
}]);
