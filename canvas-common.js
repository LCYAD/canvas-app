let canvasReal = document.getElementById('canvas-real');
let contextReal = canvasReal.getContext('2d');
let canvasDraft = document.getElementById('canvas-draft');
let contextDraft = canvasDraft.getContext('2d');
/*let canvasDraft2 = document.getElementById('canvas-draft2');
let contextDraft2 = canvasDraft2.getContext('2d');*/
let currentFunction;
let dragging = false;
let left = false;
let outsideCanvas = false



$('#canvas-draft').mousedown(function(e){
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    currentFunction.onMouseDown([mouseX,mouseY],e);
    dragging = true;
    if (currentFunction.constructor.name !== 'InsertText' ){
        $('input[type=text]').css({display: 'none'})
        $('input[type=text]').val("")
    } // Make sure html is hidden on all other funtions
});
$('#canvas-draft').mousemove(function(e){
    if(dragging){
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;
        currentFunction.onDragging([mouseX,mouseY],e);
        left = false;
    }
    currentFunction.onMouseMove(e,this);
});
$('#canvas-draft').mouseup(function(e){
    console.log('Mouse is up!');
    dragging = false;
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    currentFunction.onMouseUp([mouseX,mouseY],e);
});
$('#canvas-draft').mouseleave(function(e){
    if(dragging){
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;
        currentFunction.onMouseLeave([mouseX,mouseY],e);
    }
    left = true;
    outsideCanvas = true;
});
$('#canvas-draft').mouseenter(function(e){
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    outsideCanvas = false
    currentFunction.onMouseEnter([mouseX,mouseY],e);
});
    

//load on Cancel is the mouse is up while outside of the canvas
$(window).mouseup(function(e){
    if (left){
        left = false;
        dragging = false;
        currentFunction.onCancel();
    }
});

/*control points event
$('.control_pt').mousedown(function(e){
    let mouseX = e.currentTarget.offsetLeft - $('#canvas-draft2').offset().left;
    let mouseY = e.currentTarget.offsetTop - $('#canvas-draft2').offset().top;
    dragging = true;
    currentFunction.onMouseDown([mouseX,mouseY],e);
});
$('.control_pt').mousemove(function(e){
    if(dragging){
        console.log(e);
        let mouseX = e.currentTarget.offsetLeft - $('#canvas-draft2').offset().left;
        let mouseY = e.currentTarget.offsetTop - $('#canvas-draft2').offset().top;
        currentFunction.onDragging([mouseX,mouseY],e);
    }
    currentFunction.onMouseMove(e,this);
});
$('.control_pt').mouseup(function(e){
    let mouseX = e.currentTarget.offsetLeft - $('#canvas-draft2').offset().left;
    let mouseY = e.currentTarget.offsetTop - $('#canvas-draft2').offset().top;
    dragging = false;
    currentFunction.onMouseDown([mouseX,mouseY],e);
});
$('#finish').click(function(e){
    currentFunction.onFinish();
});*/
$('#cancel').click(function(e){
    currentFunction.onCancel();
    dragging = false;
});

$(document).keypress(function(e) {
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    if(e.which == 13) {
        currentFunction.onEnterPress([mouseX,mouseY],e);
    }
})

class PaintFunction{
    constructor(){}
    onMouseDown(){}
    onDragging(){}
    onMouseMove(){}
    onMouseUp(){}
    onMouseLeave(){}
    onMouseEnter(){}
    //additional functionality
    //onFinish(){}
    onCancel(){}
    onChange(){}
    onRotate(){}
    onEnterPress(){}
}    