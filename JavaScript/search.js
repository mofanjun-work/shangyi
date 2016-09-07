/*
	module_name:search
	private:
		_trim去掉左右边的空格
		_spliteStrByBlank:将字符串按空格分割
		_filterIllegalChar：去掉非法字符
		_ansyPost:异步的POST
		_ansyGET:异步的GET
		_filterUserInput:过滤用户输入,获取合法字串
	public:
		getSearchServerPart:获取用户检测的服务站
*/
var search = (function(){
	//
	var _trim = function(str){
		var destStr = $.trim(str);
		return destStr;
	};

	var _spliteStrByBlank =function(str){
		var destStr = str.split(/\s+/);
		return destStr;
	};

	var _filterIllegalChar = function(str){
		//非法字符
		var destStr = str.replace(/[@#\$%\^&\*]+/g,"");
		//TODO:非法字符--英文[暂不支持英文,所以视为非法字符]
		destStr = destStr.replace(/[a-z]+/gi,'');
		return destStr;
	};

	var _filterUserInput = function(inputStr){
		var legalStr = "";
		var destStr = _trim(inputStr);
		var stringArray = _spliteStrByBlank(destStr);
		var i;
		for(i = 0;i< stringArray.length;i++){
			var str = _filterIllegalChar(stringArray[i]);
			if (str !== "") {
				legalStr = str;
				break;
			}
		}

		return legalStr;
	}

	//
	var _ansyPost = function(url,postData,callback){
		var ansyObj = new XMLHttpRequest();
		ansyObj.open("POST",url,true);
		ansyObj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		ansyObj.onreadystatechange = function(){
			if (ansyObj.readyState == 4 && ansyObj.status == 200 ) {
				//默认忽略xml格式
				callback(ansyObj.responseText);
			}
		};
		ansyObj.send(postData);
	};

	var _ansyGET = function(url,param,callback){
		var ansyObj = new XMLHttpRequest();
		//TODO:对url和参数进行合法验证
		var get_url = url + '?' + param;
		ansyObj.open("GET",url,true);
		ansyObj.onreadystatechange = function(){
			if (ansyObj.readyState == 4 && ansyObj.status == 200 ) {
				//默认忽略xml格式
				callback(ansyObj.responseText);
			}
		};
		ansyObj.send();
	};

	var getSearchServerPart = function(inputData,callback){
		var legalStr = _filterUserInput(inputData);
		//用户输入的全是非法字符
		if (legalStr.length === 0) {
			callback();
		}else{
			var param = "action_type=getServerPartByName&action_data=" + legalStr;
			var get_url = '/HighWay/Handler/handler_ajax.ashx';
			_ansyPost(get_url,param,callback);
		}

	};

	var getServerPosByName = function(inputData,callback){
		var legalStr = _filterUserInput(inputData);
		//用户输入的全是非法字符
		if (legalStr.length === 0) {
			callback();
		}else{
			var param = "action_type=getPointPosByServerPartName&action_data=" + legalStr;
			var get_url = '/HighWay/Handler/handler_ajax.ashx';
			_ansyPost(get_url,param,callback);
		}
	}

	return {
		getSearchServerPart:getSearchServerPart,
		getServerPosByName:getServerPosByName
	}
}());