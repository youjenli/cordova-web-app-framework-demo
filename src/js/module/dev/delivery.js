/**
 * 
 */
define(['backbone',
        "view/dev/carInfo", 'module/dev/procedure/carInfo',
        'view/dev/departure', 'module/dev/procedure/departure',
        'view/dev/deliveryMenu', 'view/dev/deliveryPanel',
		'module/dev/deliveryMenu'], function(
        		Backbone,
        		CarInfoView, CarInfoProcedure,
       		 	DepartureView, DepartureProcedure,
       		 	DeliveryMenuView, DeliveryPanelView,
				DeliveryMenuRouter){
        
	var DeliveryRouter = Backbone.Router.extend({
		initialize:function(){
			var self = this
			Backbone.history.start();
			console.log("Router of delivery has been initialized.");
						
			var carInfoProcedure = new CarInfoProcedure(),
				departureProcedure = new DepartureProcedure(),
				deliveryMenuProcedure = new DeliveryMenuProcedure(),
				carInfoView = new CarInfoView({model:carInfoProcedure}),
				departureView = new DepartureView({model:departureProcedure}),
				deliveryMenuView = new DeliveryMenuView();
				new DeliveryPanelView();
			
			self.set({
				carInfoView:carInfoView,
				departureView:departureView,
				deliveryMenuView:deliveryMenuView,
				deliveryPanelView:deliveryPanelView
			});
			
			/**
			 * 開始執行配送模組的流程
			 * */
			/**
			 * 進入配送模組時跳轉至車次登入畫面, 
			 * 然後等待使用者操作 (輸入車次與物流地點或離開)
			 */
			self.navigate("view/dev/carInfo", {trigger:true});
				
			/**
			 * 若使用者在車次登入頁面按下離開, 就會離開配送模組
			*/
			self.listenTo(carInfoView, "quit", function(){
				self.trigger("quit");
			});
				
			/**
			*	當使用者在配送功能選單按下離開時, 會觸發這個 Router 的 quit 事件讓應用程式回到主功能頁面
			*/
			self.listenTo(deliveryMenuView, "quit", function(){
				self.trigger("quit");
			});
			
			/**
			 *	若使用者確認輸入車次與物流地點, 系統會顯示出車相關資訊, 然後等待使用者的後續操作 (確認出車或僅登入)
			 */
			self.listenTo(carInfoProcedure, "confirmed", function(){
				//顯示出車相關資訊
				self.navigate("view/dev/departure", {trigger:true});
			});

			/*
			*	當配送模組第一次登入或查看時, 初始化管理配送功能頁面的 DeliveryMenuRouter
			*/
			departureProcedure.once("departure.confirmed departure.loginOnly", function(){
				new DeliveryMenuRouter();
			});
			
			/**
			 * 當使用者出車確認或僅登入時, 系統會顯示配送功能選單畫面, 等待使用者後續操作
			 */
			self.listenTo(departureProcedure, "departure.confirmed departure.loginOnly", function(){
				console.log("departure confirmed or login.");
				
				//跳轉至配送功能主選單, 等待使用者操作
				self.navigate("view/dev/deliveryMenu", {trigger:true});
			});
			
			self.navigate("view/dev/carInfo", {trigger:true});
		},//配送模組初始化結束
		routes:{
			"view/dev/:page":"_direct"
		},
		_direct:function(page){
			console.log("Routing path : view/dev/" + path);
			var self = this;
			var view = selt.get(path + "View");
			if (view) {
				view.render();
				//TODO 要加入檢查換頁是否成功的機制
			} else {
				console.log("Routing path : view/dev/" + path + " could not be found in router of delivery.");
				//TODO exception handling
			}
		}
	});
	
	return DeliveryRouter;
});