// 大图页的视图模块文件
define(function (require, exports, module) {
	//引入大图页  样式
	require('modules/layer/layer.css');
	//得到手机端的窗口高度
	var h = $(window).height();
	// 定义大图页的视图
	var Layer = Backbone.View.extend({
		imgId:0,
		//添加事件
		events : {
			'tap .layer-container img' : 'toggleHeader',
			'swipeLeft .layer-container img' : 'showNextImage',
			'swipeRight .layer-container img' : 'showPreImage',
			'tap .layer .arrow-btn' : 'goBackNew'
		},
		goBackNew : function(){

			// this.$el.find('.list').show();
			// this.$el.find('.layer').hide();


			this.$el.find('.list').css('display','block');
			this.$el.find('.layer').css('display','none');
		},
		/**
		 *向右滑，显示上一张照片
		 */
		showPreImage : function(){
			var model = this.collection.get(--this.imgId);
			//同样 要判断 model是否存在
			if(model){
				this.changeView(model);
			}else{
				alert('已经是第一张了');
				this.imgId++;
			}
		},
		/**
		 *更换图片的方法
		 *@model 模型实例化对象
		 */
		changeView : function(model){
			//更改img的   src   和title  达到更换图片的作用
			var url = model.get('url');
			this.$el.find('.layer-container img').attr('src',url);
			var title = model.get('title');
			this.$el.find('.layer .header h1').html(title);
		},
		/**
		 *向左滑，显示上一张照片
		 */
		showNextImage : function(){
			// this.imgId++;
			//根据id  获取 模型实例化对象
			var model = this.collection.get(++this.imgId);
			//当滑倒最后一张的时候  此时得到的model为 undefine
			//所以要判断model是否存在，如果存在则渲染
			if(model){
				this.changeView(model);
			}else{
				//如果model已经不存在了，那么要提示 已经是最后一张了
				alert('已经是最后一张了');
				//并且要--一次   因为上面执行了++
				this.imgId--;
			}

		},
		toggleHeader : function(){
			this.$el.find('.layer .header').toggleClass('hide')
		},
		//得到模板字符串
		tpl : _.template($('#tpl_layer').text()),
		render: function (id) {
			//根据模型的id  获取模型
			var data = this.collection.get(id);
			if(!data){
				location.hash = '#';
				return;
			}
			//保存一下 模型的id  当左右滑动的时候要用到
			 this.imgId = data.get('id');
			//因为data 是一个模型实例化对象  所以要进行处理！
			var dealData = {
				url : data.get('url'),
				title : data.get('title'),
				// 添加line-height 让图片垂直居中
				style: 'line-height: ' + h + 'px'
			}
			//获取模板
			var tpl = this.tpl;
			//格式化模板
			var html = tpl(dealData);
			//渲染到  容器中  （.layer）
			this.$el.find('.layer').html(html);
		}
	})

	module.exports = Layer;
})