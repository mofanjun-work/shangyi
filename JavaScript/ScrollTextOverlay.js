// 定义自定义覆盖物的构造函数  
function ScrollTextOverlay(){ 
	this.pop_map_position = null;//当前显示的经度纬度数据
}  
// 继承API的BMap.Overlay  
ScrollTextOverlay.prototype = new BMap.Overlay(); 

// 实现初始化方法 
ScrollTextOverlay.prototype.initialize = function(map){  
	// 保存map对象实例  
	 this._map = map;      
	 map.getPanes().markerPane.innerHTML = g_html_fragment.scroll;
	 var div = document.getElementById("pop");  
	 //
	 this._scroll =  new Scroll(this.displayText);
	 var that = this
	 document.getElementById('pop').addEventListener('animationend', function(event){
    	if (event.animationName === 'slowShow') {
	    	//泡泡框显示回调
	        that._scroll.run();
	        that._div.classList.remove('pop_show');
	    }else if(event.animationName === 'slowHide'){
	    	//泡泡框消失回调
	    	that._div.style.display = 'none';
			that._div.classList.remove('pop_hide');
	    	
	    }
	},false);    
	// 保存div实例  
	this._div = div;
	this.pop_width = this._div.offsetWidth;
	this.pop_height = this._div.offsetHeight;
	this.pop_arrowHeight = this._div.lastChild.offsetHeight/2;     
	return div;  
}

/*
	主动绘制和被动绘制
*/
ScrollTextOverlay.prototype.switchDraw =function(point){
	this.pop_map_position = point;
	//
	this.stop();
	this.setPosition(this.pop_map_position);
	this.show();
}

ScrollTextOverlay.prototype.draw = function(){
	if (!this.pop_map_position) {
		return;
	}
	//comment:当地放大地图时,你的自定义覆盖物display会变成none
	this.stop();
	this.setPosition(this.pop_map_position);
	this.show();  
}

/*
	切换气泡:1.stop->2.setPosition->3.show
*/
ScrollTextOverlay.prototype.show = function(){  
	this._div.style.display = 'block';
	this._div.classList.add('pop_show');
} 

// ScrollTextOverlay.prototype.hide = function(){ 
// 	this._scroll.stop();
// 	this._div.classList.remove()
// 	this._div.classList.add('pop_hide');
// }


ScrollTextOverlay.prototype.stop = function(){
	this._div.style.display = 'none';
	this._scroll.stop();
	//@comment:remove不存在的类名 不会报错
	this._div.classList.remove('pop_show');
	this._div.classList.remove('pop_hide');
}


ScrollTextOverlay.prototype.setPosition = function(mapPoint){
	// 根据地理坐标转换为像素坐标，并设置给容器 
	var position = this._map.pointToOverlayPixel(mapPoint);
	this._div.style.left = position.x - this.pop_width / 2 + "px";  
	this._div.style.top = position.y - this.pop_height - this.pop_arrowHeight  + "px";  
}

//@comment 都是6位小数所以不显示 所以不toFixed()修改精度
ScrollTextOverlay.prototype.isDisplay = function(point){
	return (this.pop_map_position.lat == point.lat && this.pop_map_position.lng == point.lng) ? true:false;
}

//@comment 设置显示文字
ScrollTextOverlay.prototype.setText = function(text){
	Scroll.prototype.setContent(text);
}

