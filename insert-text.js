let textboxOnPage = false;
let offset = $('#canvas-draft').offset()
let lastPosition = [0,0]

// function createText(text,coord){
// var textInput = document.createElement("input")
// textInput.setAttribute('type', 'text');
// //textInput.setAttribute('value','' );
// document.getElementById('canvas-container').appendChild(textInput);
// textInput.style.position = 'absolute';
// textInput.style.top = coord[1] + document.getElementById('canvas-draft').offsetTop;
// textInput.style.left = coord[0]; + document.getElementById('canvas-draft').offsetLeft;
// textInput.style.zIndex = "1";
// textInput.focus()
// }
function fontStyle(style,size){
    contextReal.font = `${size} ${style}` ; 
    $("input[name='insert-text']").css({"font":` ${size} ${style}`})
}

class InsertText extends PaintFunction{
    constructor(contextReal,contextDraft){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;    
        // this.textInput = document.createElement("input")        
    }
    
    onMouseDown(coord,event){
        console.log("outside Canvas is "+ outsideCanvas)
        if (outsideCanvas === true) {
            console.log("click outside")
            $('input[type=text]').css({display: 'none'})
            $('input[type=text]').val("")
        } else {
            console.log("click Inside")
        $("input[name='insert-text']").css({display: 'inline-block', top: coord[1] + offset.top, left: coord[0] + offset.left});
        lastPosition = [coord[0] ,(coord[1] + $("input[name='insert-text']").height()/2)]
        }
        // $("input[name='insert-text']").css({display: 'inline-block', top: coord[1], left: coord[0]});
        // textboxOnPage = true
        // }
        // lastPosition = [coord[0] , coord[1] ]
        
        // this.contextReal.fillText("abc", coord[0], coord[1])

    }        
    
    onDragging(){}
    onMouseMove(){}
    onMouseUp(){
        $("input[name='insert-text']").focus()
    }
    onMouseLeave(){}
    onMouseEnter(){}
    onEnterPress(coord,event){
        console.log(`enter being pressed`);
        this.contextReal.font = "30px Arial" //different from html
        this.contextReal.fillText($('input[type=text]').val(),lastPosition[0],lastPosition[1])
        $('input[type=text]').css({display: 'none'})
        $('input[type=text]').val("")
    }
    //context.fillText(text,x,y,maxWidth);
}