angular.module('starter.test', [])

.controller('SemanticTestCtrl', function($scope,$ionicSlideBoxDelegate,listService,$state,userService,$ionicPopup,toastCenter) {
 var _POINTER=0;
  $scope.currentPointer=0;
  $scope.list=[];
  var allowed=false,duration=0,timerId,last;
  var activeListener;
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
 $scope.greyCounter=1;
  console.log(userService.get());
  if(userService.get().semantic==0 && userService.get().resumeSemantic!=1){
    console.log("should resume or restart");
    _POINTER=3;
    $scope.list = userService.get().semantic_arr;
    $scope.currentPointer=userService.resume('semantic_arr');
    last=$scope.list.length+4;
    timerId = setInterval(function() { duration++;}, 1000);
    $ionicSlideBoxDelegate.update();
  }
  else{
    console.log("new");
    _POINTER=5;
    listService.get('semantic.json').success(function(data){
      $scope.list = data;
      console.log(data);
      $scope.practice=$scope.list.splice(0, 2);
      last=$scope.list.length+4;
      userService.edit('semantic_arr',$scope.list);
      $ionicSlideBoxDelegate.update();
    });
  }
  var clIn=0;

  $scope.nextSlide = function() {
    clearInterval(timerId);
    $ionicSlideBoxDelegate.next();
  }
  $scope.disableSwipe = function() {
   $ionicSlideBoxDelegate.enableSlide(false);
  };


  $scope.exit=function(){
    $state.go('/test-home');
  };

  $scope.slideHasChanged=function(index){
        $scope.currentPointer=index;
        activeListener=$("ion-slide[data-index="+index+"]");
    console.log("top index",index);
    if(index>=5){
      save();
      if($scope.list[$scope.currentPointer-_POINTER].res==0){
        $scope.greyCounter++;
      }
      if($scope.list[$scope.currentPointer-_POINTER].res==1 && $scope.greyCounter<=6){
        $scope.greyCounter=1;
      }
    }
    if(isLast($scope.currentPointer)){
        userService.edit('semantic',true);
    }
    if(index>=4 && !isLast(index)){

      timerId = setInterval(function() { duration++;}, 1000);
    }
  }
  $scope.click=function(item,clicked){
    $(activeListener).find('.active').removeClass('active');
    $(activeListener).find('#'+clicked).addClass('active');
    console.log(item);
    if($scope.currentPointer>=4){
      if(item.correct==clicked){
        item.res=1;
        item.clicked=clicked;
      }
      else{item.res=0;item.clicked=clicked;}
      allowed=true;
    }
  }
  function save(terminate){
    if(terminate==0||terminate==1){
      userService.edit('semantic',terminate);
    }else{
      console.log($scope.list[$scope.currentPointer-_POINTER]);
      $scope.list[$scope.currentPointer-_POINTER].duration=duration;
      userService.edit('semantic_arr',$scope.list);
      duration=0;
    }
  }
  function isLast(index){
    return index==last;
  }
  $scope.reportGesture=function(event,direction,fingerCount,distance){
    if(direction){
      if(direction=="up"||direction=="down"){
        if(fingerCount==1){
           console.log("UPNDOWN 1 FINGER");
           popObject.str='<b>Are you sure you want to Terminate this test?</b';
           popObject.res=1;
           $scope.showPopup();
        }
        else{
          console.log("UP||DOWN 2 finger");
          popObject.str='<b>Are you sure you want to Terminate this test?</b';
          popObject.res=0;
          $scope.showPopup();
        }
      }
      else{
        if(fingerCount==1){
          if(allowed||($scope.currentPointer==2||$scope.currentPointer==1)){
            allowed=false;
            $scope.nextSlide();
          }
          else{
            console.log("wasn't clicked");
            toastCenter.toast('Oh, you forgot to choose an item. Please select one to proceed.');
          }
        }
      }
    }
  }
  var popObject={str:'',res:''};
  $scope.showPopup = function() {
    var myPopup = $ionicPopup.show({
      template:popObject.str,
      scope:$scope,
      buttons: [
        {
          text: 'Yes',type: 'button-positive',
          onTap: function(e) {
            if(allowed){$scope.list[$scope.currentPointer-4].res=-1;}
            save(popObject.res);
            return 'exit';
          }
        },
        { text: 'No',type: 'button-positive' }
      ]
    });
    myPopup.then(function(res) {
      if(res=='exit')$scope.exit();
    });
  }
})
.controller('RepetitionTestCtrl', function($scope,$ionicSlideBoxDelegate,$cordovaMedia,$timeout,$cordovaFile,$ionicPlatform,$state,userService,$ionicPopup,listService) {
  var last;
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
  $scope.greyCounter=1;
    if(userService.get().repetition==0 && userService.get().resumeRepetition!=1){
      console.log("should resume or restart");
      $scope.audioList = userService.get().repetition_arr;
      $scope.currentPointer=userService.resumePure('repetition_arr')+5;
      last=$scope.audioList.length+4;
      timerId = setInterval(function() { duration++;}, 1000);
      $ionicSlideBoxDelegate.update();
    }
    else{
      console.log("new");
      listService.get('repetition.json').success(function(data){
        $scope.audioList = data;
        last=$scope.audioList.length+4;
        userService.edit("repetition_arr",$scope.audioList);
        $ionicSlideBoxDelegate.update();
      });
    }

    $scope.playing=false;
    var src='', media=null,record=null, arr=[];
    var folder=userService.get().folder.slice(1)+"repetition/";
    var currIndex=0,recName='';
    var popObject={str:'',res:''};
    $scope.showPopup = function() {
      var myPopup = $ionicPopup.show({
        template:popObject.str,
        scope:$scope,
        buttons: [
          {
            text: 'Yes',type: 'button-positive',
            onTap: function(e) {
              if(media && record)stopAndRelease();
            //  addResult(parseInt(popObject.res));
              userService.edit("repetition",popObject.res);
              return 'exit';
            }
          },
          { text: 'No',type: 'button-positive' }
        ]
      });
      myPopup.then(function(res) {
        if(res=='exit')$scope.exit();
      });
    }
    $scope.reportGesture=function(event,direction,fingerCount,distance){
      if(direction){
        if(direction=="up"||direction=="down"){
          if(fingerCount==1){
             console.log("UPNDOWN 1 FINGER");
             popObject.str='<b>Are you sure you want to Terminate this test?</b';
             popObject.res=1;
             $scope.showPopup();
          }
          else{
            console.log("UP||DOWN 2 finger");
            popObject.str='<b>Are you sure you want to Terminate this test?</b';
            popObject.res=0;
            $scope.showPopup();
          }
        }
        else{
          if(fingerCount==1){
            if(distance>=window.innerWidth/2){
              console.log("LONG LEFT| 1 finger|INCORRECT");
              console.log(distance);
              if(media && record)stopAndRelease();
              addResult(0);
              $scope.nextSlide();
            }
            else{
              console.log("SHORT LEFT| 1 finger|CORRECT");
              if(media && record)stopAndRelease();
              addResult(1);
              $scope.nextSlide();
            }
          }else{
            console.log("LEFT 2 finger");
            if(media && record)stopAndRelease();
            addResult(-2);
            $scope.nextSlide();
          }
        }
      }
    }
    var timerId,duration=0;
    $scope.slideHasChanged=function(index){
        $ionicSlideBoxDelegate.update();
          currIndex=index;
          $scope.currentPointer=index;
      if(index==1||index==2){
        audioPrepare($scope.audioList[index].name);
        //recordInit("practice"+index);
      }
      if(index>=4 && !isLast(index)){
        audioPrepare($scope.audioList[index-4].name);
        recordInit($scope.audioList[index-4].name);
        timerId = setInterval(function() { duration++;}, 1000);
        if(index>=5 && ($scope.audioList[index-5].res==1 && $scope.greyCounter<=6)){
          $scope.greyCounter=1;
        }
        if(index>=5 && ($scope.audioList[index-5].res==0||$scope.audioList[index-5].res==-2)){
          console.log("wrong");
          $scope.greyCounter++;
        }
      }
      if(isLast(index)){
        userService.edit('repetition',true);
        userService.edit('repetition_arr',$scope.audioList)
      }
    };
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.exit=function(){
      $state.go('/test-home');
    };
    $scope.disableSwipe = function() {
     $ionicSlideBoxDelegate.enableSlide(false);
    };

        $scope.play = function() {
            if($scope.playing){
              media.pause();
              $scope.playing=false;
            }
            else{
              if(media){
              media.play();
              $scope.playing=!$scope.playing;
              }else{
                media = new Media("audio/" +$scope.audioList[$scope.currentPointer-4].name+".mp3",
                  function () {console.log("audio success");$timeout(function(){$scope.playing=false;},500);},
                  function (err) {console.log("Audio Error: " + err);
                });
                media.play();
                $scope.playing=!$scope.playing;
              }
            }
        }
        function audioPrepare(name){
          if($scope.currentPointer==1){name="kangaroo";}
          if($scope.currentPointer==2){name="strawberry";}
          media = new Media("audio/" +name+".mp3",
            function () {console.log("audio success");$timeout(function(){$scope.playing=false;},500);},
            function (err) {console.log("Audio Error: " + err);
          });
        }

        function recordInit(name){
          recName=name;
           $cordovaFile.createFile(systemFolder+folder, name+".wav", true)
      .then(function (success) {
        console.log(success);
          record = new Media(success.nativeURL,
            function () {
              console.log("created file:",record.src);
              },
            function (err) {console.log("recordAudio():Audio Error: " + err);
          });
            record.startRecord();
      }, function (error) {
        // error
      });

        }
        function stopAndRelease(){
          console.log("clearing");
          record.stopRecord();
          record.release();
          media.release();
        }
        function addResult(res){
          if($scope.currentPointer>=4)
          {
            clearInterval(timerId);
            $scope.audioList[$scope.currentPointer-4].duration=duration;
            $scope.audioList[$scope.currentPointer-4].res=res;
            userService.edit('repetition_arr',$scope.audioList);
            duration=0;
          }
        }
        function isLast(index){
          return index==last;
        }
  })

