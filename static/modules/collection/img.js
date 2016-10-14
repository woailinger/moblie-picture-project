define(function (require,exports,module){
	//引用   model中的 模型
	var ImgModule = require('modules/model/img');

	//定义集合类
	var ImgCollection = Backbone.Collection.extend({
		model : ImgModule,
		//添加图片的id
		imgId :0,
		// 现在的需求是要在将data目录下的接口数据请求下来
		/**
		 * 为集合异步请求数据
		 * @fn 		表示请求成功回调函数
		 */
		 fetchData : function(){
		 	//这里的this 指的是集合实例化对象
		 	var me = this
		 	//发送异步请求
		 	$.get('data/imageList.json',function (res){
		 		//异步请求数据  这个里里面的this  是 window  所以要备份
		 		if(res && res.errno ===0){
		 			//对数据进行乱序处理
		 			res.data.sort(function(){
		 				return Math.random() > .5 ? 1 : -1 ;
		 			})
		 			//图片要根据id进行大图展示  所以要给每个成员加上id属性
		 			//遍历data，并且加上id
		 			res.data.map(function (obj){
		 				obj.id = me.imgId++;
		 			})
		 			me.add(res.data);
		 		}
		 		
		 	})
		 }
	})

	//将  集合类 向外暴露给app.js
	module.exports = ImgCollection;
})