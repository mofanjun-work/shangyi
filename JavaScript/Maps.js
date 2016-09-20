//百度地图     2015-07-07
//-----------------------------//
//对话框的内容


(function ($) {
    $(document).ready(function () {
        var arr = 0;

        var ServerPath = "http://192.168.10.107:6060";
        //隐藏更多
        $("#serverpart_expand").css("display", "none");

        var icon_name = ["fa-chevron-circle-up", "fa-chevron-circle-down"];
        var expand_div = "<li><span></span><i class=\"fa [ICON_NAME]\"></i><span>[CONTENT_NAME]</span></li>";
        var img_div_object = "<img style='height:30px; width:30px;' src='/HighWay/Resources/v1_0/Style/Images/loader3.gif' />";
        var subnavstring_template = "<li data-code='[NAV_CODE]'><a class=\"color_blue\" title=\"[NAV_DESC]\">[NAV_NAME]</a></li>";
        var serverpartcontent_template = "<li data-pointx='[POINTX]' data-pointy='[POINTY]' data-code='[CODE]' data-imgpath='[imagepath]'><div class=\"entry_wrap\"><p class=\"title_serverpart\"><span class=\"fa fa-cutlery font_color\"></span>&nbsp;&nbsp;[SERVERPART_NAME]</p><p>所在高速公路：[EXPRESSWAY_NAME]</p><p>地址：[SERVERPART_ADDRESS]</p></div></li>";
        var mainnavstring_Template = "<li class=\"mainRegion\" code-data='[NAV_CODE]' point-data='[POINTDATA]' ><a href=\"#\" style='display:block;' title=\"[NAV_DESC]\"><div><i class=\"fa [ICON_PATH] fa-2x\"></i></div><div>[NAV_NAME]</div></a></li>";
        var mainnavstring_Template_IMG = "<li class=\"mainRegion\" code-data='[NAV_CODE]' ><a href=\"#\" style='display:block;' title=\"[NAV_DESC]\"><div><IMG SRC='/UploadImageDir/HighWay/[FILENAME]' style='width:60px;height:30px;' /></div><div>[NAV_NAME]</div></a></li>";
        var subnav_telplate = "<ul class=\"ListItem Col4 subnav_sub serverpart_nav\" id=\"serverpart_submenu_[ID]\">[CONTENT]</ul>";
        var subnav_id = "";

        function removeData()
        {
            $(".serverpart_nav").remove();
        }
        function getSSubNav(e, obj)
        {
            //1.判断对应的菜单存在否  2.加载对应的数据  3.绑定对应的菜单
            var currIndex = $(obj).parent().attr("text-level") == undefined ? 0 : parseInt($(obj).parent().attr("text-level")) + 1;   //绑定的数据等级
            var currPCode = $(obj).parent().attr("main-code") == undefined ? 0 : $(obj).parent().attr("main-code");    //绑定的数据 请求对象加一级
            var navArray = $(".serverpart_nav");                  //数据对应的菜单项
            var bFind = false;                                    //是否找到对应的菜单项
            for (var i = 0; i < navArray.length; i++)
            {
                if (parseInt($(navArray[i]).attr("text-level")) > currIndex)
                {
                    $(navArray[i]).remove();
                }
                else if ($(navArray[i]).attr("text-level") == currIndex)
                {
                    //当前要的对象是否存在
                    if ($(navArray[i]).attr("main-code") == e) {
                        bFind = true;
                        continue;
                    }
                    else {
                        $(navArray[i]).remove();
                    }
                }
            }
            if (bFind)
            {
                return;
            }
            //然后添加对应的极
            //如果不存在
            if (currIndex == 0) {
                $(".serverpart_expand").after(subnav_telplate.replace("[ID]", e).replace("[CONTENT]", img_div_object));
            }
            else {
                $(obj).parent().after(subnav_telplate.replace("[ID]", e).replace("[CONTENT]", img_div_object));
            }
            var callparam = "action_type=getServerPartTypeByCode&action_data=" + e + "&action_record=all";
            QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', callparam, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        alert(rs);
                    }
                    else {
                        //操作对应的数据
                        var subnavstring = "";
                        var json = json_parse(rs);
                        for (var i = 0; i < json.SERVERPARTTYPE.length; i++) {
                            //
                            try
                            {
                            
                                if (json.SERVERPARTTYPE.MAP_ICON.indexOf(".png") != -1 || json.SERVERPARTTYPE.MAP_ICON.indexOf(".gif") != -1 || json.SERVERPARTTYPE.MAP_ICON.indexOf(".jpg") != -1) {
                                    subnavstring += mainnavstring_Template_IMG.replace("[NAV_CODE]", json.SERVERPARTTYPE[i].SERVERPARTTYPE_ID_Encrypt)
                                        .replace("[FILENAME]", json.SERVERPARTTYPE[i].MAP_ICON).replace("[NAV_NAME]", json.SERVERPARTTYPE[i].TYPE_NAME)
                                        .replace("[NAV_DESC]", json.SERVERPARTTYPE[i].TYPE_DESC).replace("[POINTDATA]", json.SERVERPARTTYPE[i].SETUPPOINT);
                                }
                                else {
                                    subnavstring += mainnavstring_Template.replace("[NAV_CODE]", json.SERVERPARTTYPE[i].SERVERPARTTYPE_ID_Encrypt).replace("[ICON_PATH]", json.SERVERPARTTYPE[i].MAP_ICON).replace("[NAV_NAME]", json.SERVERPARTTYPE[i].TYPE_NAME)
                                    .replace("[NAV_DESC]", json.SERVERPARTTYPE[i].TYPE_DESC).replace("[POINTDATA]", json.SERVERPARTTYPE[i].SETUPPOINT);
                                }
                            }
                            catch(e)
                            {
                                subnavstring += mainnavstring_Template.replace("[NAV_CODE]", json.SERVERPARTTYPE[i].SERVERPARTTYPE_ID_Encrypt).replace("[ICON_PATH]", json.SERVERPARTTYPE[i].MAP_ICON).replace("[NAV_NAME]", json.SERVERPARTTYPE[i].TYPE_NAME)
                                   .replace("[NAV_DESC]", json.SERVERPARTTYPE[i].TYPE_DESC).replace("[POINTDATA]", json.SERVERPARTTYPE[i].SETUPPOINT);
                            }

                        }
                        if (json.SERVERPARTTYPE.length == 0)
                        {
                            $("#serverpart_submenu_" + e).remove();
                            return;
                        }
                        $("#serverpart_submenu_" + e).html("").append(subnavstring);
                        $("#serverpart_submenu_" + e + " li").each(function (i) {
                            $(this).children("a").addClass("color_drak_font");
                            //按钮事件
                            $(this).unbind('click').click(function () {
                                $("#serverpart_submenu_" + e + " li").each(function () {
                                    if ($(this).children("a").hasClass("color_blue_font")) {
                                        $(this).children("a").removeClass("color_blue_font").addClass("color_drak_font");
                                    }
                                });
                                //按钮事件
                                getSSubNav($(this).attr("code-data"), this);
                                //打点
                                SetBackPoint($(this).attr('point-data'));
                                //获得对应的服务区
                                getServerPartAndPoint($(this).attr("code-data"));

                                $(this).children("a").removeClass("color_drak_font").addClass("color_blue_font");
                            });

                        });
                        //设置对应的内容
                        $("#serverpart_submenu_" + e).attr("text-level", currIndex + 1).attr("main-code", e);
                    }
                }
                catch (e)
                { }
            });

        }

        //TODO:2级菜单的下一级菜单
        function getSubMenu(e, Num) {
            //呈现展开
            if (Num == 'all') {
                //收起
                $(".serverpart_expand").css("display", "").html(expand_div.replace("[ICON_NAME]", icon_name[0]).replace("[CONTENT_NAME]", ""));
                $(".serverpart_expand").unbind('click').click(function () {
                    getSubMenu(e, "8");
                });
            }
            else {
                $(".serverpart_expand").css("display", "").html(expand_div.replace("[ICON_NAME]", icon_name[1]).replace("[CONTENT_NAME]", ""));
                $(".serverpart_expand").unbind('click').click(function () {
                    getSubMenu(e, 'all');
                });
            }
            $("#serverpart_submenu").html("").append(img_div_object);
            var callparam = "action_type=getServerPartTypeByCode&action_data=" + e + "&action_record=" + Num;
            QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', callparam, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        alert(rs);
                    }
                    else {
                        //操作对应的数据
                        var subnavstring = "";
                        var json = json_parse(rs);
                        for (var i = 0; i < json.SERVERPARTTYPE.length; i++) {
                            //------------------------------------------------------
                            try {
                                if (json.SERVERPARTTYPE.MAP_ICON.indexOf(".png") != -1 || json.SERVERPARTTYPE.MAP_ICON.indexOf(".gif") != -1 || json.SERVERPARTTYPE.MAP_ICON.indexOf(".jpg") != -1) {
                                    subnavstring += mainnavstring_Template_IMG.replace("[NAV_CODE]", json.SERVERPARTTYPE[i].SERVERPARTTYPE_ID_Encrypt)
                                        .replace("[FILENAME]", json.SERVERPARTTYPE[i].MAP_ICON).replace("[NAV_NAME]", json.SERVERPARTTYPE[i].TYPE_NAME)
                                        .replace("[NAV_DESC]", json.SERVERPARTTYPE[i].TYPE_DESC).replace("[POINTDATA]", json.SERVERPARTTYPE[i].SETUPPOINT);
                                }
                                else {
                                    subnavstring += mainnavstring_Template.replace("[NAV_CODE]", json.SERVERPARTTYPE[i].SERVERPARTTYPE_ID_Encrypt).replace("[ICON_PATH]", json.SERVERPARTTYPE[i].MAP_ICON).replace("[NAV_NAME]", json.SERVERPARTTYPE[i].TYPE_NAME)
                                    .replace("[NAV_DESC]", json.SERVERPARTTYPE[i].TYPE_DESC).replace("[POINTDATA]", json.SERVERPARTTYPE[i].SETUPPOINT);
                                }
                            }
                            catch (e)
                            {
                                subnavstring += mainnavstring_Template.replace("[NAV_CODE]", json.SERVERPARTTYPE[i].SERVERPARTTYPE_ID_Encrypt).replace("[ICON_PATH]", json.SERVERPARTTYPE[i].MAP_ICON).replace("[NAV_NAME]", json.SERVERPARTTYPE[i].TYPE_NAME)
                                       .replace("[NAV_DESC]", json.SERVERPARTTYPE[i].TYPE_DESC).replace("[POINTDATA]", json.SERVERPARTTYPE[i].SETUPPOINT);
                            }
                        }
                        //如果长度为0，则隐藏对应的子项  如果长度小于4 则隐藏对应的展开功能
                        if (json.SERVERPARTTYPE.length == 0)
                        {
                            $("#serverpart_submenu").css("display", "none");
                            $(".serverpart_expand").css("display", "none");
                        }
                        else if (json.SERVERPARTTYPE.length < 8) {
                            $(".serverpart_expand").css("display", "none");
                            $("#serverpart_submenu").css("display", "");
                        }
                        else {
                            $("#serverpart_submenu").css("display", "");
                        }


                        $("#serverpart_submenu").html("").append(subnavstring);
                        var obj = 1000;
                        var objarr = 10;
                        //加载类别对应的数据--延迟2秒加载
                        
                        $("#serverpart_submenu li").each(function (i) {
                            obj = obj + 4000;
                            $(this).children("a").addClass("color_drak_font");
                            $(this).unbind('click').click(function () {
                                $("#serverpart_submenu li").each(function () {
                                    if ($(this).children("a").hasClass("color_blue_font")) {
                                        $(this).children("a").removeClass("color_blue_font").addClass("color_drak_font");
                                    }
                                });
                                $(this).children("a").removeClass("color_drak_font").addClass("color_blue_font");
                                //打点
                                SetBackPoint($(this).attr('point-data'));
                                //获得对应的服务区并打点
                                getServerPartAndPoint($(this).attr('code-data'));
                                //获得对应的子菜单
                                getSSubNav($(this).attr("code-data"), this);
                                objarr = objarr + 800;
                            });
                        }).height(50);
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
        }

        function getServerPartAndPoint(e) {
            //加载服务区
            $("#serverpart_contain").html("").append(img_div_object);
            var callparam = "action_type=getServerPartByType&action_data=" + e;
            QRWL.Core.getAjax('/HighWay/Handler/handler_ajax.ashx', callparam, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        alert(rs);
                    }
                    else {
                        //操作对应的数据
                        var serverpartcontent = "";
                        var dd = JSON.stringify(rs);
                        var json = json_parse(rs);
                        for (var i = 0; i < json.SERVERPART.length; i++) {
                            serverpartcontent += serverpartcontent_template.replace("[SERVERPART_NAME]", json.SERVERPART[i].SERVERPART_NAME)
                                .replace("[EXPRESSWAY_NAME]", json.SERVERPART[i].EXPRESSWAY_NAME)
                                .replace("[SERVERPART_ADDRESS]", json.SERVERPART[i].SERVERPART_ADDRESS)
                                .replace("[POINTX]", json.SERVERPART[i].SERVERPART_X)
                            .replace("[POINTY]", json.SERVERPART[i].SERVERPART_Y)
                            .replace("[CODE]", json.SERVERPART[i].SERVERPART_ID_Encrypt)
                            .replace("[imagepath]", json.SERVERPART[i].SERVERPART_IPADDRESS)
                            ;
                        }
                        $("#serverpart_contain").html("").append(serverpartcontent);
                        $("#serverpart_contain").css('display','block');
                        $('.entrylist li').mouseover(function () {
                            $(this).css("backgroundColor", "#7A8B8B");
                        })
                            .mouseout(function () {
                                $(this).css("backgroundColor", "");
                            });
                        map.clearOverlays();
                        //map_step3:
                        map.addOverlay(g_pop);
                        arrayMaker = new Array();
                        $("#serverpart_contain li").each(function (i) {
                            var data = i % 2;
                            if (data == 0) {
                                $(this).addClass("even");
                            }
                            //清楚标点
                            
                            //标点
                            //var param = "action_type=getPointPos&action_data=" + $(this).attr("data-code") + "&imagepath=" + $(this).attr("data-imgpath");
                            //QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                            //    try {
                            //        if (rs.indexOf('error') > -1) {
                            //            ;
                            //        }
                            //        else {
                            //            //获得服务区的json对象

                            //            markerArr = [rs];
                            //            addMarker();
                            //        }
                            //    } catch (e) {
                            //        alert(e.message);
                            //    }
                            //});

                            //单击事件
                            $(this).click(function () {
                                var p1 = $(this).attr("data-pointx");
                                var p2 = $(this).attr("data-pointy");
                                if (p1 == "")
                                    return;
                                RetSetMapPoint(p1, p2);
                            });
                        });

                    }
                } catch (e) {
                    alert(e.message);
                }
            });

            //获得百度地图标点信息
            var param = "action_type=getPointPosByServerPartType&action_data=" + e;
            QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        ;
                    }
                    else {
                        var arrayobjectback = eval('(' + "[" + rs + "]" + ')');
                        for (var num = 0; num < arrayobjectback.length; num++) {
                            markerArr = [JSON.stringify(arrayobjectback[num])];
                            addMarker();
                        }
                        //markerArr = json_parse(rs);//[];
                        renderPop(arrayobjectback);
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
        }



        function getMainNav(){
            //初始化对应的选项
            // var navString = '<%=GetTypeString%>';
            //第一层自定义类别信息
            var navString = $("#type_hidden").val();
           
            var navarray = navString.split(',');
            var mainnavstring = "";
            var firstCode = "";
            for (var i = 0; i < navarray.length; i++) {
                var objarr = navarray[i].split('|');
                firstCode = firstCode == "" ? objarr[1] : firstCode;
                try {
                    if (objarr[2].indexOf(".png") != -1 || objarr[2].indexOf(".gif") != -1 || objarr[2].indexOf(".jpg") != -1) {
                        mainnavstring += mainnavstring_Template_IMG.replace("[NAV_CODE]", objarr[1]).replace("[FILENAME]", objarr[2]).replace("[NAV_NAME]", objarr[0])
                                 .replace("[NAV_DESC]", objarr[0]).replace("[POINTDATA]", objarr[3]);
                    }
                    else {
                        mainnavstring += mainnavstring_Template.replace("[NAV_CODE]", objarr[1]).replace("[ICON_PATH]", objarr[2]).replace("[NAV_NAME]", objarr[0])
                                 .replace("[NAV_DESC]", objarr[0]).replace("[POINTDATA]", objarr[3]);
                    }
                }
                catch (e)
                {
                    mainnavstring += mainnavstring_Template.replace("[NAV_CODE]", objarr[1]).replace("[ICON_PATH]", objarr[2]).replace("[NAV_NAME]", objarr[0])
                                 .replace("[NAV_DESC]", objarr[0]).replace("[POINTDATA]", objarr[3]);
                }

            }
            $("#serverpart_mainNav").append(mainnavstring);
            //隐藏第二级菜单
            $("#serverpart_submenu").css("display", "none");
            //请求对应的菜单
            $("#serverpart_mainNav li").each(function (i) {
                //
                $(this).children("a").addClass("color_drak_font");
                //绑定事件
                $(this).click(function () {
                    //
                    $("#serverpart_mainNav li").each(function () {
                        if($(this).children("a").hasClass("color_blue_font"))
                        {
                            $(this).children("a").removeClass("color_blue_font").addClass("color_drak_font");
                        }
                    });
                    $(this).children("a").removeClass("color_drak_font").addClass("color_blue_font");
                    getSubMenu($(this).attr("code-data"),'8');
                    //清空
                    $("#serverpart_contain").html("");
                    $("#serverpart_contain").css('display','none');
                    //标点
                    SetMapPoint($(this).attr("code-data"));
                    //清空子项
                    removeData();

                    SetBackPoint($(this).attr('point-data'));
                });
            })
        }

        //根据对应的类型进行标点--添加对应的服务区(某个类别的所有子类)
        //TODO:list的响应函数
        function SetMapPoint(e)
        {
            map.clearOverlays();
            /*
            *TODO:因为clearOverlays会把自定义覆盖物清除,
                但是marker后addoverlayer会使maker消失 
                所以放在这里 寻找更好的方案....
            */
            //map_step2:
            map.addOverlay(g_pop);
            arrayMaker = new Array();
            //获得服务区列表
            var callparam = "action_type=getServerPartByType&action_data=" + e;
            QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', callparam, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        alert(rs);
                    }
                    else {
                        //或得
                        var dd = JSON.stringify(rs);
                        var json = json_parse(rs);
                        var serverpartcontent = "";
                        for (var i = 0; i < json.SERVERPART.length; i++) {
                            //获得服务区信息
                            serverpartcontent += serverpartcontent_template.replace("[SERVERPART_NAME]", json.SERVERPART[i].SERVERPART_NAME)
                               .replace("[EXPRESSWAY_NAME]", json.SERVERPART[i].EXPRESSWAY_NAME)
                               .replace("[SERVERPART_ADDRESS]", json.SERVERPART[i].SERVERPART_ADDRESS)
                               .replace("[POINTX]", json.SERVERPART[i].SERVERPART_X)
                           .replace("[POINTY]", json.SERVERPART[i].SERVERPART_Y)
                           .replace("[CODE]", json.SERVERPART[i].SERVERPART_ID_Encrypt)
                            .replace("[imagepath]", json.SERVERPART[i].SERVERPART_IPADDRESS);
                            //标点
                            //var param = "action_type=getPointPos&action_data=" + json.SERVERPART[i].SERVERPART_ID_Encrypt + "&imagepath=" + json.SERVERPART[i].SERVERPART_IPADDRESS;
                            //QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                            //    try {
                            //        if (rs.indexOf('error') > -1) {
                            //            ;
                            //        }
                            //        else {
                            //            markerArr = [rs];
                            //            addMarker();
                            //        }
                            //    } catch (e) {
                            //        alert(e.message);
                            //    }
                            //});
                        }
                        //添加服务区信息
                        $("#serverpart_contain").html("").append(serverpartcontent);
                        $("#serverpart_contain").css('display','block');
                        g_DOMHandler.serverpart_contain.style.height = (window.innerHeight * 0.9 - g_DOMHandler.serverpart_contain.offsetTop) + 'px'
                        $('.entrylist li').mouseover(function () {
                            $(this).css("backgroundColor", "#7A8B8B");
                        })
                            .mouseout(function () {
                                $(this).css("backgroundColor", "");
                            });
                        $("#serverpart_contain li").each(function (i) {
                            //单击事件
                            $(this).click(function () {
                                var p1 = $(this).attr("data-pointx");
                                var p2 = $(this).attr("data-pointy");
                                if (p1 == "")
                                    return;
                                RetSetMapPoint(p1, p2);
                            }); 
                        });
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
            //获得百度地图标点信息
            var param = "action_type=getPointPosByServerPartType&action_data=" + e;
            QRWL.Core.getAjaxAsync('/HighWay/Handler/handler_ajax.ashx', param, function (rs) {
                try {
                    if (rs.indexOf('error') > -1) {
                        ;
                    }
                    else {
                        var arrayobjectback =  eval('(' + "["+rs + "]"+')');
                        for (var num = 0; num < arrayobjectback.length; num++) {
                            markerArr = [JSON.stringify(arrayobjectback[num])];
                            addMarker();
                        }
                        //markerArr = json_parse(rs);//[];
                        //map_step4:
                       renderPop(arrayobjectback);
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
        }



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
            + "<b>[ServerName]</b><br /><br /><br/>[IMAGEPATH]"
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
            map.centerAndZoom(point, 8);

            if (InitPointX == 'undefined' || InitPointX == "" || InitPointX == null) {
                var myCity = new BMap.LocalCity();
                myCity.get(myFun);
            }
            else {
                var point = new BMap.Point(InitPointX, InitPointY);
                map.centerAndZoom(point, 8);
            }
            window.map = map;
            //map_step1:create map overlay
            g_pop = new ScrollTextOverlay();  
            map.addOverlay(g_pop);
            // g_pop.setText('萧山服务区卖出了一台电脑|RMB:9999');
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
                var a = 123;
            });
        }

        var g_State = false;
        function addMapControl() {

            var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
            map.addControl(ctrl_nav);

            var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
            map.addControl(ctrl_ove);
            
            ctrl_ove.addEventListener('viewchanged',function(event){
                if (event.isOpen) {
                    //浮动sidebar
                    floatSideBar();
                }else{
                    if (g_sideBar.preExpend) {
                        expendSideBar();
                    }
                }
            },false);

            var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
            map.addControl(ctrl_sca);
        }

        function addMarker() {
            for (var i = 0; i < markerArr.length; i++) {
                var json = markerArr[i];
                json = eval('(' + json + ')');
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var imagepath = json.imagepath;
                var point = new BMap.Point(p0, p1);
                //创建对应的Icon
                var iconImg = null;
                if (imagepath == "") {
                    iconImg = createIcon(json.icon);
                }
                else {
                    iconImg = createIconNew(json.icon, imagepath);
                }

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
                        var point = this.z.point;
                        if(g_pop.isDisplay(point)){
                            g_pop.stop();
                        }
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
            WindowInfoString = WindowInfoString.replace("[IMAGEPATH]", objstring == "" ? "<img src='/HighWay/Resources/v1_0/Style/Images/NoPic.jpg' onclick=\"javascript:openMessage('" + json.objectcode + "')\" style=\"height:150px; width:150px; cursor:pointer; \" />" : objstring);
            //<img src='/HighWay/Resources/v1_0/Style/NoPic.jpg' onclick=\"javascript:openMessage('" + json.objectcode + "'); />
            var iw = new BMap.InfoWindow(WindowInfoString);

            
            return iw;
        }

        function createIcon(json) {
            //获得对应的图片内容
            var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(-23, -json.t), infoWindowOffset: new BMap.Size(json.lb + 5, 1), offset: new BMap.Size(json.x, json.h) })
            return icon;
        }

        function createIconNew(json, path) {
            //获得对应的图片内容
            var icon = new BMap.Icon(ServerPath + path, new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(0, 0), infoWindowOffset: new BMap.Size(json.lb + 5, 1), offset: new BMap.Size(json.x, json.h) })
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
                        //添加标点
                        addMarker();
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
        })

        //点击的时候，将点击的按钮，变换成红色
        function RetSetMapPoint(pointX, pointY) {
            //设置中心点
            //map_step5:
            var point = new BMap.Point(pointX, pointY);
            if (g_pop.isDisplay(point)) {
                g_pop.stop();
            }
            map.centerAndZoom(point, 10);
            //重新设置--如果跟点击的X 与Y相等，则红色表示
            for (var i = 0 ; i < arrayMaker.length; i++) {
                //array.splice(start,delCount)
                if (arrayMaker[i].point.lat == pointY && arrayMaker[i].point.lng == pointX)
                {
                    map.removeOverlay(arrayMaker[i]);
                    try
                    {
                        arrayMaker[i].z.vj.imageUrl = "http://api0.map.bdimg.com/images/marker_red_sprite.png";
                        arrayMaker[i].z.vj.imageOffset.height = 0;
                        arrayMaker[i].z.vj.imageOffset.width = 0;
                        json = eval('(' + arrayMaker[i].z.title + ')');
                       
                    }
                    catch(e)
                    {
                        arrayMaker[i].z.hj.imageUrl = "http://api0.map.bdimg.com/images/marker_red_sprite.png";
                        arrayMaker[i].z.hj.imageOffset.height = 0;
                        arrayMaker[i].z.hj.imageOffset.width = 0;
                        json = eval('(' + arrayMaker[i].z.title + ')');
                    }
                        var label = new BMap.Label(json.title.replace("服务区", "").replace("加油站", ""), { "offset": new BMap.Size(13, -20) });
                        arrayMaker[i].setLabel(label);
                        label.setStyle({
                            borderColor: "#808080",
                            color: "#333",
                            cursor: "pointer"
                        });
                        map.addOverlay(arrayMaker[i]);

                        var _iw = createInfoWindow(arrayMaker[i].z.title);
                        arrayMaker[i].openInfoWindow(_iw);
                        RetSetState();

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
                    if (arrayMaker[i].z.vj.imageOffset.height == 0)
                    {
                        map.removeOverlay(arrayMaker[i]);

                        try {
                            json = eval('(' + arrayMaker[i].z.title + ')');
                            if (json.imagepath == "") {
                                arrayMaker[i].z.vj.imageUrl = "http://app.baidu.com/map/images/us_mk_icon.png";
                                arrayMaker[i].z.vj.imageOffset.height = -21;
                                arrayMaker[i].z.vj.imageOffset.width = -23;
                            }
                            else {
                                arrayMaker[i].z.vj.imageUrl = ServerPath + json.imagepath;
                                arrayMaker[i].z.vj.imageOffset.height = 0;
                                arrayMaker[i].z.vj.imageOffset.width = 0;
                            }

                        }
                        catch (e) {
                            json = eval('(' + arrayMaker[i].z.title + ')');
                            if (json.imagepath == "") {
                                arrayMaker[i].z.hj.imageUrl = "http://app.baidu.com/map/images/us_mk_icon.png";
                                arrayMaker[i].z.hj.imageOffset.height = -21;
                                arrayMaker[i].z.hj.imageOffset.width = -23;
                            }
                            else {
                                arrayMaker[i].z.hj.imageUrl = ServerPath + json.imagepath;
                                arrayMaker[i].z.hj.imageOffset.height = 0;
                                arrayMaker[i].z.hj.imageOffset.width = 0;
                            }
                        }


                        
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

        function SetBackPoint(obj)
        {
            if (obj == null || obj == "") {
                var point = new BMap.Point(120.171279, 30.286386);
                map.centerAndZoom(point, 8);
            }
            else {
                var navarray = obj.split('!');
                var point = new BMap.Point(parseFloat(navarray[0]), parseFloat(navarray[1]));
                map.centerAndZoom(point, parseInt(navarray[2]));
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
                            retString = "<IMG onclick=\"javascript:openMessage('" + json.ImageObject[i].code + "');\" src=\"" + json.ImageObject[i].path + "\" style=\"height:150px; width:150px; cursor:pointer; \"></IMG>";
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
        /*
            @author:mofanjun
            @describtion:my code form here
            @date:2016/8/31
        */
        //TODO:完成代码开发后再分层
        var g_htmlTemplate = {
            toast_wrapper:['<% for(var i=0; i < items.length; i++){ %>',
               '<li class="<%= items[i].status %>">',
               '   <div class="toast">',
               '       <span><%= items[i].name %></span>',
               '       <span><%= items[i].address %></span>',
               '   </div>',
                '</li>',
               '<% } %>'].join("")
        };
        /*data opration*/
        var g_json;
        var g_pop;//泡泡气窗句柄
        function parseData(rs){
            var dd = JSON.stringify(rs);
            var json = json_parse(rs);
            g_json = json;
            return json;
        }
        //Function:提取items
        function makeItems(js){
            var items = [];
            for (var i = 0; i < js.SERVERPART.length; i++) {
                var item = {name:null,address:null};
                item.name = js.SERVERPART[i].SERVERPART_NAME;
                item.address = js.SERVERPART[i].SERVERPART_ADDRESS;
                items.push(item);
            }
            return items;
        }
        /*UI operation*/
        var g_DOMHandler = {};
        //sideBar状态管理类
        var g_sideBar = {
            click:false,
            preExpend:false,
            expend:false,
            setExpend:function(bExpend){
                this.preExpend = this.expend;
                this.expend = bExpend;
            }
        };

        //收缩sidebar控件
        function floatSideBar(){
            var top = g_DOMHandler.searchContainer.offsetTop;
            var height = g_DOMHandler.searchContainer.offsetHeight;
            g_sideBar.setExpend(false);
            g_DOMHandler.input.blur();
            g_DOMHandler.formSideBar.style.height = top + height + 'px';
        }
        //扩展sidebar控件
        function expendSideBar(){
            var viewHeight = window.innerHeight;
            g_sideBar.setExpend(true);
            g_DOMHandler.formSideBar.style.height = viewHeight * 0.9 + 'px';
            g_DOMHandler.serverpart_contain.style.height = (viewHeight * 0.9 - g_DOMHandler.serverpart_contain.offsetTop) + 'px'
        }

        //更新搜索内容
        function updateSearchConainer(rs){
            var json = parseData(rs);
            var items = makeItems(json);
            //清空
            g_DOMHandler.toastWrapper.innerHTML = '';
            //模板操作
            var innerHTML = simpleTemplate.template(g_htmlTemplate.toast_wrapper,items);
            g_DOMHandler.toastWrapper.innerHTML = innerHTML;
        }
        //在地图上打点
        function pointMap(rs){
            var arrayobjectback =  eval('(' + "["+rs + "]"+')');
            for (var num = 0; num < arrayobjectback.length; num++) {
                markerArr = [JSON.stringify(arrayobjectback[num])];
                addMarker();
            }
            renderPop(arrayobjectback);
        }
        //@Function:解析服务端数据 并且显示第一个地址的气泡框
        var g_pop_timeHandler = null;
        function renderPop(arrayobjectback){
            var pop_points = [];
            //有新的绘制需求后 将句柄置空来停止轮询
            clearInterval(g_pop_timeHandler);
            g_pop_timeHandler = null;
            //如果只有一个服务站将不显示气泡
            if (arrayobjectback.length == 1) {
                return;
            }

            for (var num = 0; num < arrayobjectback.length; num++) {
                var map_item = {
                    display:null,
                    point:null
                }
                markerArr = [JSON.stringify(arrayobjectback[num])];
                var json = markerArr[0];
                json = eval('(' + json + ')');
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var imagepath = json.imagepath;
                var point = new BMap.Point(p0, p1);
                map_item.point = point;
                map_item.display = json.content;
                pop_points.push(map_item);
            }
            var min = 0,max = arrayobjectback.length-1;
            var last_displayIndex = null;
            var callBack = function(){
                var displayIndex = Math.floor(Math.random()*(max-min+1)+min);;
                if (last_displayIndex == displayIndex) {
                    displayIndex = (displayIndex + 1) < max ? (displayIndex + 1) : (displayIndex - 1);
                }
                g_pop.switchDraw(pop_points[displayIndex]);
                last_displayIndex = displayIndex;
                //句柄未置空 继续执行延迟函数
                // if (g_pop_timeHandler !== null) {
                //     g_pop_timeHandler = setTimeout(callBack,5000);
                // }
            };
            g_pop_timeHandler = setInterval(callBack,5000);
        }
        //Event
        function stopBubble(e) { 
            //如果提供了事件对象，则这是一个非IE浏览器 
            if ( e && e.stopPropagation ) 
                //因此它支持W3C的stopPropagation()方法 
                e.stopPropagation(); 
            else 
            //否则，我们需要使用IE的方式来取消事件冒泡 
                window.event.cancelBubble = true; 
        } 
        //阻止浏览器的默认行为 
        function stopDefault( e ) { 
            //阻止默认浏览器动作(W3C) 
            if ( e && e.preventDefault ) 
                e.preventDefault(); 
                //IE中阻止函数器默认动作的方式 
            else 
                window.event.returnValue = false; 
            return false; 
        }

        //TODO:分离name和pos 提高复用性
        function getServerData(){
          if (g_pre_search_value !== g_DOMHandler.input.value) {
                g_pre_search_value = g_DOMHandler.input.value;
                search.getSearchServerPart(g_DOMHandler.input.value,function(fs){
                    if (!fs) {
                        console.log('btnSearch error!');
                        return;
                    }
                    var fs = parseData(fs);
                    showContainer('another_list_container',true,g_json);
                });

                search.getServerPosByName(g_DOMHandler.input.value,function(rs){
                    pointMap(rs);
                });

                cancelAnimationFrame(g_animationHandler);
                g_animationHandler = null;
            }
        }

        /*
            @function:显示数据列表
            @param1:容器名称
            @param2:是否有动画
            @param3:显示数据
            @return null
        */
        function renderList(container,animation,renderJson){
            var json = renderJson;
            var serverpartcontent = "";
            for (var i = 0; i < json.SERVERPART.length; i++) {
                //获得服务区信息
                serverpartcontent += serverpartcontent_template.replace("[SERVERPART_NAME]", json.SERVERPART[i].SERVERPART_NAME)
                   .replace("[EXPRESSWAY_NAME]", json.SERVERPART[i].EXPRESSWAY_NAME)
                   .replace("[SERVERPART_ADDRESS]", json.SERVERPART[i].SERVERPART_ADDRESS)
                   .replace("[POINTX]", json.SERVERPART[i].SERVERPART_X)
               .replace("[POINTY]", json.SERVERPART[i].SERVERPART_Y)
               .replace("[CODE]", json.SERVERPART[i].SERVERPART_ID_Encrypt)
                .replace("[imagepath]", json.SERVERPART[i].SERVERPART_IPADDRESS);
            }
            //添加服务区信息
            $('#' + container).html("").append(serverpartcontent);
            $('.entrylist li').mouseover(function () {
                $(this).css("backgroundColor", "#7A8B8B");
            })
                .mouseout(function () {
                    $(this).css("backgroundColor", "");
                });
            $('#' + container + ' li').each(function (i) {
                //单击事件
                $(this).click(function () {
                    var p1 = $(this).attr("data-pointx");
                    var p2 = $(this).attr("data-pointy");
                    if (p1 == "")
                        return;
                    RetSetMapPoint(p1, p2);
                }); 
            });
            //set height
            var search_height = 40;
             $('#' + container).css('height','auto');
            var viewHeight = window.innerHeight;
            var height =  $('#' + container).height();
            height = height < (viewHeight * 0.9 - search_height) ? height : (viewHeight * 0.9 - search_height);
            $('#' + container).css('height',height + 'px');
            //render
            if (animation) {
                $('#' + container).css('top','-1000px');
                $('#' + container).css('display','block');
                $('#' + container).animate({top:'40px'},1000,null);
            }else{
                $('#' + container).css('display','block');
            }
        }
        /*
            @function:两个互斥的容器管理
        */
        function showContainer(containerName,aninmation,json){
            expendSideBar();
            if (containerName === 'list_container') {
                $('#list_container').css('display','block');
                $('#another_list_container').css('display','none');
            }else if(containerName === 'another_list_container'){
                $('#list_container').css('display','none');
                renderList(containerName,aninmation,json);
            }
        }

        var g_last_time = null;
        var g_time_recoder = 0;
        var g_animationHandler = null;
        //TODO:完善轮训检索
        var g_search_obj = {
            search_str:'',
            beSearched:false
        }
        function loopSearch(timestamp) {
            //等待检验的数据赋值
            if (g_search_obj.search_str === '' && g_DOMHandler.input.value !== '') {
               g_search_obj.search_str = g_DOMHandler.input.value;
            }

            if (g_search_obj.search_str !== '' && g_search_obj.search_str === g_DOMHandler.input.value
                && g_search_obj.beSearched === false) {
                var interval = timestamp - g_last_time;
                g_time_recoder += interval;
                if (g_time_recoder > 2000) {
                    // g_wait_search_value = g_DOMHandler.input.value;
                    g_search_obj.beSearched = true;
                    g_time_recoder = 0;
                    search.getSearchServerPart(g_DOMHandler.input.value,function(fs){
                        if (!fs) {
                            //alert('请输入"中文" 重新检索服务站');
                            return;
                        }
                        console.log('!0_0!');
                        updateSearchConainer(fs);
                    });
                }
            }else{
                g_time_recoder = 0;
                if (g_search_obj.search_str !== g_DOMHandler.input.value) {
                    g_search_obj.search_str = g_DOMHandler.input.value;
                    g_search_obj.beSearched = false;
                }
            }
            g_last_time = timestamp;
            g_animationHandler = requestAnimationFrame(loopSearch);
        }

        //event
        var g_pre_search_value = '';//记录前一个搜索的字段
        function main(){
            //请求主菜单数据
             getMainNav();
            //UI Event lister
            g_DOMHandler.body = document.getElementsByTagName('body')[0];
            g_DOMHandler.formSideBar = document.getElementById('Form_SideBar');
            g_DOMHandler.listContainer = document.getElementById('list_container');
            g_DOMHandler.serverpart_contain = document.getElementById('serverpart_contain');
            //search container
            g_DOMHandler.searchContainer = document.getElementById('search_container');
            g_DOMHandler.input = document.getElementById('search');
            g_DOMHandler.btnClear = document.getElementById('btn_clear');
            g_DOMHandler.btnSearch = document.getElementById('btn_search');
            //toast
            g_DOMHandler.toastWrapper = document.getElementById('toast_wrapper');
            g_DOMHandler.input.addEventListener('focus',function(){
                showContainer('list_container');
            },false);


            //TODO:remove jquery method
            $("#search").bind('input propertychange',function(){
                var value = g_DOMHandler.input.value;
                if (value.length == 0) {
                    g_DOMHandler.btnClear.style.display = "none";
                }else{
                    g_DOMHandler.btnClear.style.display = "block";
                    if (g_animationHandler === null) {
                        g_animationHandler = requestAnimationFrame(loopSearch);
                    }
                }
            });

            g_DOMHandler.formSideBar.addEventListener('click',function(){
                g_sideBar.click = true;
            },false);
            
            g_DOMHandler.body.addEventListener('click',function(){
                if (!g_sideBar.click) {
                    floatSideBar();
                    g_DOMHandler.input.value = "";
                    g_DOMHandler.toastWrapper.innerHTML = "";
                }
                g_sideBar.click = false;
            },false);
            //搜索按钮
            g_DOMHandler.btnSearch.addEventListener('click',function(event){
                getServerData();
                g_DOMHandler.toastWrapper.innerHTML = "";
                stopBubble(event);
                stopDefault(event);

            },false);
            //回车按钮
            g_DOMHandler.input.addEventListener('keydown',function(event){
                if (event.keyCode === 13) {
                    getServerData();
                    g_DOMHandler.toastWrapper.innerHTML = "";
                    stopBubble(event);
                    stopDefault(event);
                }
            },false);
            //清除文字按钮
            g_DOMHandler.btnClear.addEventListener('click',function(event){
                //置空input让 搜索栏消失
                g_DOMHandler.input.value = "";
                g_DOMHandler.toastWrapper.innerHTML = "";
                stopBubble(event);
                stopDefault(event);
            },false);
            //清除按钮
            g_DOMHandler.toastWrapper.addEventListener('click',function(event){
                g_DOMHandler.toastWrapper.innerHTML = "";
                var key = event.target.innerText;
                //显示某项数据
                var json = {
                    SERVERPART:[]
                };
                for (var i = 0; i < g_json.SERVERPART.length; i++) {
                    if (g_json.SERVERPART[i].SERVERPART_NAME ||
                        g_json.SERVERPART[i].SERVERPART_ADDRESS) {
                        json.SERVERPART[0] = g_json.SERVERPART[i];
                        break;
                    }
                }
                showContainer('another_list_container',true,json);
                search.getServerPosByName(g_json.SERVERPART[i].SERVERPART_NAME,function(rs){
                    pointMap(rs);
                });
            },false);
            //init UI
            floatSideBar();
        }
        /*
        *执行入口函数
        */
        main();
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




             
                     
