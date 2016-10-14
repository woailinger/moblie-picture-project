define(function (require,exports,module){

	// 临时引入model
	// require('modules/collection/img')
	//正式引入 集合  模块
	var  ImgCollection = require('modules/collection/img');

	// 实例化图片集合类
	var imgCollection = new ImgCollection();
	//创建列表页视图类
	var List = require('modules/list/list');
	//创建大图页视图类
	var Layer = require('modules/layer/layer');
	//实例化列表页视图
	var list = new List({
		el: $('#app'),
		//绑定集合实例化对象
		collection : imgCollection
	});
	//实例化 大图页 视图
	var layer = new Layer({
		el: $('#app'),
		collection : imgCollection
	});
	//定义路由
	var Router = Backbone.Router.extend({
		routes: {
			'layer/:id' : 'showLayer',
			'*other' : 'showList'
		},
		//下面函数的 参数  id  来自于 上面路由规则中的 动态  id  值
		showLayer : function(id){
			//展示大图页,隐藏列表页
				// $('#app .list').hide();
			// $('#app .layer').show();
			// $('#app .list .image-container').css('display','none');
			// $('#app .layer').css('display','block')
			$('#app .layer').show();
			layer.render(id);
		},
		showList : function(){
			//展示列表页,隐藏大图页
			// 	$('#app .layer').hide();
			// $('#app .list').show();
			// $('#app .list').css('display','block')
			// $('#app .layer').css('display','none')
			$('#app .layer').hide();
		}
	})
	//实例化路由
	var router = new Router();
	imgCollection.on("reclick",function(id){
		router.showLayer(id);
	})
	// 将启动的业务逻辑放在接口中，这样在外部引入这个模块的时候可以控制项目是否启动
	module.exports = function () {
		//启动路由
		Backbone.history.start();
	}
})