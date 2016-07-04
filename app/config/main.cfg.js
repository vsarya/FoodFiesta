/**
* @author: anan@adobe.cpm, varya@adobe.com, shsinha@adobe.com
*version :1.0
* Main Configuration file for Routing and handling localStorage
*
*/

(function () {
	angular.module("main_module",["ngRoute","ngCookies","restaurant_module","service_module","custom_directive"]);

	angular.module("main_module").config(function($routeProvider,$locationProvider){
		$routeProvider  
		.when("/",{    
			templateUrl: 'app/page/restaurants.html'
		})
		.when("/customer",{
			templateUrl: 'app/page/customer.html',
			
		})
		.when("/checkout",{
			templateUrl: 'app/page/checkout.html',
			
		})
		.when("/menu/:id",{  
			templateUrl: 'app/page/menuOfRestaurant.html',
		 
		})
		.otherwise({
			templateUrl:'app/page/customer.html'
		})
	}).run(check);
	function check($location){		
		
		if(!(localStorage.getItem('username') && localStorage.getItem('delivery_address'))) {
			$location.path("/customer");
		}
	}
})();
