// 列表页的视图模块文件
define(function (require, exports, module) {
	require('modules/list/list.css')
	// 定义列表页视图
	var List = Backbone.View.extend({
		//绑定事件
		events : {
			'click .search span' : 'showSearchView',
			'click .nav li' : 'showTypeView',
			'click .go-back' : 'goTop',
			'click .image-container img' : 'textId'
		},
		//添加模板
		tpl : _.template('<a href="#layer/<%=id%>"><img src="<%=url%>" style="<%=style%>" data-id=<%=id%> alt="" /></a>'),
		//左边容器的高度
		leftHeight : 0,
		//右边容器的高度
		rightHeight : 0,
		initialize : function (){

			//创建页面   先初始化数据
			//一  获取数据
			this.getData();
			//二  获取荣容器元素
			this.initDom();
			//监听 add事件  每添加一个集合模型对象 ，就要渲染到页面中去
			//用 listento方法
			this.listenTo(this.collection,'add',function (model,collection){
				//调用render 方法  渲染页面
				this.render(model);
			});
			//备份this
			var me = this;
			//监听窗口的滚动事件
			$(window).on('scroll',function(){
				//获取 body的高度  ，窗口的高度  ，scrollTop的高度
				var h = $('body').height() - $(window).height() - $(window).scrollTop() - 200 < 0;
				if(h){
					me.getData();
				}
				// 当滚动条顶部距离大于300时候将返回顶部按钮显示
				if ($(window).scrollTop() > 300) {
					me.showGoBack()
				} else {
					me.hideGoBack()
				}
			})
		},
		showGoBack : function (){
			this.$el.find('.go-back').show();
		},
		hideGoBack: function () {
			this.$el.find('.go-back').hide()
		},
		goTop : function(){
			window.scrollTo(0,0);
		},
		//获取数据的方法
		getData: function () {
			this.collection.fetchData();
		},
			//初始化dom元素
		initDom : function(){
				//获取两个容器 一左一右
			this.leftContainer = this.$el.find('.left-container');
			this.rightContainer = this.$el.find('.right-container');
		},
		render: function (model) {
			//获取数据
			var data = {
				id : model.get('id'),
				url : model.get('url'),
				style : 'width' + model.get('viewWidth') + 'px;height:' + model.get('viewHeight') + 'px;'
			}
			//获取  模板方法
			var tpl = this.tpl;
			//格式化字符串
			var html = tpl(data);
			// 将字符串渲染页面中
			// 如果左边容器高度不大于右边容器高度，此时要向左边添加，否则想右边添加
			if(this.leftHeight <= this.rightHeight ){
				this.renderLeft(model,html);
			}else{
				this.renderRight(model,html);
			}
		},
		/**
		 * 渲染左边容器
		 * @model 	模型实例化对象
		 * @html 	视图字符串
		 */ 
		renderLeft: function(model,html){
			this.leftContainer.append(html);
			//然后记录下已经加载好的 图片高度
			this.leftHeight += model.get('viewHeight') + 6;
		},
		/**
		 * 渲染右边容器
		 * @model 	模型实例化对象
		 * @html 	视图字符串
		 */ 
		renderRight : function(model,html){
			this.rightContainer.append(html);
			//记录右边已加载的图片的高度
			this.rightHeight += model.get('viewHeight') + 6;
		},
		// 获取搜索框内的val值
		getSearchValue: function () {
			return this.$el.find('.search input').val()
		},
		/**
		 * 判断value值是否合法
		 * @return 	是一个boolean表示是否合法，true：合法，false不合法
		 */ 
		checkValue: function (value) {
			// 当结果只有空白符是不合法啊的
			if (/^\s*$/.test(value)) {
				alert('请输入搜索词');
				return false
			}
			return true;
		},
		/**
		 * 根据value值过滤集合
		 * @value 		过滤字符串
		 * @return 		数组
		 */ 
		collectionFilterByKey: function (value,key) {
			var mykey = key || 'title';
			var result = this.collection.filter(function (model) {
				if(mykey === 'type'){
					return model.get(mykey) == value;
				}
				// 返回过滤条件
				return model.get(mykey).indexOf(value) > -1;
			})
			// 将结果返回
			return result;
		},
		/**
		 * 更新视图
		 * @arr 	模型实例化数组
		 */
		resetView: function (arr) {
			var me = this;
			// 清空视图
			this.clearView();
			// 更新视图了，
			arr.forEach(function (model) {
				// 渲染每一个模型实例化对象
				me.render(model)
			})
		},
		/**
		 * 清空原视图
		 **/
		clearView: function () {
			// 清空左视图内容，右视图内容，左容器高度，右容器高度
			this.leftContainer.html('');
			this.rightContainer.html('');
			this.leftHeight = 0;
			this.rightHeight = 0;
		},
		/**
		 * 根据搜索内容渲染页面
		 */
		showSearchView: function () {
			// 获取input的value值
			var value = this.getSearchValue();
			// 判断value值是否合法
			if (!this.checkValue(value)) {
				return ;
			};
			// 过滤字符的首位空白符
			value = value.replace(/^\s+|\s+$/g, '')
			// 根据value值进行集合过滤
			var result = this.collectionFilterByKey(value);
			console.log(result);
			// 根据result结果重新渲染视图
			this.resetView(result);
		},
		//获取元素中的 data-id属性
		getDomId : function(dom){
			return $(dom).attr('data-id');	
		},
		/**
		*获取元素的id  并且 重新渲染
		*
		*/
		showTypeView : function(e){
			this.$el.find(e.target).addClass('cur').siblings().removeClass('cur');
			//获得 id
			var id = this.getDomId(e.target);
			//然后通过id  获取模型中的实例化对象
			var  result = this.collectionFilterByKey(id,'type');
			console.log(id)
			// console.log(result);
			//最后根据 result渲染视图
			this.resetView(result);
		},
		textId : function(e){
			this.targetId=this.getDomId(e.target);
			console.log(this.targetId)
			if(this.targetId == this.getDomId(e.target)){
				this.collection.trigger("reclick",this.targetId);
			}
		},
		targetId:""
	})
	module.exports = List;

})