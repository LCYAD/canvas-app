class InsertText extends PaintFunction{
   constructor(contextReal,contextDraft,canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;
        this.offset = $('#canvas-draft').offset();
        this.lastPosition = [0,0]; 
        this.canvas_log = canvas_log;  
        this.adjustFont = function(size, style){
            this.contextReal.font = `${size} ${style}` ; 
            $("input[name='insert-text']").css({"font":`${size} ${style}`})
        }  
    }
    

    onMouseDown(coord,event){
        console.log(coord[0],coord[1])
        console.log(`Text box positioned at x: ${coord[0] + this.offset.left}  y: ${coord[1] + this.offset.top}`)
        $("input[name='insert-text']").css({display: 'inline-block', left: coord[0] + this.offset.left, top: coord[1] + this.offset.top});
        this.lastPosition = [coord[0] , coord[1] ]
    }        
    
    onDragging(){}
    onMouseMove(){
        $("input[name='insert-text']").css({color: rgbaColor})
    }
    onMouseUp(){
        $("input[name='insert-text']").focus();
    }
    onMouseLeave(){}
    onMouseEnter(){}
    onCancel(){}
    onChange(){
        //this.adjustFont($('#size-slider').slider("value"))
    }
    onEnterPress(coord,event){
        this.textSizeVal =  parseInt($("#size_field").val())+30
        console.log(`enter being pressed`);
        this.contextReal.font = `${this.textSizeVal}px Arial` //different from html
        this.contextReal.fillStyle = rgbaColor
        this.contextReal.fillText($('input[type=text]').val(),this.lastPosition[0],this.lastPosition[1]+($('input[type=text]').height()/2))
        $('input[type=text]').css({display: 'none'})
        $('input[type=text]').val("")
        this.canvas_log.saveState();
    }
    //context.fillText(text,x,y,maxWidth);
}

