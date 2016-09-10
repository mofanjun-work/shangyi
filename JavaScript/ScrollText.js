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
    if (this.timerHandle) {
        clearInterval(this.timerHandle);
        this.timerHandle = null;
    }
}

Scroll.prototype.setContent = function(text){
    var tpl = document.getElementById('yp_text');
    var tpl_copy = document.getElementById('yp_text_copy');
    tpl.innerHTML = text;
    tpl_copy.innerHTML = text;
}