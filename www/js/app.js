// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ionic.service.push','ngCordova',  'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform,$state,$ionicHistory,$cordovaToast,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

  //启动极光推送服务 
  window.plugins.jPushPlugin.init(); 
  //调试模式 
  window.plugins.jPushPlugin.setDebugMode(true);

  document.addEventListener("jpush.openNotification", onOpenNotification, false);
  function onOpenNotification(){
    var alertContent;
    if(device.platform == "Android"){
        alertContent = window.plugins.jPushPlugin.openNotification.alert;
    }else{
        alertContent = event.aps.alert;
        window.plugins.jPushPlugin.setBadge(0);
        //$state.go("tab.today");
    }
    alert("open Notificaiton:"+alertContent);
  }

    $ionicPlatform.registerBackButtonAction(function () {
      if($state.is("tab.today")||$state.is("tab.memo")||$state.is("tab.summary")||$state.is("tab.wish")){
        if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortCenter('再按一次退出应用');
            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
      }else{
        $ionicHistory.goBack();
      }
    },100);
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  //tab图标位置
  $ionicConfigProvider.tabs.position('bottom');
  //$ionicConfigProvider.navBar.alignTitle('center');

  //Any way for $http.post to send request parameters instead of JSON
  //将json转为parameters传递到后台
    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.today', {
    url: '/today',
    views: {
      'tab-today': {
        templateUrl: 'templates/tab-today.html',
        controller: 'TodayCtrl'
      }
    }
  })

  .state('tab.memo', {
    url: '/memo',
    //cache: false,
    views: {
      'tab-memo': {
        templateUrl: 'templates/tab-memo.html',
        controller: 'MemoCtrl'
      }
    }
  })
  .state('tab.memo-detail', {
    url: '/memo/:memoId',
    views: {
      'tab-memo': {
        templateUrl: 'templates/memo/memo-detail.html',
        controller: 'MemoDetailCtrl'
      }
    }
  })
  .state('tab.add-memo', {
    url: '/add-memo',
    views: {
      'tab-memo': {
        templateUrl: 'templates/memo/add-memo.html',
        controller: 'AddMemoCtrl'
      }
    }
  })

  .state('tab.schedule', {
      url: '/schedule',
      views: {
        'tab-schedule': {
          templateUrl: 'templates/tab-schedule.html',
          controller: 'ScheduleCtrl'
        }
      }
    })
    .state('tab.schedule-detail', {
      url: '/schedule/:scheduleId',
      views: {
        'tab-schedule': {
          templateUrl: 'templates/schedule-detail.html',
          controller: 'ScheduleDetailCtrl'
        }
      }
    })

  .state('tab.summary', {
    url: '/summary',
    views: {
      'tab-summary': {
        templateUrl: 'templates/tab-summary.html',
        controller: 'SummaryCtrl'
      }
    }
  })

  .state('tab.wish', {
    url: '/wish',
    views: {
      'tab-wish': {
        templateUrl: 'templates/tab-wish.html',
        controller: 'WishCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/memo');

});
