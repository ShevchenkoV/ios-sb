// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'ngCordova',
  'LocalForageModule',
  'starter.registration',
  'starter.test',
  'starter.directives',
  'starter.services',
  'starter.csv'])

.run(function($ionicPlatform,$cordovaStatusbar,$state) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      ionic.Platform.isFullScreen = true;
    }
    $ionicPlatform.registerBackButtonAction(function (event) {
      if ($state.is('/')) {
        navigator.app.exitApp();
      } else {
        event.preventDefault();
      }
    }, 100);
    $cordovaStatusbar.show();
  });
})
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(1);
  $stateProvider

  .state('/', {
    cache: false,
    url: "/",
    templateUrl: "templates/menu.html",
    controller: 'MenuCtrl'
  })
  .state("/test-home", {
    cache: false,
    url: "/test-home/:id",
    templateUrl: "templates/test-home.html",
    controller: "TestHomeCtrl",
    resolve:{
      userid:function($stateParams){
        return $stateParams.id;
      }
    }
  })
  .state("/activity-log", {
    url: "/activity-log",
    templateUrl: "templates/activity-log/activity-log.html",
    controller: "ActivityLogCtrl"
  })
  .state("/activity-log-naming", {
    cache: false,
    url: "/activity-log-naming/:id",
    templateUrl: "templates/activity-log/naming.html",
    controller: "ActivityLogNamingCtrl",
    resolve:{
      current:function($stateParams,userService){
        return userService.check($stateParams.id).then(function(result){
          return result;
        });
      }
    }
  })
  .state("/activity-log-semantic", {
    cache: false,
    url: "/activity-log-semantic/:id",
    templateUrl: "templates/activity-log/semantic.html",
    controller: "ActivityLogSemanticCtrl",
    resolve:{
      current:function($stateParams,userService){
        return userService.check($stateParams.id).then(function(result){
          return result;
        });
      }
    }
  })
  .state("/activity-log-word", {
    cache: false,
    url: "/activity-log-word/:id",
    templateUrl: "templates/activity-log/word.html",
    controller: "ActivityLogWordCtrl",
    resolve:{
      current:function($stateParams,userService){
        return userService.check($stateParams.id).then(function(result){
          return result;
        });
      }
    }
  })
  .state("/activity-log-repetition", {
    cache: false,
    url: "/activity-log-repetition/:id",
    templateUrl: "templates/activity-log/repetition.html",
    controller: "ActivityLogRepetitionCtrl",
    resolve:{
      current:function($stateParams,userService){
        return userService.check($stateParams.id).then(function(result){
          return result;
        });
      }
    }
  })
  .state("/how-to-score", {
    cache: false,
    url: "/how-to-score",
    templateUrl: "templates/how-to-score.html",
    controller: "HowToScoreCtrl"
  })
  .state("/how-to-use", {
    cache: false,
    url: "/how-to-use",
    templateUrl: "templates/how-to-use.html",
    controller: "HowToUseCtrl"
  })
  .state("/practice", {
    cache: false,
    url: "/practice",
    templateUrl: "templates/practice.html",
    controller: "PracticeCtrl"
  })
  .state("/instructions", {
    cache: false,
    url: "/instructions",
    templateUrl: "templates/instructions.html",
    controller: "InstructionsCtrl"
  })
  .state("/about", {
    cache: false,
    url: "/about",
    templateUrl: "templates/about.html",
    controller: "AboutCtrl"
  })
  .state("/naming", {
    cache: false,
    url: "/naming-test",
    templateUrl: "templates/naming/test.html",
    controller: "NamingTestCtrl"
  })
  .state("/word", {
    cache: false,
    url: "/word",
    templateUrl: "templates/word/test.html",
    controller: "WordTestCtrl"
  })
  .state("/repetition", {
    cache: false,
    url: "/repetition-test",
    templateUrl: "templates/repetition/test.html",
    controller: "RepetitionTestCtrl"
  })
  .state("/semantic", {
    cache: false,
    url: "/semantic-test",
    templateUrl: "templates/semantic/test.html",
    controller: "SemanticTestCtrl",
    resolve:{
      resumeIndex:function(userService){
        return 1;
        }
    }
  })
  .state("/new-test", {
    cache: false,
    url: "/new-test",
    templateUrl: "templates/new-test.html",
    controller: "NewTestCtrl"
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})

