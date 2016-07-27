var config = {
    apiKey: "AIzaSyBKSI6orShgKeD5fILiJANVECh6sC_EAkM",
    authDomain: "jp7teste.firebaseapp.com",
    databaseURL: "https://jp7teste.firebaseio.com",
    storageBucket: "jp7teste.appspot.com",
  };

firebase.initializeApp(config);

angular.module('testejp7App', ['firebase'])
    .factory("Contacts", ["$firebaseArray",
        function($firebaseArray) {
            return function(contact) {
                var ref = firebase.database().ref().child("contacts");
                return $firebaseArray(ref);
            }
        }
    ])
    .controller("ContactsController", ["$scope", "Contacts",
        function($scope, Contacts) {

            $scope.contacts = Contacts("contacts");

            $scope.saveContact = function() {
                var newContact = $scope.newContact;
                if (!newContact) {
                    return;
                }
                // push to firebase
                $scope.contacts.$add(newContact).then(function() {
                    alert('Contact saved!');
                }).catch(function(error) {
                    alert('Error!');
                });
                $scope.newContact = '';
            };

            $scope.removeContact = function(contact) {
                $scope.contacts.$remove(contact).then(function() {
                    alert('Contact removed!');
                }).catch(function(error) {
                    alert('Error!');
                });

            };
        }
    ]);

