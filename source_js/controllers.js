var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UserController', ['$scope', '$routeParams', 'sharedServ','$http','$window', function($scope, $routeParams,sharedServ,$http,$window) {
  // $scope.data = "";
  //  $scope.displayText = ""
  //
  // $scope.setData = function(){
  //   CommonData.setData($scope.data);
  //   $scope.displayText = "Data set"
  //
  // };
  console.log("at user controller");

  $scope.url = sharedServ.getURL();

  $http.get($scope.url+'/users').success(function(data){
    //console.log("user.html: successfully get users data: \n",data);
    $scope.users = data;
  }).
  error(function(data,status){
    console.log("Get users data failed, response: ",data," status:",status);
  })

  $scope.addUser = function(){
    window.location = '#/users_add/';
  }
  $scope.displayDetail = function(user){
    window.location = '#/users_detail/'+ user._id;
    sharedServ.setUser(user);
    $routeParams.id = user._id;
  }
  $scope.deleteUser = function(user){
    $http.delete($scope.url+'/users/'+user._id).success(function(data){
      console.log("Successfully deleted user: ",user.name);
      $http.get($scope.url+'/users').success(function(data){
        //console.log("user.html: successfully get users data: \n",data);
        $scope.users = data;
      }).
      error(function(data,status){
        console.log("Get users data failed, response: ",data," status:",status);
      })
    }).
    error(function(data,status){
      console.log("Failed to delete user: ",user.name, "\ndata: ",data, "\nstatus: ",status);
    })
  }
}]);
mp4Controllers.controller('UserAddController', ['$scope', 'sharedServ','$http','$window', function($scope, sharedServ,$http,$window) {
  $scope.submitted = false;
  $scope.submitSuccess = false;
  $scope.error = false;

  $scope.url = sharedServ.getURL();

  $scope.postUser = function(){
    $scope.submitted = true;
    $scope.error = false;
    $scope.enteredUser = $scope.username;
    var data = {
      "name": $scope.username,
      "email": $scope.email,
      "pendingTasks": "",
      "dateCreated": ""
    };
    $http.post($scope.url+'/users',data).success(function(data){
      console.log("post data success: ",data);
      $scope.submitSuccess = true;
      $scope.submitted = false;
      $scope.username = "";
      $scope.email = "";
    }).
    error(function(data,status){
      $scope.error = true;
      $scope.err_msg = data.message;
      $scope.submitSuccess = false;
      console.log("post data failed: ",data," status: ",status);
    });
  }


}]);
mp4Controllers.controller('UserDetailController', ['$scope','sharedServ','$http','$window', function($scope,sharedServ,$http,$window) {
  $scope.url = sharedServ.getURL();
  $scope.user = sharedServ.getUser();
  $scope.readyshow = false;
  $scope.show = false;

  $http.get($scope.url+'/tasks/?where={"assignedUserName":"'+ $scope.user.name+'"}').success(function(data){
    $scope.tasks = data;
    $scope.tasks = sharedServ.convertDate(data);
    sharedServ.setPage(10);
  }).
  error(function(data,status){
    console.log("Get task failed: ",data, "status: ",status);
  });

  $scope.showComplete = function(){
    $scope.show = true;
  }
  $scope.toComplete = function(task){
    console.log("task: ", task);
    task.completed = true;
    var data = {
      "name": task.name,
      "description": task.description,
      "deadline": task.deadline,
      "completed": true,
      "assignedUser": task.assignedUser,
      "assignedUserName": task.assignedUserName,
      "dateCreated": task.dateCreated
    };
    $http.put($scope.url+'/tasks/'+ task._id, data).success(function(data){
      console.log("Successfully update completed to true.");
    }).
    error(function(data,status){
      console.log("Failed to update completed field to true: ",data," status:",status);
    })
  }
}]);

