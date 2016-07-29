var config = {
    apiKey: "AIzaSyBKSI6orShgKeD5fILiJANVECh6sC_EAkM",
    authDomain: "jp7teste.firebaseapp.com",
    databaseURL: "https://jp7teste.firebaseio.com",
    storageBucket: "jp7teste.appspot.com",
  };

firebase.initializeApp(config);

angular.module('testejp7App', ['firebase', 'ngRoute'])
    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/");
            }
        });
    }])
    .factory("Contacts", ["$firebaseArray",
        function($firebaseArray) {
            return function(contact) {
                var ref = firebase.database().ref().child("contacts");
                return $firebaseArray(ref);
            }
        }
    ])
    .factory("Auth", ["$firebaseAuth",
        function($firebaseAuth) {
            return $firebaseAuth();
        }
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                controller: "LoginController",
                templateUrl: "login.html",
                resolve: {
                    // controller will not be loaded until $waitForSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function (Auth) {
                        // $waitForSignIn returns a promise so the resolve waits for it to complete
                        return Auth.$waitForSignIn();
                    }]
                }
            })
            .when("/contacts", {
                controller: "ContactsController",
                templateUrl: "contacts.html",
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireSignIn();
                    }]
                }
            })
            .when("/signup", {
                controller: "SignUpController",
                templateUrl: "signup.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .controller("LoginController", ["$scope", "Auth", "$location", 
        function($scope, Auth, $location) {
            $scope.error = '';

            $scope.userLogin = function() {
                
                var loginCredentials = $scope.login;
                if (!loginCredentials) {
                    $scope.error = 'Todos os campos são obrigatórios';
                    return;
                }

                Auth.$signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password).then(function(firebaseUser) {
                    console.log("Signed in as:", firebaseUser.uid);
                    $location.path("/contacts");
                }).catch(function(error) {
                    $scope.error = error.message;
                });

                //reset form values
                $scope.login = '';
            };

            $scope.userLoginGoogle = function () {
                Auth.$signInWithPopup("google").then(function(result) {
                    console.log("Signed in as:", result.user.uid);
                    $location.path("/contacts");
                }).catch(function(error) {
                    $scope.error = error.message;
                });
            };

            $scope.userLoginGithub = function () {
                Auth.$signInWithPopup("github").then(function(result) {
                    console.log("Signed in as:", result.user.uid);
                    $location.path("/contacts");
                }).catch(function(error) {
                    $scope.error = error.message;
                });
            };

            $scope.userCreate = function () {
                $location.path("/signup");
            };
        }
    ])
    .controller("ContactsController", ["$scope", "Contacts", "Auth", "$location",
        function ($scope, Contacts, Auth, $location) {
            $scope.contacts = Contacts("contacts");
            $scope.error = '';
            $scope.newContact = ''; 

            $scope.saveContact = function() {
                var newContact = $scope.newContact;
                if (!newContact) {
                    return false;
                }

                // data binding fodendo works
                $scope.contacts.$add(newContact).then(function() {
                    alert('Contact saved!');
                }).catch(function(error) {
                    $scope.error = error.message;
                });
            };

            $scope.removeContact = function(contact) {
                // data binding fodendo works
                $scope.contacts.$remove(contact).then(function() {
                    alert('Contact removed!');
                }).catch(function(error) {
                    $scope.error = error.message;
                });
            };

            $scope.logout = function () {
                $location.path("/");
                Auth.$signOut().then(function () {
                    alert('Vlws flws');
                }).catch(function(error) {
                    $scope.error = error.message;
                });;
            }
        }
    ])
    .controller("SignUpController", ["$scope", "Auth", "$location",
        function ($scope, Auth, $location) {
            $scope.error = '';

            $scope.signUpUser = function () {
                var signUpCredentials = $scope.signup;

                if (!signUpCredentials) {
                    $scope.error = 'Todos os campos são obrigatórios';
                    return;
                }

                if (signUpCredentials.password != signUpCredentials.password_confirmation) {
                    $scope.error = 'Password mismatch!';
                    $scope.signup.password = '';
                    $scope.signup.password_confirmation = '';
                    return;
                }
                Auth.$createUserWithEmailAndPassword(signUpCredentials.email, signUpCredentials.password)
                    .then(function(regUser) {
                        alert("User " + regUser.uid + " created!");
                        $location.path("/");
                    }).catch(function(error) {
                        $scope.error = error.message;
                    });
            };

            $scope.back = function() {
                $location.path("/");
            };
        }
    ]);

