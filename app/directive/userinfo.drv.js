/** 
* @author: anan@adobe.com
* @version: 1.0
* list view Directive and delivery info directive
*/
(function () {	
	angular.module("custom_directive",[]);

	angular.module("custom_directive").directive("deliveryInfo",function(){
		return {
			retrict: 'E',
			templateUrl: 'app/template/deliveryInfo.html',
			scope: {
				username: '=' ,
				delivery_address: '='
				 
			}
		};
	});
	


})();