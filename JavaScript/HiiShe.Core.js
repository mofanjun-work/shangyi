var QRWL = {

	Version: "1.0",
	//注册样式文件
	RegisterStyleSheet: function (hrefPath)
	{
		document.write('<link href="' + hrefPath + ' " rel="stylesheet" type="text/css" />');
	},
	//注册脚本文件
	RegisterJavaScript: function (srcPath)
	{
		document.write('<script src="' + srcPath + ' " type="text/javascript"></script>');
	},
	//注册命名空间
	RegisterNamespace: function (namespacePath)
	{
		var rootObject = window;
		var namespaceParts = namespacePath.split('.');
		for (var i = 0; i < namespaceParts.length; i++)
		{
			var currentPart = namespaceParts[i];
			if (!rootObject[currentPart])
				rootObject[currentPart] = new Object();
			rootObject = rootObject[currentPart];
		}
	},
	//停止事件执行
	StopEvent: function (e)
	{
		if (e && e.stopPropagation)
			e.stopPropagation();
		else
			window.event.cancelBubble = true;
		if (e && e.preventDefault)
			e.preventDefault();
		else
			window.event.returnValue = false;
		return false; 
	},
	//注册执行事件
	RegisterEvent: function (targetElement, eventType, eventHandler)
	{
		if (!!RealEstate.Browser.IE)
			targetElement.attachEvent("on" + eventType, eventHandler);
		else
			targetElement.addEventListener(eventType, eventHandler, false);
	},
	//注销事件
	UnRegisterEvent: function (targetElement, eventType, eventHandler)
	{
		if (!!RealEstate.Browser.IE)
			targetElement.detachEvent("on" + eventType, eventHandler);
		else
			targetElement.removeEventListener(eventType, eventHandler, false);
	},
	//浏览器信息
	Browser: (function ()
	{
		var SysBrowser = {};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		(s = ua.match(/msie ([\d.]+)/)) ? SysBrowser.ie = s[1] :
        (s = ua.match(/(trident.*rv:)([\w.]+)/)) ? SysBrowser.newie = s[2] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? SysBrowser.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? SysBrowser.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? SysBrowser.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? SysBrowser.safari = s[1] : 0;
		return {
			NewIE: SysBrowser.newie,
			IE: SysBrowser.ie,
			Opera: SysBrowser.opera,
			Chrome: SysBrowser.chrome,
			Firefox:SysBrowser.firefox,
			Safari: SysBrowser.safari
		}
	})()
};
QRWL.Core = {
    getAjax:function(url, parm, callBack)
    {
        $.ajax({
            type: 'post',
            dataType: "text",
            url: url,
            data: parm,
            cache: false,
            async: false,
            success: function (msg) {
                callBack(msg);
            }
        });
    },
    getAjaxAsync: function (url, parm, callBack) {
        $.ajax({
            type: 'post',
            dataType: "text",
            url: url,
            data: parm,
            cache: false,
            async: true,
            success: function (msg) {
                callBack(msg);
            }
        });
    },

    windowload:function(){
        rePage();
    },
    GetValue:function(FieldValue)
    {
        var StrReturn;
        var paramValue = FieldValue;
        var isFound = false;
        try {
            if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
                arrSource = this.location.search.substring(1, this.location.search.length).split("&");
                var i = 0;
                while (i < arrSource.length && !isFound) {
                    if (arrSource[i].indexOf("=") > 0) {
                        if (arrSource[i].split("=")[0].toLowerCase() == paramValue.toLowerCase()) {
                            StrReturn = arrSource[i].split("=")[1];
                            isFound = true;
                        }
                    }
                    i++;
                }
                if (isFound)
                    return StrReturn;
                else
                    return "";
            }
        }
        catch (e)
        {
            return "";
        }
    }
   
};