.controller('NamingTestCtrl', function($scope,$ionicSlideBoxDelegate,$localForage,$cordovaMedia,$cordovaFile,$timeout,$state,userService,$ionicPopup,listService) {
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
  var src='',record=null,arr=[],recName='',timerId,last;
  var folder=userService.get().folder.slice(1)+"naming/";
  var popObject={str:'',res:''};
  $scope.greyCounter=1;
  $scope.currentPointer=0;
     if(userService.get().naming==0 && userService.get().resumeNaming!=1){
       console.log("should resume or restart");
       $scope.imageList = userService.get().naming_arr;
       $scope.currentPointer=userService.resumePure('naming_arr')+5;
       last=$scope.imageList.length+4;
       timerId = setInterval(function() { duration++;}, 1000);
       $ionicSlideBoxDelegate.update();
     }
     else{
       console.log("new");
       listService.get('repetition.json').success(function(data){
         $scope.imageList=data;
         userService.edit('naming_arr',$scope.imageList)
         last=$scope.imageList.length+4;
       });
     }

   $scope.showPopup = function() {
     var myPopup = $ionicPopup.show({
       template:popObject.str,
       scope:$scope,
       buttons: [
         {
           text: 'Yes',type: 'button-positive',
           onTap: function(e) {
             if(record)stopAndRelease();
            // addResult(popObject.res);
             userService.edit("naming",!!popObject.res);
             return 'exit';
           }
         },
         { text: 'No',type: 'button-positive' }
       ]
     });
     myPopup.then(function(res) {
       if(res=='exit')$scope.exit();
     });
   }
   $scope.reportGesture=function(event,direction,fingerCount,distance){
     if(direction){
       if(direction=="up"||direction=="down"){
         if(fingerCount==1){
            console.log("UPNDOWN 1 FINGER");
            popObject.str='<b>Are you sure you want to Terminate this test?</b';
            popObject.res=1;
            $scope.showPopup();
         }
         else{
           console.log("UP||DOWN 2 finger");
           popObject.str='<b>Are you sure you want to Terminate this test?</b';
           popObject.res=0;
           $scope.showPopup();
         }
       }
       else{
         if(fingerCount==1){
           if(distance>=window.innerWidth/2){
             console.log("LONG LEFT| 1 finger|INCORRECT");
             if(record)stopAndRelease();
             addResult(0);
             $scope.nextSlide();
           }
           else{
             console.log("SHORT LEFT| 1 finger|CORRECT");
             if(record)stopAndRelease();
             addResult(1);
             $scope.nextSlide();
           }
         }else{
           console.log("LEFT 2 finger");
           if(record)stopAndRelease();
           addResult(-2);
           $scope.nextSlide();
         }
       }
     }
   }
   var timerId,duration=0;
   $scope.slideHasChanged=function(index){
     console.log("CURRENT INDEX:",index);
       $ionicSlideBoxDelegate.update();
         $scope.currentPointer=index;
     if(index==1||index==2){
       //recordInit("practice"+index);
     }
     if(index>=4 && !isLast(index)){
       recordInit($scope.imageList[index-4].name);
       timerId = setInterval(function() { duration++;}, 1000);
       if(index>=5 && ($scope.imageList[index-5].res==1 && $scope.greyCounter<=6)){
         $scope.greyCounter=1;
       }
       if(index>=5 && ($scope.imageList[index-5].res==0||$scope.imageList[index-5].res==-2)){
         $scope.greyCounter++;
       }
     }
     if(isLast(index)){
       userService.edit('naming',true);
       userService.edit('naming_arr',$scope.imageList)
     }
   };
   $scope.nextSlide = function() {
     $ionicSlideBoxDelegate.next();
   };
   $scope.exit=function(){
     $state.go('/test-home');
   };
   $scope.disableSwipe = function() {
    $ionicSlideBoxDelegate.enableSlide(false);
   };


       function recordInit(name){
         console.log("REC_NAME",name);
         recName=name;
         console.log(systemFolder+folder+name+".wav");
         record = new Media(systemFolder+folder +name+".wav",
           function () {
             console.log(record.src);
             },
           function (err) {
            console.log("recordAudio():Audio Error: " + err);
            console.log(record.src);
            console.log(JSON.stringify(err));
           });
           record.startRecord();
       }
       function stopAndRelease(){
         console.log("clearing");
         record.stopRecord();
         record.release();
       }
       function addResult(res){
         if($scope.currentPointer>=4)
         {
           clearInterval(timerId);
           $scope.imageList[$scope.currentPointer-4].duration=duration;
           $scope.imageList[$scope.currentPointer-4].res=res;
           userService.edit('naming_arr',$scope.imageList);
           duration=0;
         }
       }
       function isLast(index){
         return index==last;
       }
})
.controller('TestHomeCtrl', function($scope,$ionicPopup,$state,$cordovaFile,$localForage,userService,toastCenter,FileService) {
  $scope.user=userService.get();
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
  String.prototype.capitalizeFirstLetter = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  }
  $scope.go=function(url){
    if(url!='naming' && $scope.user.naming==0){
      if($scope.user[url]!='1'){
              namingIncomplete(url);
      }
      else{
        toastCenter.toast('Already complete');
      }
    }
    else if(url!='naming' && $scope.user.naming==-1){
      toastCenter.toast('Please complete the Naming test before proceeding');
    }
    else if($scope.user[url]==-1){
        FileService.createDir($scope.user.folder.slice(1),url+"/")
         .then(function (success) {
           $state.go("/"+url);
         });
    }
    else if($scope.user[url]==0){
      resume(url);
    }
    else if($scope.user[url]==1){
      toastCenter.toast('Already complete');
    }
  }
  var resume = function(url) {
    var resumePop = $ionicPopup.show({
      template:'<b>Would you like to resume the test from where you last terminated?</b',
      buttons: [
        {
          text: 'Yes',type: 'button-positive',
          onTap: function(e) {
            $scope.user['resume'+url.capitalizeFirstLetter()]=0;
            userService.setCurrent($scope.user);
            $state.go("/"+url);
            return e;
          }
        },
        { text: 'No, start from beginning',type: 'button-positive',
          onTap:function(e){
            $scope.user['resume'+url.capitalizeFirstLetter()]=1;
            userService.setCurrent($scope.user);
            $state.go("/"+url);
            return e;
          }
       }
      ]
    });
    resumePop.then(function(res) {
      console.log('Tapped!', res);
    });
  }
  function namingIncomplete(url) {
    var myPopup = $ionicPopup.show({
      template: 'The Naming test is Incomplete. Do you still want to continue?',
      buttons: [
        {
          text: 'Yes',type: 'button-positive',
          onTap: function(e) {
            return true;
          }
        },
        { text: 'No',type: 'button-positive',
        onTap: function(e) {
              return false;
            }
          }
      ]
    });
    myPopup.then(function(res) {
      if(res){
        $cordovaFile.createDir(systemFolder+$scope.user.folder.slice(1),url+"/", false)
         .then(function (success) {
           $state.go("/"+url);
         });
         myPopup.close();
      }
      else{
        myPopup.close();
      }
    });
  }
})
.controller('WordTestCtrl', function($scope,$ionicSlideBoxDelegate,listService,$state,userService,$ionicPopup,toastCenter,$timeout) {
  $scope.currentPointer=0;var activeListener;
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
  var _POINTER=0;
  var allowed=false,last,media=null,duration=0,timerId;
  $scope.playing=false;
  $scope.greyCounter=1;
  $scope.nextSlide = function() {
    if(media)
    {media.release();
    media=null;}
    clearInterval(timerId);
    $ionicSlideBoxDelegate.next();
  }
  $scope.disableSwipe = function() {
   $ionicSlideBoxDelegate.enableSlide(false);
  };
  if(userService.get().word==0 && userService.get().resumeWord!=1){
    _POINTER=3;

    console.log("should resume or restart");
    $scope.list = userService.get().word_arr;
    $scope.currentPointer=userService.resume('word_arr');
    last=$scope.list.length+4;
    timerId = setInterval(function() { duration++;}, 1000);
    audioPrepare($scope.list[$scope.currentPointer-_POINTER+1].name);
    $ionicSlideBoxDelegate.update();
  }
  else{
    console.log("new");
    _POINTER=5;
    listService.get('word.json').success(function(data){
      $scope.list = data;
      $scope.practice=$scope.list.splice(0, 2);
      userService.edit('word_arr',$scope.list);
      $ionicSlideBoxDelegate.update();
      last=$scope.list.length+4;
    });
  }

  $scope.exit=function(){
    $state.go('/test-home');
  };
  $scope.play = function() {
        media.play();
  }
  function isLast(index){
    return index==last;
  }
  function audioPrepare(name){
    $timeout(function(){
      media = new Media(cordova.file.applicationDirectory+"www/audio/" +name+".wav",
        function () {console.log("audio success");},
        function (err) {console.log("Audio Error: " + err);
      });
      media.play();
    },1000);
  }
  $scope.slideHasChanged=function(index){
    $scope.currentPointer=index;
    console.log("top index",index);
      activeListener=$("ion-slide[data-index="+index+"]");
    if(index==1||index==2){
      audioPrepare($scope.practice[index-1].name);
    }
    if(index>=5){
      save();
      if($scope.list[index-_POINTER].res==0){
        $scope.greyCounter++;
      }else if($scope.list[index-_POINTER].res==1 && $scope.greyCounter<=6){
              $scope.greyCounter=1;
            }
    }
    if(isLast($scope.currentPointer)){
        userService.edit('word',true);
    }
    if(index>=4 && !isLast(index)){
      audioPrepare($scope.list[index-_POINTER+1].name);
      timerId = setInterval(function() { duration++;}, 1000);
    }
  }
  $scope.reportGesture=function(event,direction,fingerCount,distance){
    if(direction){
      if(direction=="up"||direction=="down"){
        if(fingerCount==1){
           console.log("UPNDOWN 1 FINGER");
           popObject.str='<b>Are you sure you want to Terminate this test?</b';
           popObject.res=1;
           $scope.showPopup();
        }
        else{
          console.log("UP||DOWN 2 finger");
          popObject.str='<b>Are you sure you want to Terminate this test?</b';
          popObject.res=0;
          $scope.showPopup();
        }
      }
      else{
        if(fingerCount==1){
          if(allowed||($scope.currentPointer==2||$scope.currentPointer==1)){
            allowed=false;
            $scope.nextSlide();
          }
          else{
            console.log("wasn't clicked");
            toastCenter.toast('Oh, you forgot to choose an item. Please select one to proceed.');
          }
        }
      }
    }
  }

  function save(terminate){
    if(terminate==0||terminate==1){
      userService.edit('word',terminate);
    }else{
      $scope.list[$scope.currentPointer-_POINTER].duration=duration;
      userService.edit('word_arr',$scope.list);
      duration=0;
    }
  }

  $scope.click=function(item,clicked,id){
    var name=clicked.substring(clicked.lastIndexOf('/')+1).split(".")[0];
    $(activeListener).find('.active').removeClass('active');
    $(activeListener).find('#'+id).addClass('active');
    if($scope.currentPointer>=4){
      if(item.name==name){
        item.res=1;
        item.clicked=name;
      }
      else{
        item.res=0;
        item.clicked=name;
      }

    }
    allowed=true;
  }

  var popObject={str:'',res:''};
  $scope.showPopup = function() {
    var myPopup = $ionicPopup.show({
      template:popObject.str,
      scope:$scope,
      buttons: [
        {
          text: 'Yes',type: 'button-positive',
          onTap: function(e) {
            if(allowed){$scope.list[$scope.currentPointer-4].res=-1;}
            save(popObject.res);
            return 'exit';
          }
        },
        { text: 'No',type: 'button-positive' }
      ]
    });
    myPopup.then(function(res) {
      if(res=='exit')$scope.exit();
    });
  }
})


;
