var g_html_fragment = {
    scroll:['<div id=\'pop\' class=\'ys_pop\'>',
            '    <div id= \'ys_scroll\'>',
            '        <div id=\'ys_scroll_container\'>',
            '            <div id = \'yp_text\' class= \'ys_scroll_text\'>some long text1 here</div><!--',
            '            --><div id = \'yp_text_copy\' class= \'ys_scroll_text\'>some long text2 here</div>',
            '        </div>',
            '    </div>',
            '    <span></span>',
            '</div>'].join(""),
    end:null
}


function Scroll(text){
    var scroll = document.getElementById('ys_scroll');
    var container = document.getElementById('ys_scroll_container'); 
    var tpl = document.getElementById('yp_text');
    this.element = scroll;
    this.scrollWidth = tpl.offsetWidth;
}  
    
Scroll.prototype.run = function(){
    var that = this;
    this.timerHandle = setInterval(function(){   
        var element = that.element;
        element.scrollLeft = element.scrollLeft + 1;
        if (element.scrollLeft >= (that.scrollWidth + 20)) {
            element.scrollLeft = 0;
        }
    }, 20);
};

Scroll.prototype.stop = function(){
    clearInterval(this.timerHandle);
    this.timerHandle = null;
}

// var sc = new Scroll(document.getElementById("scroll"));  
// document.getElementById('pop').addEventListener('animationend', function(event){
//     if (event.animationName === 'slowShow') {
//         //泡泡框显示回调
//         sc.run();
//     }else if(event.animationName === 'slowHide'){
//         //泡泡框消失回调
//     }
// },false); 