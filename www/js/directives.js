
angular.module('starter.directives', [])
.directive('ionRadialProgress', ['$timeout', function($timeout) {
  function link(scope, element, attrs) {
    var base=angular.element(element.children()[0]);
    var fill=angular.element(element[0].querySelector('.ppc-progress-fill'));
    var wrapper=angular.element(element[0].querySelector('.pcc-percents-wrapper'));
    angular.element(element[0].querySelector('.progress-name')).text(element[0].dataset.name);
    attrs.$observe('percent', function(val) {

       var seconds = parseInt(element[0].dataset.percent)||0,
       startTime=element[0].dataset.startTime||30;

        function drawCircle() {
          if (seconds > 15) {
            base.addClass('gt-50');
          }
          else{
            base.removeClass('gt-50');
          }
          var deg = 360*(seconds/startTime);
          fill.css('transform','rotate('+ deg +'deg)');
          wrapper.find('span').html(seconds+' ');
        }
        drawCircle();
    });
  }
  return {
    link:link,
    scope:{},
    template: '<div class="progress-pie-chart"><div class="ppc-progress"><div class="ppc-progress-fill"></div></div><div class="ppc-percents"><div class="pcc-percents-wrapper"><span>sec</span></div></div></div><span class="progress-name"></span>'
  };
}])
.directive("myDirective", function($filter){
 return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelController) {
      ngModelController.$parsers.push(function(data) {
        //convert data from view format to model format
        console.log("par:",data);
        return data; //converted
      });
      ngModelController.$formatters.push(function(data) {
        //convert data from model format to view format
          console.log("for:",data);
        return $filter('date')(data, 'MM-dd-yyyy');
      });
    }
  };
})
.filter('month', function ($filter) {
      var msecPerDay = 24 * 60 * 60 * 1000;
      var yesterday = (function(d){ d.setDate(d.getDate()-1); return d.getDate()})(new Date);
      var now=new Date().getDate();
      var d5 = (function(d){ d.setDate(d.getDate()-2); return d.getDate()})(new Date),
          d4 = (function(d){ d.setDate(d.getDate()-3); return d.getDate()})(new Date),
          d3 = (function(d){ d.setDate(d.getDate()-4); return d.getDate()})(new Date),
          d2 = (function(d){ d.setDate(d.getDate()-5); return d.getDate()})(new Date),
          d1 = (function(d){ d.setDate(d.getDate()-6); return d.getDate()})(new Date);
       return function (val) {
         var check=new Date(val).getDate();
            if(check == now){
              val="Today";
            }
            else if(check == yesterday){
              val="Yesterday";
            }
            else if(check==d5||check==d4||check==d3||check==d2||check==d1){
              val = $filter('date')(new Date(val),'EEEE');
            }
            else{
              val=new Date(val).toDateString();
              val=val.split(" ");
              return val[1]+" "+val[2];
            }
            return val;
        };
    })
    .filter('myFilter', function() {
        return function(items, begin, end) {
            return items.slice( begin, end);
        }
    })
    .directive('circleCheck',function(){
      function link(scope, element, attrs) {
        attrs.$observe('number', function(val) {
           var number = parseInt(element[0].dataset.number);
           if(number==-1){
             element[0].style.background="none";
           }
           if(number==-2){
             element[0].style.background="#0c4b64";
           }
           if(number==0||number==1){
             element[0].innerHTML=number;
             element[0].style.background="none";
           }
        });
      }
      return {
        link:link,
        scope:{}
      };
    })
    .directive('barsCheck',function(){
      function link(scope, element, attrs) {
        attrs.$observe('len', function(val) {
           var number = parseInt(element[0].dataset.len)||1;
          element[0].style.width=number*5+'px';
        });
      }
      return {
        link:link,
        scope:{}
      };
    })
    .directive('paddingDirective',function(){
      function link(scope, element, attrs) {
        scope.$watch('number', function(val) {
          if(val!="undefined"){
          if(scope.number==-1){
            element[0].innerHTML='&nbsp; &nbsp;';
          }
          if(scope.number==0){
            element.addClass('ion-asterisk');
            element.removeClass('ion-checkmark');
            element[0].innerHTML='';
          }
          if(scope.number==1){
            element.addClass('ion-checkmark');
            element.removeClass('ion-asterisk');
            element[0].innerHTML='';
          }
        }
        });
      }
      return {
        link:link,
        scope:{number:'=number'}
      };
    })
    .directive('detectGestures', function() {
      return {
        restrict :  'A',
        link : function(scope, elem, attrs) {
          $(elem[0]).swipe({
            swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
              if(direction!=="right")scope.reportGesture(event,direction,fingerCount,distance);
            },
            threshold:75,
            fingers:'all'
          });
        }
      }
    })
    .directive('optimizeSlides', function () {
      return {
        link: function (scope, elem, attrs) {
          scope.$watch(function () {
            return scope.$eval(attrs.activeSlide);
          }, function (val) {
            var array = [scope.$eval(attrs.activeSlide), scope.$eval(attrs.activeSlide) + 1, scope.$eval(attrs.activeSlide) - 1];
            for (var i = 0, len = scope.$eval(attrs.optimizeSlides).length; i < len; i++) {
              if (array.indexOf(i)>-1) {
                scope.$eval(attrs.optimizeSlides)[i].show = true;
              } else {
                scope.$eval(attrs.optimizeSlides)[i].show = false;
              }
            }
          });
        }
      };
  })
  .directive("detectFocus", function($timeout) {
  return {
    "restrict" : "AC",
    "link" : function(scope, elem, attrs) {
      elem.on("focus", function() {
        $timeout(function(){
          elem.triggerHandler('click');
        //  $('.pane-parent').css('top',0);
        //  angular.element(document.getElementsByClassName('header-reg')).addClass('ng-hide');
        },700);
      });
    }
  }
})
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
})
;
