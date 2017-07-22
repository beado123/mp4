var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/llamas');
        }
    }
});
mp4Services.factory('sharedServ', function($http) {
	var backURL = "";
  var curr_user = {};
  var page;
  var months = {'01':'January', '02':'February','03':'March','04':'April','05':'May','06':'June','07':'July','08':'August','09':'September','10':'October','11':'November','12':'December'};
	return {
					setURL: function(url){
						backURL = url;
					},
					getURL: function(){
						return backURL;
					},
          setPage: function(num){
            page = num;
          },
          getPage: function(){
            return page;
          },
          setUser: function(user){
            curr_user = user;
          },
          getUser: function(){
            return curr_user;
          },
          convertDate: function(tasks){
            var mytasks = tasks.data;
            for(var i=0;i<mytasks.length;i++){
              var curr = mytasks[i].deadline;
              var parts = curr.split("-");
              var year = parts[0];
              var month = parts[1];
              var day = parts[2].substring(0,2);
              mytasks[i].deadline = "Deadline: "+months[month]+" "+day+", "+year;
            }
            return tasks;
          },
          getUserList: function(url){
            $http.get(backURL+'/users').success(function(data){
              console.log("user.html: successfully get users data: \n",data);
              return data;
            }).
            error(function(data){
              console.log("Get users data failed: ",data)
              return data;
            })
          }
	    }
});// Write any factories or services here