.controller('MenuCtrl', function() {

})
.controller('AboutCtrl', function($scope) {})
.controller('HowToScoreCtrl', function($scope) {})
.controller('PracticeCtrl', function($scope) {
  $scope.pris=true;
  var message=$('#message');
  var img=$('#img-pr');
  $scope.reportGesture=function(event,direction,fingerCount,distance){
    if(direction){

      if(direction=="up"||direction=="down"){
        img.hide();
        if(fingerCount==1){
           console.log("UPNDOWN 1 FINGER");
           message.text("Terminate Test (Complete)");
        }
        else{
          console.log("UP||DOWN 2 finger");
          message.text("Terminate Test (Incomplete)");
        }
      }
      else{
        if(fingerCount==1){
          img.hide();
          if(distance>=window.innerWidth/2){
            console.log("LONG LEFT| 1 finger|INCORRECT");
            message.text("Incorrect, Score=0");
          }
          else{
            console.log("SHORT LEFT| 1 finger|CORRECT");
            message.text("Correct, Score=1");
          }
        }else{
          img.hide();
          console.log("LEFT 2 finger");
          message.text("Review later, no Score");
        }
      }
    }
  }
})
.controller('ActivityLogSemanticCtrl', function($scope,$state,$stateParams,current,$ionicPopup,$cordovaFile,$cordovaEmailComposer,userService,CSVservice) {
    $scope.current=current;
          console.log($scope.current);
    $scope.current.resumeSemantic=0;
    function getAnswersCount(arr){
       return arr.filter(function(value){
            return value.res === 1;
        }).length
     }
     $scope.answers=getAnswersCount($scope.current.semantic_arr);
     $scope.$watch('current.semantic_arr',function(newVal,oldVal){
       $scope.bars={
         first:getAnswersCount($scope.current.semantic_arr.slice(0,10)),
         second:getAnswersCount($scope.current.semantic_arr.slice(10,20)),
         third:getAnswersCount($scope.current.semantic_arr.slice(20,30))
       }
     },true);

    $scope.showPopup = function() {
      var myPopup = $ionicPopup.show({
        template:'<b>Would you like to resume the test from where you last terminated?</b',
        buttons: [
          {
            text: 'Yes',type: 'button-positive',
            onTap: function(e) {
              $scope.current.resumeSemantic=0;
              userService.setCurrent($scope.current);
              $state.go("/semantic");
              return e;
            }
          },
          { text: 'No, start from beginning',type: 'button-positive',
            onTap:function(e){
              $scope.current.resumeSemantic=1;
              userService.setCurrent($scope.current);
              $state.go("/semantic");
              return e;
            }
         }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    }

    $scope.mail=function(){
      var data=CSVservice.calcSemantic($scope.current);
      $cordovaFile.writeFile(cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"semantic/", "semantic.csv", data, true)
      .then(function (success) {
      var email = {
        attachments: [
          cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"/semantic/semantic.csv"
        ],
        subject: 'Semantic Associations:'+$scope.current.id+'_'+$scope.current.dateTest,
        body: 'Csv in attachments',
        isHtml: true
      };
      $cordovaEmailComposer.open(email).then(null, function () {
       console.log("canceled");
      });
      }, function (error) {
        // error
        console.log(error);
      });
    }
})
.controller('ActivityLogWordCtrl', function($scope,current,$ionicPopup,CSVservice,$cordovaFile,$cordovaEmailComposer,userService,$state,$stateParams) {
    $scope.current=current;
          console.log($scope.current);
    $scope.current.resumeWord=0;
    function getAnswersCount(arr){
       return arr.filter(function(value){
            return value.res === 1;
        }).length
     }
     $scope.$watch('current.word_arr',function(newVal,oldVal){
       $scope.bars={
         first:getAnswersCount($scope.current.word_arr.slice(0,10)),
         second:getAnswersCount($scope.current.word_arr.slice(10,20)),
         third:getAnswersCount($scope.current.word_arr.slice(20,30))
       }
     },true);
     $scope.answers=getAnswersCount($scope.current.word_arr);
    $scope.mail=function(){
      var data=CSVservice.calcWord($scope.current);
      $cordovaFile.writeFile(cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"word/", "word.csv", data, true)
      .then(function (success) {

      var email = {
        attachments: [
          cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"/word/word.csv"
        ],
        subject: 'Words Comprehension:'+$scope.current.id+'_'+$scope.current.dateTest,
        body: 'Csv in attachments',
        isHtml: true
      };
      $cordovaEmailComposer.open(email).then(null, function () {
       console.log("canceled");
      });
      }, function (error) {
        // error
      });
    }
    $scope.showPopup = function() {
      var myPopup = $ionicPopup.show({
        template:'<b>Would you like to resume the test from where you last terminated?</b',
        buttons: [
          {
            text: 'Yes',type: 'button-positive',
            onTap: function(e) {
              $scope.current.resumeWord=0;
              userService.setCurrent($scope.current);
              $state.go("/word");
              return e;
            }
          },
          { text: 'No, start from beginning',type: 'button-positive',
            onTap:function(e){
              $scope.current.resumeWord=1;
              userService.setCurrent($scope.current);
              $state.go("/word");
              return e;
            }
         }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    }
})
.controller('ActivityLogRepetitionCtrl', function($scope,CSVservice,$ionicPopup,$cordovaFile,$cordovaEmailComposer,current,userService,$state) {

  $scope.$on('$ionicView.beforeLeave', function(){
    if(my_media){my_media.stop();my_media.release();console.log(my_media);}
  });
  $scope.popData={};
    $scope.current=current;var myPopup,my_media;
    function getAnswersCount(arr){
       return arr.filter(function(value){
            return value.res === 1;
        }).length
     }
     $scope.$watch('current.repetition_arr',function(newVal,oldVal){
       $scope.bars={
         first:getAnswersCount($scope.current.repetition_arr.slice(0,10)),
         second:getAnswersCount($scope.current.repetition_arr.slice(10,20)),
         third:getAnswersCount($scope.current.repetition_arr.slice(20,30))
       }
     },true);
     $scope.answers=getAnswersCount($scope.current.repetition_arr);
    $scope.iteminpopup='';
    $scope.play=function(i){
      console.log(i);
      var folder=$scope.current.folder.slice(1)+"repetition/";
      src = cordova.file.externalDataDirectory+folder +i.name+".mp3";
      console.log(src)
      my_media = new Media(src,
        function () {
          console.log("Success",my_media.src);
          },
        function (err) {console.log("playAudio():Audio Error: " + err);}
        );
        my_media.play();
    }
    $scope.save=function(pos){
      if($scope.popData){
        console.log("not null");
        $scope.current.repetition_arr[pos].res=$scope.popData.res||0;
        $scope.current.repetition_arr[pos].modified='*';
        $scope.current.repetition_arr[pos].comment=$scope.popData.comment||'';

        userService.edit("naming_arr",$scope.current.repetition_arr);
        $scope.answers=getAnswersCount($scope.current.repetition_arr);
        }
      myPopup.close();
    }
    $scope.close=function(){
      myPopup.close();
    }
    $scope.showPopup = function(index) {
      $scope.pos=index;
      $scope.popData={
        res:$scope.current.repetition_arr[$scope.pos].res,
        comment:$scope.current.repetition_arr[$scope.pos].comment
      };
      myPopup = $ionicPopup.show({
        scope: $scope,
        templateUrl:'popTpl.html'
      });
    }
    $scope.resume = function() {
      var resumeButton = $ionicPopup.show({
        template:'<b>Would you like to resume the test from where you last terminated?</b',
        buttons: [
          {
            text: 'Yes',type: 'button-positive',
            onTap: function(e) {
              $scope.current.resumeRepetition=0;
              userService.setCurrent($scope.current);
              $state.go("/repetition");
              return e;
            }
          },
          { text: 'No, start from beginning',type: 'button-positive',
            onTap:function(e){
              $scope.current.resumeRepetition=1;
              userService.setCurrent($scope.current);
              $state.go("/repetition");
              return e;
            }
         }
        ]
      });
      resumeButton.then(function(res) {
        console.log('Tapped!', res);
      });
    }

    $scope.mail=function(){
      var data=CSVservice.calcRepetition($scope.current);
      $cordovaFile.writeFile(cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"repetition/", "repetition.csv", data, true)
      .then(function (success) {
        var PathToFileInString  = cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"repetition",
            PathToResultZip     = cordova.file.externalDataDirectory+$scope.current.folder.slice(1);
        JJzip.zip(PathToFileInString, {target:PathToResultZip,name:"repetition"},function(data){
          console.log(data);
        },function(error){
          console.log(error);
        });
      var email = {
        attachments: [
          cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"repetition.zip"
        ],
        subject: 'Repetition:'+$scope.current.id+'_'+$scope.current.dateTest,
        body: 'Csv and zip in attachments',
        isHtml: true
      };
      $cordovaEmailComposer.open(email).then(null, function () {
       console.log("canceled");
      });
      }, function (error) {
        // error
      });
    }
})
.controller('ActivityLogNamingCtrl', function($scope,CSVservice,$ionicPopup,$cordovaFile,$state,$cordovaEmailComposer,current,userService) {
      $scope.current=current;
      $scope.answers=0;
      $scope.popData={};
  var my_media;
  var folder=$scope.current.folder.slice(1)+"naming/";
  function getAnswersCount(arr){
     return arr.filter(function(value){
          return value.res === 1;
      }).length
   }
   $scope.answers=getAnswersCount($scope.current.naming_arr);
   $scope.$watch('current.naming_arr',function(newVal,oldVal){
     $scope.bars={
       first:getAnswersCount($scope.current.naming_arr.slice(0,10)),
       second:getAnswersCount($scope.current.naming_arr.slice(10,20)),
       third:getAnswersCount($scope.current.naming_arr.slice(20,30))
     }
   },true);

  $scope.$on('$ionicView.beforeLeave', function(){
    console.log("beforeLeave");
    if(my_media){my_media.stop();my_media.release();console.log(my_media);}
  });
  $scope.mail=function(){
    var data=CSVservice.calcNaming($scope.current);

    $cordovaFile.writeFile(cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"naming/", "naming.csv", data, true)
    .then(function (success) {
      var PathToFileInString  = cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"naming",
          PathToResultZip     = cordova.file.externalDataDirectory+$scope.current.folder.slice(1);
      JJzip.zip(PathToFileInString, {target:PathToResultZip,name:"naming"},function(data){
        console.log(data);
      },function(error){
        console.log(error);
      });
    var email = {
      attachments: [
        cordova.file.externalDataDirectory+$scope.current.folder.slice(1)+"naming.zip"
      ],
      subject: 'Naming:'+$scope.current.id+'_'+$scope.current.dateTest,
      body: 'Csv and zip in attachments',
      isHtml: true
    };
    $cordovaEmailComposer.open(email).then(null, function () {
     console.log("canceled");
    });
    }, function (error) {
      // error
    });
  }
  var myPopup;
  $scope.iteminpopup='';
  $scope.play=function(i){
    console.log(i);
    var folder=$scope.current.folder.slice(1)+"naming/";
    src = cordova.file.externalDataDirectory+folder +i.name+".mp3";
    console.log(src)
    my_media = new Media(src,
      function () {
        console.log("Success",my_media.src);
        },
      function (err) {console.log("playAudio():Audio Error: " + err);}
      );
      my_media.play();
  }
  $scope.save=function(pos){
    if($scope.popData){
      console.log("not null");
      $scope.current.naming_arr[pos].res=$scope.popData.res||0;
      $scope.current.naming_arr[pos].modified='*';
      $scope.current.naming_arr[pos].comment=$scope.popData.comment||'';

      userService.edit("naming_arr",$scope.current.naming_arr);
      $scope.answers=getAnswersCount($scope.current.naming_arr);
      }
    myPopup.close();
  }
  $scope.close=function(){
    myPopup.close();
  }
  $scope.showPopup = function(index) {
    $scope.pos=index;
    $scope.popData={
      res:$scope.current.naming_arr[$scope.pos].res,
      comment:$scope.current.naming_arr[$scope.pos].comment
    };
    myPopup = $ionicPopup.show({
      scope: $scope,
      templateUrl:'popTpl.html'
    });
  }
  $scope.resume = function() {
    var resumePop = $ionicPopup.show({
      template:'<b>Would you like to resume the test from where you last terminated?</b',
      buttons: [
        {
          text: 'Yes',type: 'button-positive',
          onTap: function(e) {
            $scope.current.resumeNaming=0;
            userService.setCurrent($scope.current);
            $state.go("/naming");
            return e;
          }
        },
        { text: 'No, start from beginning',type: 'button-positive',
          onTap:function(e){
            $scope.current.resumeNaming=1;
            userService.setCurrent($scope.current);
            $state.go("/naming");
            return e;
          }
       }
      ]
    });
    resumePop.then(function(res) {
      console.log('Tapped!', res);
    });
  }
})
.controller('ActivityLogCtrl', function($scope,$ionicPopup,$cordovaFile,userService,$q,$localForage,$timeout) {
  $scope.currentDate='';var arr=[];var viewIndex;
  var viewUser=userService.get(),
      dates=userService.getDates(),
      tests=userService.getAll();

  function sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      });
  }
  function getSelectedList(date){
    var arr;
    arr=$scope.tests.filter(function(value){
      return value.dateTest==date;
    });
    return sortByKey(arr,'created');
  }
  function init(){
    if(!viewUser.hasOwnProperty('created')){
      $scope.currentDate=$scope.dates[0];
      $scope.selectedTest=getSelectedList($scope.currentDate);
      $scope.getTestList($scope.currentDate,0);
    }
    else{
      $scope.selectedTest=getSelectedList(viewUser.dateTest);
      var indexId=0;
      $scope.selectedTest.some(function(element, index, array) {
        if (element.id == viewUser.id) {
          indexId=index;
          return index;
        }
        return false;
      });
      $scope.clickedDate=$scope.dates.indexOf(viewUser.dateTest);
      $scope.getTest(viewUser.id,indexId);
    }
  }

    $q.all([dates, tests]).then(function(values){
       $scope.dates = values[0].sort().reverse();
       $scope.tests = values[1];
       init();
     });


    $scope.getTestList=function(date,index){
      $scope.currentDate=date;
      $scope.clickedDate=index||0;
      $scope.clickedTest=0;
      $scope.selectedTest=getSelectedList($scope.currentDate);
      $scope.getTest($scope.selectedTest[0].id,0);
    }
    $scope.getTest=function(id,index){
      console.log(index);
      console.log($scope.selectedTest);
        $scope.clickedTest=index;
           userService.check(id).then(function(result){
             $scope.currentUser=result;
             userService.setCurrent(result);
             $scope.answers={
               naming:getAnswersCount($scope.currentUser.naming_arr),
               semantic:getAnswersCount($scope.currentUser.semantic_arr),
               word:getAnswersCount($scope.currentUser.word_arr),
               repetition:getAnswersCount($scope.currentUser.repetition_arr)
             }
           });
     }
     function getAnswersCount(arr){
        return arr.filter(function(value){
             return value.res === 1;
         }).length
      }
      /*******/
      $scope.showPopup = function(id) {
        var myPopup = $ionicPopup.show({
          template:'<b>Deleting this test will remove ALL the results associated with this test. Are you sure?</b',
          buttons: [
            {
              text: 'Yes',type: 'button-positive',
              onTap: function(e) {
                $localForage.removeItem(id).then(function(){
                  $cordovaFile.removeRecursively(cordova.file.externalDataDirectory+$scope.currentUser.dateTest, $scope.currentUser.folder.split("/")[2])
                 .then(function (success) {
                    $scope.currentUser=null;
                    initList();
                    console.log("deleted");
                 }, function (error) {
                   console.log(error);
                 });

                })
                return e;
              }
            },
            { text: 'No',type: 'button-positive' }
          ]
        });
        myPopup.then(function(res) {
          console.log('Tapped!', res);
        });
      }
})

.controller('InstructionsCtrl', function($scope) {
  $scope.show=1;
})
.controller('HowToUseCtrl', function($scope) {
  $scope.show=1;
})
;
