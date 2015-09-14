angular.module('starter.services',[])
.service("userService",function($localForage,$cordovaFile,$q){
var userDefault={
  naming:-1,
  semantic:-1,
  word:-1,
  repetition:-1,
  repetition_arr:[],
  word_arr:[],
  semantic_arr:[],
  naming_arr:[]
};
  var list=[];
  var user={};
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
  function createFolder(dateTest,userFolder){
    var deffered = $q.defer();
    $cordovaFile.checkDir(systemFolder,dateTest).then(function(success){
      $cordovaFile.createDir(systemFolder,dateTest+"/"+userFolder, false).then(function(success){
        deffered.resolve(success);
      });
    },function(error){
      $cordovaFile.createDir(systemFolder,dateTest, false).then(function(success){
        $cordovaFile.createDir(systemFolder+dateTest,userFolder, false).then(function(success){
          deffered.resolve(success);
        });
      });
    });
    return deffered.promise;
  }
  function getUnique(item, i, ar){ return ar.indexOf(item) === i; }
  function normalizeDate(element, index, array) {
    console.log(element);
    return new Date(element).toISOString().split("T")[0];
  }
  return{
    check:function(name){
      var deffered=$q.defer();
      $localForage.getItem(name).then(function(data){
        deffered.resolve(data);
      })
      return deffered.promise;
    },
    create:function(data){
      var deffered=$q.defer();
      var timestamp=new Date().getTime();
      var dob=new Date(data.dob).toISOString().split("T")[0];
      var dateTest=new Date(data.dateTest).toISOString().split("T")[0];
      var userFolder=""+data.id+"_"+dob+"_"+data.initials+'_'+timestamp;

       createFolder(dateTest,userFolder).then(function(success){

         user=angular.copy(userDefault);
         user.folder=success.fullPath;
         user.id=data.id+'_'+timestamp;
         user.name=data.id;
         user.dob=dob;
         user.doctor=data.initials;
         user.dateTest=dateTest;
         user.created=timestamp;
         $localForage.setItem(user.id,user).then(function(){
           deffered.resolve(user);
         });
       });
       return deffered.promise;
    },
    edit:function(property,value){
      if(user.hasOwnProperty(property))
      {user[property]=value;}
      else{user.property=value;}
      $localForage.setItem(user.id,user).then(function(){
        console.log("updated: ");
      })
    },
    get:function(){
          return user||userDefault;
    },
    getAll:function(){
      list=[];
      var deffered = $q.defer();
        $localForage.keys().then(function(data) {
            data.forEach(function(key){
              $localForage.getItem(key).then(function(data){
                list.push(data);
              })
            });
            deffered.resolve(list);
          });
        return deffered.promise;
    },
    getDates:function(){
        var deffered = $q.defer();
          $localForage.keys().then(function(data) {
              $localForage.getItem(data).then(function(data){
                var dates=[];
                dates=data.map(function(a) {return new Date(a.dateTest).getTime();}).filter(getUnique).map(normalizeDate);
                deffered.resolve(dates);
              });
            });
          return deffered.promise;
      },
    setCurrent:function(usCur){
      user=usCur;
    },
    resume:function(item){
      for(var i=29;i>=0;i--){
        if(user[item][i].res=='1'||user[item][i].res=='0'){
        return i+3;}
      }
      return 1;
    },
    resumePure:function(item){
      for(var i=29;i>=0;i--){
        if(user[item][i].res=='1'||user[item][i].res=='0'){
        return i;}
      }
      return 0;
    }
  }
})
.service('listService',function($http){
  return{
    get:function(name){
      var url = "";
      if(ionic.Platform.isAndroid()){
          url = "/android_asset/www/";
      }
      return $http.get(url+'js/'+name);
    }
  }
})
.service('toastCenter',function($cordovaToast){
  return{
    toast:function(message){
      $cordovaToast.showShortTop(message).then(function(success) {
        // success
      }, function (error) {
        // error
      });
    },
    toastMidLong:function(message){
      $cordovaToast.showLongCenter(message).then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }
  }
})
.service('FileService',function($cordovaFile,$q){
  var systemFolder=ionic.Platform.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
  return {
    checkDir:function(folder){
      var deffered=$q.defer();
      $cordovaFile.checkDir(systemFolder, folder)
      .then(function (success) {
        deffered.resolve(success.nativeURL);
      }, function (error) {
        deffered.reject(error);
      });
      return deffered.promise;
    },
    createDir:function(folder,url){
      var deffered=$q.defer();
      $cordovaFile.createDir(systemFolder+folder, url,true)
      .then(function (success) {
        deffered.resolve(success);
      }, function (error) {
        deffered.reject(error);
      });
      return deffered.promise;
    }

  }
})
;
