// 定义自定义覆盖物的构造函数  
function ScrollTextOverlay(sellData){ 
	this.displayText = sellData;
}  
// 继承API的BMap.Overlay  
ScrollTextOverlay.prototype = new BMap.Overlay(); 

// 实现初始化方法 
ScrollTextOverlay.prototype.initialize = function(map){  
	// 保存map对象实例  
	 this._map = map;      
	 map.getPanes().markerPane.innerHTML = g_html_fragment.scroll;
	 var div = document.getElementById("pop"); 
	 div.style.position = "absolute";  
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
	 return div;  
}

/*
	@重绘通知函数
*/  
ScrollTextOverlay.prototype.draw = function(a){
	var c = a;  
	// this.setPosition(this.mapPoint);
}

/*
	切换气泡:1.hide->2.setPosition->3.show
*/
ScrollTextOverlay.prototype.show = function(){  
	this._div.style.display = 'block';
	this._div.classList.add('pop_show');
} 

 
ScrollTextOverlay.prototype.hide = function(){ 
	this._scroll.stop();
	this._div.classList.add('pop_hide');
}


ScrollTextOverlay.prototype.setPosition = function(mapPoint){
	 // 根据地理坐标转换为像素坐标，并设置给容器 
	 var position = this._map.pointToOverlayPixel(mapPoint);
	 //TODO:精确计算气泡框位置
	 this._length = 0;
	 this._div.style.left = position.x - this._length / 2 + "px";  
	 this._div.style.top = position.y - this._length / 2 + "px";
	 this.show();  
}