mp4Controllers.controller('TaskController', ['$scope','sharedServ','$http','$window', function($scope,sharedServ,$http,$window) {
  $scope.url = sharedServ.getURL();
  $http.get($scope.url+'/tasks?sort={"dateCreated": 1}&limit=10').success(function(data){
    $scope.tasks = sharedServ.convertDate(data);
    sharedServ.setPage(10);
  }).
  error(function(data,status){
    console.log("Get tasks failed, response: ",data," status:",status);
  })

  $scope.goNextPage = function(){

    var temp = sharedServ.getPage();
    if(temp%10 ==0){

      $http.get($scope.url+'/tasks?sort={"dateCreated": 1}&skip=' +temp+ '&limit=10').success(function(data){
        $scope.tasks = sharedServ.convertDate(data);
        console.log("total ", temp+10, "objects");
        console.log("data: ",data)
        if(data.data.length<10)sharedServ.setPage(temp+data.data.length);
        else sharedServ.setPage(temp+10);
      }).
      error(function(data,status){
        console.log("Get tasks failed, response: ",data," status:",status);
      })

    }


  }
  $scope.goPreviousPage = function(){
    var totalPage = sharedServ.getPage();
    var shouldSkip;
    if(totalPage !== 0){

      if(totalPage%10 !== 0){
        shouldSkip = (totalPage - totalPage%10)-10;
      }
      else shouldSkip = totalPage - 10;
      $http.get($scope.url+'/tasks?sort={"dateCreated": 1}&skip=' +shouldSkip+ '&limit=10').success(function(data){
        $scope.tasks = sharedServ.convertDate(data);
        console.log("shouldSkip ", shouldSkip, "objects");
        sharedServ.setPage(shouldSkip);
      }).
      error(function(data,status){
        console.log("Get tasks failed, response: ",data," status:",status);
      })

    }


  }


  $scope.addTask = function(){
    window.location = '#/tasks_add/';
  }
  $scope.deleteTask = function(task){
    $http.delete($scope.url+'/tasks/'+task._id).success(function(data){
      $http.get($scope.url+'/tasks?sort={"dateCreated": 1}').success(function(data){
        $scope.tasks = data;
      }).
      error(function(data,status){
        console.log("Get tasks data failed, response: ",data," status:",status);
      })
    }).
    error(function(data,status){
      console.log("Failed to delete tasks: ",task._id, "\ndata: ",data, "\nstatus: ",status);
    })
  }
  $scope.showPending = function(){
    $http.get($scope.url+'/tasks?where={"completed":false}&sort={"dateCreated": 1}').success(function(data){
      $scope.tasks = sharedServ.convertDate(data);
      console.log("get pending tasks: ",data);
    }).
    error(function(data,status){
      console.log("Sort pending tasks failed, response: ",data," status:",status);
    })
  }
  $scope.showCompleted = function(){
    $http.get($scope.url+'/tasks?where={"completed":true}&sort={"dateCreated": 1}').success(function(data){
      $scope.tasks = sharedServ.convertDate(data);
      console.log("get completed tasks: ",data);
    }).
    error(function(data,status){
      console.log("Sort completed tasks failed, response: ",data," status:",status);
    })
  }
  $scope.showAll = function(){
    $http.get($scope.url+'/tasks?sort={"dateCreated": 1}').success(function(data){
      $scope.tasks = sharedServ.convertDate(data);
    }).
    error(function(data,status){
      console.log("Sort completed tasks failed, response: ",data," status:",status);
    })
  }
  $scope.types = ["dateCreated","deadline","name","assignedUserName"];
  $scope.goAscend = function(){

    $http.get($scope.url+'/tasks?sort={"'+ $scope.sortType+ '":1}').success(function(data){
      $scope.tasks = sharedServ.convertDate(data);
      console.log("go Ascending: ",data);
    }).
    error(function(data,status){
      console.log("Sort completed tasks failed, response: ",data," status:",status);
    })
  }
  $scope.goDescend = function(){

    $http.get($scope.url+'/tasks?sort={"'+ $scope.sortType+ '": -1}').success(function(data){
      $scope.tasks = sharedServ.convertDate(data);
      console.log("go Ascending: ",data);
    }).
    error(function(data,status){
      console.log("Sort completed tasks failed, response: ",data," status:",status);
    })
  }
  $scope.sortOnType = function(){

    // console.log("search.in: ",$scope.search.in);
    if($scope.sortType === "dateCreated"){

      $http.get($scope.url+'/tasks?sort={"dateCreated":' +$scope.search+ '}').success(function(data){
        $scope.tasks = sharedServ.convertDate(data);
        console.log("sort on dateCreated: ",data);
      }).
      error(function(data,status){
        console.log("Sort completed tasks failed, response: ",data," status:",status);
      })

    }
    else if($scope.sortType === "deadline"){

      $http.get($scope.url+'/tasks?sort={"deadline":' +$scope.search+ '}').success(function(data){
        $scope.tasks = sharedServ.convertDate(data);
        console.log("sort on deadline: ",data);
      }).
      error(function(data,status){
        console.log("Sort completed tasks failed, response: ",data," status:",status);
      })

    }
    else if($scope.sortType === "name"){

      $http.get($scope.url+'/tasks?sort={"name":' +$scope.search+ '}').success(function(data){
        $scope.tasks = sharedServ.convertDate(data);
        console.log("sort on name: ",data);
      }).
      error(function(data,status){
        console.log("Sort completed tasks failed, response: ",data," status:",status);
      })

    }
    else if($scope.sortType === "assignedUserName"){

      $http.get($scope.url+'/tasks?sort={"assignedUserName":' +$scope.search+ '}').success(function(data){
        $scope.tasks = sharedServ.convertDate(data);
        console.log("sort on assignedUserName: ",data);
      }).
      error(function(data,status){
        console.log("Sort completed tasks failed, response: ",data," status:",status);
      })

    }
  }




}]);
mp4Controllers.controller('TaskAddController', ['$scope','sharedServ','$http','$window', function($scope,sharedServ,$http,$window) {
  $scope.submitted = false;
  $scope.error = false;
  $scope.submitSuccess = false;

  $scope.url = sharedServ.getURL();
  $http.get($scope.url+'/users').success(function(data){
    //console.log("user.html: successfully get users data: \n",data);
    $scope.users = data;
  }).
  error(function(data,status){
    console.log("Get users data failed, response: ",data," status:",status);
  });

  $scope.postTask = function(){
    $scope.submitted = true;
    $scope.error = false;
    $scope.enteredTask = $scope.taskname;
    var assignedUserID = "";
    var assignedUserName = "";
    if($scope.assignedUser !== undefined){
      assignedUserID = $scope.assignedUser._id;
      assignedUserName = $scope.assignedUser.name;
    }
    var data = {
      "name": $scope.taskname,
      "description": $scope.description,
      "deadline": $scope.date,
      "completed": false,
      "assignedUser":assignedUserID,
      "assignedUserName":assignedUserName,
      "dateCreated":""
    };
    $http.post($scope.url+'/tasks',data).success(function(data){
      console.log("post data success: ",data);
      $scope.submitSuccess = true;
      $scope.submitted = false;
      $scope.taskname = "";
      $scope.description = "";
      $scope.date = null;
      $scope.assignedUser = null;
    }).
    error(function(data,status){
      $scope.error = true;
      $scope.submitSuccess = false;
      $scope.err_msg = data.message;
      console.log("post data failed: ",data," status: ",status);
    });
  }
}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window','$http', 'sharedServ', function($scope, $window,$http,sharedServ) {
  $scope.url = $window.sessionStorage.baseurl;
  console.log("baseURL: ",$scope.url);

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    console.log("Set url to: ",$scope.url);
    $scope.displayText = "URL set";
    sharedServ.setURL($scope.url);
  };

}]);
mp4Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();
  };
}]);
mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });
}]);
