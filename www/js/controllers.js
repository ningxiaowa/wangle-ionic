angular.module('starter.controllers', [])

.controller('TodayCtrl', function($scope, $rootScope, $ionicUser, $ionicPush) {
  // Identifies a user with the Ionic User service
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });
  };

  // Registers a device for push notifications and stores its token
  $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');
    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    });
  };
  // Handles incoming device tokens
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.token = data.token;
  });
})

//memo
.controller('MemoCtrl', function(GetUrl, $scope, $http) {
  // $http.get(GetUrl.apiUrl+'/usefulMemos').success(function(items) {
  //   $scope.memos = items;
  // });
  // Simple GET request example :
  $http.get(GetUrl.apiUrl+'/usefulMemos').
    then(function(items) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.memos = items.data;
      //离线缓存
      window.localStorage['memos'] = JSON.stringify(items.data);
    }, function(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.memos = JSON.parse(window.localStorage['memos'] || '{}');
    });
  $scope.remove = function(memo) {
    $scope.memos.splice($scope.memos.indexOf(memo), 1);
    //数据库删除
    $http.get(GetUrl.apiUrl+'/deleteMemo?memoId=' + memo.id).success(function(items) {
      //$scope.memos = items;
    });
  }
    //下拉刷新
    $scope.doRefresh = function() {
      //取数据
    $http.get(GetUrl.apiUrl+'/usefulMemos').
      then(function(items) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.memos = items.data;
        //离线缓存
        window.localStorage['memos'] = JSON.stringify(items.data);
      }, function(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.memos = JSON.parse(window.localStorage['memos'] || '{}');
      })
      .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
       });
    };
})
//编辑memo
.controller('MemoDetailCtrl', function(GetUrl, $http, $ionicHistory, $scope, $state, $stateParams) {
  $http.get(GetUrl.apiUrl+'/memoDetail?memoId=' + $stateParams.memoId).
    then(function(items) {
      $scope.memo = items.data;
    }, function(response) {
      //error
    });
  $scope.saveMemo = function(){
    // Simple POST request example (passing data) :
    $http.post(GetUrl.apiUrl+'/editMemo', $scope.memo)
    .then(function(response) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(response);
        if (response.data.status == 1) {
          //v1.1.0新特性
          $ionicHistory.clearCache().then(function(){
            $state.go('tab.memo');
          })
          //$ionicHistory.clearCache();
          //$state.go("tab.memo");
        };
      }, function(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }
})
.controller('AddMemoCtrl', function(GetUrl, $ionicHistory, $scope, $http, $state) {
  //add
  $scope.memo = {keyword:'',detail:''};
  $scope.addMemo = function(){
    // Simple POST request example (passing data) :
    $http.post(GetUrl.apiUrl+'/addMemo', $scope.memo)
    .then(function(response) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(response);
        if (response.data.status == 1) {
          //$cordovaToast.showShortBottom('保存成功');
          //v1.1.0新特性
          $ionicHistory.clearCache().then(function(){
            $state.go('tab.memo');
          })
          //$ionicHistory.clearCache();
          //$state.go("tab.memo");
        };
      }, function(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }
})

.controller('ScheduleCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ScheduleDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SummaryCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('WishCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
;
