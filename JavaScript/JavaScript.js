function ReSetData(e) {
    var obj_ID = e.replace("PURCHASE_TAXPRICE", "PURCHASE_PRICE");
    $("#" + obj_ID).val(($("#" + e).val() / 1.17).toFixed(6));

    //PURCHASECOUNT 采购数量  -- UNITCOUNT 单位数量
    var obj_ID_1 = e.replace("PURCHASE_TAXPRICE", "PURCHASECOUNT");
    var obj_ID_2 = e.replace("PURCHASE_TAXPRICE", "UNITCOUNT");
    var CurrData;
    var parent = $("#" + e).parent().parent().parent().parent().parent().parent().parent();
    try {
        var currobj = parent[0].children[11];
        CurrData = currobj.innerText;
        currobj.innerText = ($("#" + obj_ID_1).val() * $("#" + obj_ID_2).val() * $("#" + e).val()).toFixed(2);
        //修改结果。。
        resetTotalText("TaxSpanText", CurrData, currobj.innerText);
    }
    catch (e) {
    }

    try {
        var currobj = parent[0].children[12];
        CurrData = currobj.innerText;
        currobj.innerText = ($("#" + obj_ID_1).val() * $("#" + obj_ID_2).val() * $("#" + obj_ID).val()).toFixed(2);
        //修改结果。。
        resetTotalText("PriceSpanText", CurrData, currobj.innerText);
    }
    catch (e) {
    }


}
//总数量
function resetTaxData(obj1, obj2, obj3) {
    var CurrData;
    //总含税进价
    try {
        CurrData = $("#" + obj3).val();
        $("#" + obj3).val(($("#" + obj1).val() * $("#" + obj2).val()).toFixed(2));
        resetTotalText("NumberSpanText", CurrData, $("#" + obj3).val());
    }
    catch (e)
    { }
}
//总金额
function resetPriceData(obj1, obj2, obj3) {
    var CurrData;
    //总价
    try {
        CurrData = $("#" + obj3).val();
        $("#" + obj3).val(($("#" + obj1).val() * $("#" + obj2).val()).toFixed(2));
        resetTotalText("PriceSpanText", CurrData, $("#" + obj3).val());
    }
    catch (e)
    { }
}

function resetTotalText(obj, oldText, newText) {
    var CurrData = (Number($("." + obj).text()) - Number(oldText) + Number(newText)).toFixed(2);
    $("." + obj).text(CurrData);
}

function resetprice(obj1, obj2, duty_paragraph) {
    $("#" + obj2).val(($("#" + obj1).val() / duty_paragraph).toFixed(6));
}
