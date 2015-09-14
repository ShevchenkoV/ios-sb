angular.module('starter.registration', [])
.controller('NewTestCtrl',function($scope,$state,userService){

  $scope.test={
    initials:'',
    id:'',
    dateTest:new Date(),
    dob:new Date(new Date().setFullYear(1950))
  };
  document.getElementById('dateTest').valueAsDate = new Date();
  var today = new Date().toISOString().split('T')[0];
  document.getElementsByName("uDt")[0].setAttribute('min', today);
  $scope.go=function(){
        if($scope.testForm.$valid){
           userService.create($scope.test).then(function(data){
             userService.setCurrent(data);
            $state.go('/test-home');
           })
        }
        else{console.log("not valid");}
  }
  $scope.check=function(date){
    if(date<new Date){
      console.log(date);
      $scope.test.dateTest=new Date();
    }
  }
});
