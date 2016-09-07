//百度地图     2015-07-07
//-----------------------------//
//对话框的内容


(function ($) {
    $(document).ready(function () {
        //绑定对应的项
        $(".ControlBox_Table").height($("#Form_Middle").height() - $("#Form_Middle").scrollTop() - 20);
        var arrayMaker = new Array();
        var map = new BMap.Map("dituContent");
        var markerArr = [];//[<%=GetBaiduPointString() %>];
        var InitPointX = "120.171279";
        var InitPointY = "30.286386";
        var _WindowInfoString =
            "<div class=\"map_TitleTips\">"
            + "<div class=\"txtMarquee-top\">"
            + "<div class=\"hd\">实时销售数据"
            + "<a class=\"next\"></a>"
            + "<a class=\"prev\"></a>"
            + "</div>"
            + "<div class=\"bd\">"
            + "<ul class=\"infoList\" id='infoList_OBJECTCODE'>"
            + "[ObjectString]"
            + "</ul>"
            + "</div>"
            + "</div>"
            + "<b>[ServerName]</b><br /><b id='address_OBJECTCODE'>地址:</b>[Address]<br/>[IMAGEPATH]"
        + "</div>";
        function InitMap() {
            //创建地图
            CreateBaiduMap();
            //设置事件
            SetMapEvent();
            //
            BindMapEventClick();
            addMapControl();
            //设置对应的点集
            if (markerArr != "") {
                //标点
                
                addMarker();
            }
        }

        function myFun(result) {
            var cityName = result.name;
            map.setCenter(cityName);
        }
        //初始化地图
        function CreateBaiduMap() {
            var point = new BMap.Point(120.171279, 30.286386);
            map.centerAndZoom(point, 15);

            if (InitPointX == 'undefined' || InitPointX == "" || InitPointX == null) {
                var myCity = new BMap.LocalCity();
                myCity.get(myFun);
            }
            else {
                var point = new BMap.Point(InitPointX, InitPointY);
                map.centerAndZoom(point, 15);
            }
            window.map = map;
        }
        //设置事件
        function SetMapEvent() {
            map.enableDragging();
            map.enableScrollWheelZoom();
            map.enableDoubleClickZoom();
            map.enableKeyboard();
        }
        //添加事件
        function BindMapEventClick() {
            var gc = new BMap.Geocoder();
            map.addEventListener("click", function (e) {
            });
        }

        function addMapControl() {

            var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
            map.addControl(ctrl_nav);

            var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
            map.addControl(ctrl_ove);

            var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
            map.addControl(ctrl_sca);
        }

        function addMarker() {
            for (var i = 0; i < markerArr.length; i++) {
                var json = markerArr[i];
                json = eval('(' + json + ')');
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var point = new BMap.Point(p0, p1);
                var iconImg = createIcon(json.icon);
                var marker = new BMap.Marker(point, { icon: iconImg });
                //var iw = createInfoWindow(i);
                var label = new BMap.Label(json.title.replace("服务区","").replace("加油站",""), { "offset": new BMap.Size(json.icon.lb - json.icon.x + 10, -20) });
                marker.setLabel(label);
                map.addOverlay(marker);
                label.setStyle({
                    borderColor: "#808080",
                    color: "#333",
                    cursor: "pointer"
                });
                arrayMaker.push(marker);
                (function () {
                    var index = i;
                    var _iw = null;
                    //_iw = createInfoWindow(index)
                    var _marker = marker;
                    _marker.z.title = markerArr[i];

                    _marker.addEventListener("click", function () {
                        _iw = createInfoWindow(this.z.title);
                        this.openInfoWindow(_iw);
                        RetSetState();
                    });
                    try {
                        _iw.addEventListener("open", function () {
                            _marker.getLabel().hide();
                        })
                        _iw.addEventListener("close", function () {
                            _marker.getLabel().show();
                        })
                    }
                    catch (e)
                    { }

                    label.addEventListener("click", function () {
                        _marker.openInfoWindow(_iw);
                    })
                    if (!!json.isOpen) {
                        label.hide();
                        _marker.openInfoWindow(_iw);
                    }
                })()
            }
        }

        

        function createInfoWindow(i) {
            RealEstate.Page.ShowMask('正在查询...');
            var json = i;// markerArr[i];
            json = eval('(' + json + ')');
            //获得对应的异步数据
            var WindowInfoString = _WindowInfoString.replace(/OBJECTCODE/g, (json.objectcode == "" ? "" : json.objectcode));

            var objstring = getobjectDataAsyn(json.objectcode);
            var WindowInfoString = _WindowInfoString.replace("[ObjectString]", objstring == "" ? "无销售数据" : objstring);

            WindowInfoString = WindowInfoString.replace("[ServerName]", json.title).replace("[Address]", json.content);
            //异步加载销售数据
            
            //异步加载图片信息
            objstring = getimageDataAsyn(json.objectcode);
            WindowInfoString = WindowInfoString.replace("[IMAGEPATH]", objstring == "" ? "无图片" : objstring);
            var iw = new BMap.InfoWindow(WindowInfoString);

            
            return iw;
        }

        function createIcon(json) {
            var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(-23, -json.t), infoWindowOffset: new BMap.Size(json.lb + 5, 1), offset: new BMap.Size(json.x, json.h) })
            return icon;
        }
        //var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(-json.l, -json.t), infoWindowOffset: new BMap.Size(json.lb + 5, 1), offset: new BMap.Size(json.x, json.h) });

        InitMap();

        //设置按钮
        $("#ServerPartTree  a").each(function () {
            $(this).click(function () {
             
                var p1 = $(this).attr("objtag").split("|")[0];
                var p2 = $(this).attr("objtag").split("|")[1];
                if (p1 == "")
                    return;
                RetSetMapPoint(p1, p2);
            });
            //标点
            var param = "action_type=getPointPos&action_data=" + $(this).attr("code");
            QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        ;
                    }
                    else {
                        markerArr = [rs];
                        addMarker();
                    }
                } catch (e) {
                    alert(e.message);
                }
            });


        })


        //绑定事件
        function RetSetMapPoint(pointX, pointY) {
            //设置中心点
            var point = new BMap.Point(pointX, pointY);
            map.centerAndZoom(point, 10);
            //重新设置
            for (var i = 0 ; i < arrayMaker.length; i++) {
                //array.splice(start,delCount)
                if (arrayMaker[i].point.lat == pointY && arrayMaker[i].point.lng == pointX)
                {
                    map.removeOverlay(arrayMaker[i]);
                    arrayMaker[i].z.hj.imageUrl = "http://api0.map.bdimg.com/images/marker_red_sprite.png";
                    arrayMaker[i].z.hj.imageOffset.height = 0;
                    arrayMaker[i].z.hj.imageOffset.width = 0;
                        json = eval('(' + arrayMaker[i].z.title+')');
                        var label = new BMap.Label(json.title.replace("服务区", "").replace("加油站", ""), { "offset": new BMap.Size(13, -20) });
                        arrayMaker[i].setLabel(label);
                        label.setStyle({
                            borderColor: "#808080",
                            color: "#333",
                            cursor: "pointer"
                        });
                    map.addOverlay(arrayMaker[i]);
                    break;
                }
            }
            //重置内容
            for (var i = 0 ; i < arrayMaker.length; i++)
            {
                if (arrayMaker[i].point.lat == pointY && arrayMaker[i].point.lng == pointX) {
                    ;
                }
                else {
                    //节点--\
                    if (arrayMaker[i].z.hj.imageOffset.height == 0)
                    {
                        map.removeOverlay(arrayMaker[i]);
                        arrayMaker[i].z.hj.imageUrl = "http://app.baidu.com/map/images/us_mk_icon.png";
                        arrayMaker[i].z.hj.imageOffset.height = -21;
                        arrayMaker[i].z.hj.imageOffset.width = -23;
                        json = eval('(' + arrayMaker[i].z.title + ')');
                        var label = new BMap.Label(json.title.replace("服务区", "").replace("加油站", ""), { "offset": new BMap.Size(13, -20) });
                        arrayMaker[i].setLabel(label);
                        label.setStyle({
                            borderColor: "#808080",
                            color: "#333",
                            cursor: "pointer"
                        });
                        map.addOverlay(arrayMaker[i]);
                    }

                }
            }

        }

        //获得对应的销售纪录
        function getobjectDataAsyn(ecode) {
           
            var retString = "";
            var data = [];
            var param = "action_type=getSellDataObject&action_data=" + ecode;
            QRWL.Core.getAjax('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        alert(rs);
                    }
                    else {
                        //去除掉
                        var json = json_parse(rs);
                        for (var i = 0; i < json.SellDataObject.length; i++) {
                            retString += "<li><span class=\"date\">" + json.SellDataObject[i].selltime + "</span><a href=\"#\" target=\"_blank\">" + json.SellDataObject[i].name + "," + json.SellDataObject[i].commoditycount + "*" + json.SellDataObject[i].price + "=" + json.SellDataObject[i].totalprice + "</a></li>";
                        }
                    }
                } catch (e) {
                    alert(e.message);
                }
                RealEstate.Page.HideMask();
            });
            return retString;
        }
        function getimageDataAsyn(ecode) {
            var retString = "";
            var data = [];
            var param = "action_type=getImageDataObject&action_data=" + ecode;
            QRWL.Core.getAjax('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        alert(rs);
                    }
                    else {
                        var json = json_parse(rs);
                        for (var i = 0; i < json.ImageObject.length; i++) {
                            retString = "<IMG onclick=\"javascript:openMessage('" + json.ImageObject[i].code + "');\" src=\"" + json.ImageObject[i].path + "\" style=\"height:150px; width:150px;\"></IMG>";
                            ;
                        }
                        //$("#imgload_" + ecode).insertAfter(retString);
                        //$("#imgload_" + ecode).remove();
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
            return retString;
        }


        
        
    });
}(jQuery))

function RetSetState() {
    try {
        jQuery(".txtMarquee-top").slide({ mainCell: ".bd ul", autoPlay: true, effect: "topMarquee", vis: 5, interTime: 50 });
    }
    catch (e) {

    }
}

function openMessage(ecode) {
    Dialog.OpenPopDialog("服务区信息", "/HighWay/Modules/MapShow/ServerPart.aspx?SERVERPART_ID=" + ecode + "&PopDialogName=SERVERPARTList", 1000, 1000, true, false, true, true);
    return false;
}




             
                     
