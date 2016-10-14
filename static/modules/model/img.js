//定义img图片模型模块
define(function (require,exports,module){
	//获取页面的宽度
	var w = ($(window).width() - 6 * 3) / 2;

	//定义模型
	var ImgModel = Backbone.Model.extend({
		//构造函数
		initialize : function(){
			this.on('add',function (model){
				var h = model.get('height') / model.get('width') * w;
				//为模型添加  viewHeight  和  viewWidth
				model.set({
					viewWidth : w,
					viewHeight : h
				})
			})
		}
	})

	//将模型座位接口暴露给  collection
	module.exports = ImgModel;
})

