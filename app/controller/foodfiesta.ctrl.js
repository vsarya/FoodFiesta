/**
* @author: anan@adobe.cpm, varya@adobe.com, shsinha@adobe.com
*version :1.0
*Controllers module
*/
(function () {
	var ng = angular.module("restaurant_module", ["ngRoute","service_module","custom_directive"]);  // restaurant module dependency on service module, directive module

	ng.controller("DeliveryInfoController", function($rootScope,$scope,$location){ //$rootScope is global scope object; entire controller objects; small 
		//things like user name (welcome "smith"),locally specific things, don't put business data in rootscope since it is very huge.
		
		$scope.username = "";
		$scope.del_address = ""	;

  	$scope.getInfo = function() {
	    if(localStorage.getItem('username')!=undefined && localStorage.getItem('delivery_address')!=undefined && localStorage.getItem('username') != "" && localStorage.getItem('delivery_address') != "") {
	   	$scope.username=localStorage.getItem('username');
	 	$scope.del_address =  localStorage.getItem('delivery_address');
		return 1;
		}	
		 return 0;
	    }

	    $scope.setInfo = function() {
	    	if($scope.username !="" && $scope.del_address !="" && $scope.username!= undefined && $scope.del_address!= undefined)
	    {
	    	localStorage.setItem('username',$scope.username);
			localStorage.setItem('delivery_address',$scope.del_address);
			$location.path('/')

		}
		// console.log($scope.username);
		// console.log($scope.del_address);
	    }

	});
     
	ng.controller("RestaurantController", function($rootScope,$scope){ //$rootScope is global scope object; entire controller objects; small 
		//things like user name (welcome "smith"),locally specific things, don't put business data in rootscope since it is very huge.
		
		$scope.cuisines=['chinese','indian','thai','vegetarian'];
		$scope.cuisineIncludes = [];
    
	    $scope.includeCuisine = function(cuisine) {
	        var i = $.inArray(cuisine, $scope.cuisineIncludes);
	        if (i > -1) {
	            $scope.cuisineIncludes.splice(i, 1);
	        } else {
	            $scope.cuisineIncludes.push(cuisine);
	        }
	        
		}

		$scope.filterRestaurants= function(){
			 $rootScope.$broadcast("filter_event",$scope.cuisineIncludes);		
		}
	});    

	ng.controller("RestaurantListController",function($scope,RestaurantService){  //creating a controller, controller function is next arguement
 																//customerservice is injected, not using quote cz its name of object
 		$scope.restaurants= restaurantsData = []; 

 		(function(){
 			RestaurantService.getRestaurants().then(function(result){
 				$scope.restaurants=restaurantsData=result.data;
 			});
 		})();                      //$scope-services to access heap area for every controller
 		
 		 $scope.sortType     = 'name'; // set the default sort type
  		$scope.sortReverse  = false; 
 		$scope.orderByMe = function(x) {
 			//console.log(x);
    		$scope.sortType = x;
  		}
       
 		$scope.$on("filter_event",function(evt,cuisineIncludes){  //on method handles the event txt has search text
 			var result= [];
 			console.log(cuisineIncludes);
 			restaurantsData.forEach(function(restaurant){

 			console.log(restaurant.cuisine);
 				if (cuisineIncludes.length > 0) {
	            	if ($.inArray(restaurant.cuisine, cuisineIncludes) >=0)
					{
						result.push(restaurant);
					} 

        		}
        		else{
        			result.push(restaurant);
        		}
       			
       		
    		});
 				$scope.restaurants= result;
 			});

 		$scope.range = function(min, max, step) {
		    step = step || 1;
		    var input = [];
		    for (var i = min; i <= max; i += step) {
		        input.push(i);
		    }
		    return input;
		};	
});
	ng.controller("MenuController",function($scope,RestaurantService,$rootScope,$routeParams){

		(function(){ 
			RestaurantService.getRestaurantMenu($routeParams.id).then(function(result){
				$scope.restaurantDetail=result.data;
				$scope.restaurantId=$routeParams.id;
			});
		})(); 
		
		if($routeParams.id == localStorage.getItem('restaurant') && localStorage.getItem('totalPrice')) {
			$scope.totalPrice = parseFloat(localStorage.getItem('totalPrice'));
		} else {
			console.log($scope.restaurantId);
			console.log(localStorage.getItem('restaurant'));
			$scope.totalPrice=0.00;
			localStorage.setItem('totalPrice',$scope.totalPrice);
		}

		if($routeParams.id == localStorage.getItem('restaurant') &&  localStorage.getItem('orderList')) {
			$scope.orderList = JSON.parse(localStorage.getItem('orderList'));
		} else {
			$scope.orderList={};
			localStorage.setItem('orderList',JSON.stringify($scope.orderList));
		}

		$scope.checkout =function(){
			if(Object.keys($scope.orderList).length > 0) {
				localStorage.removeItem('totalPrice');
				localStorage.removeItem('orderList');
				localStorage.setItem('totalPrice',$scope.totalPrice);
				localStorage.setItem('restaurant',$scope.restaurantId);
				localStorage.setItem('orderList',JSON.stringify($scope.orderList));
				window.location.href='#/checkout';
				console.log(Object.keys($scope.orderList).length);
			}
			else {
				alert("Cart is empty.");
			}
		};


		$scope.addItem = function(menuItem){

			if($scope.orderList[menuItem.name])
				$scope.orderList[menuItem.name][0] = $scope.orderList[menuItem.name][0]+1;
			else
				$scope.orderList[menuItem.name]=[1, menuItem.price];
			console.log(typeof $scope.totalPrice);
			$scope.totalPrice= $scope.totalPrice+menuItem.price;
			//console.log($scope.orderList)
			//	console.log($scope.orderList[menuItem.name])

		}

		$scope.deleteItem= function(menuItem){
			$scope.orderList[menuItem.name][0]=$scope.orderList[menuItem.name][0]-1;
			if($scope.orderList[menuItem.name][0]==0) {
				delete $scope.orderList[menuItem.name];
			}
			$scope.totalPrice=$scope.totalPrice-menuItem.price;
		}

		$scope.formatNumber = function(i) {
    		return Math.round(i * 100)/100; 
		}
	});
	ng.controller("finalOrderController",function($scope){
		$scope.totalPrice=localStorage.getItem('totalPrice');
		$scope.restaurantId=localStorage.getItem('restaurant');
		$scope.orderList=localStorage.getItem('orderList');
		$scope.orderList=JSON.parse($scope.orderList);
		console.log($scope.orderList);
		//console.log($scope.orderList[key]);

		$scope.backToMenu = function() {
			window.history.back();
		}

		$scope.clearCart = function() {
			$scope.totalPrice = 0;
			$scope.orderList = {};
			localStorage.setItem('totalPrice',0);
			localStorage.setItem('orderList','{}');
		}	

		$scope.purchase = function() {
			console.log($scope.orderList);
		}

		$scope.formatNumber = function(i) {
    		return Math.round(i * 100)/100; 
		}
	});
})();

