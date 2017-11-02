let canvasReal = document.getElementById('canvas-real');
let contextReal = canvasReal.getContext('2d');
let canvasDraft = document.getElementById('canvas-draft');
let contextDraft = canvasDraft.getContext('2d');
/*let canvasDraft2 = document.getElementById('canvas-draft2');
let contextDraft2 = nvasDraft2.getContext('2d');*/
// let currentFunction, canva_log ;
let dragging = false;
let left = false;


$('#canvas-draft').mousedown(function(e){
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    console.log(`Mouse position is - x: ${e.pageX}, y: ${e.pageY}`)
    currentFunction.onMouseDown([mouseX,mouseY],e);
    dragging = true;
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
});
$('#canvas-draft').mouseenter(function(e){
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    currentFunction.onMouseEnter([mouseX,mouseY],e);
});

$(window).keypress(function(e) {
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    if(e.which == 13) {
    currentFunction.onEnterPress([mouseX,mouseY],e);
    }   
})

//load on Cancel is the mouse is up while outside of the canvas
$(window).mouseup(function(e){
    console.log(e.target.id);
    if ((left) && (e.target.id != 'print') && (e.target.id != 'download') && (e.target.id != 'canvas-draft') && (e.target.id != 'input-box')){
        left = false;
        dragging = false;
        currentFunction.onCancel();
        //reset the slider value
        $('#size-slider').slider({value: 3});
        $("#size_field").text(3);
        $("#size_field").val(3);
        $('#rotate-slider').slider({value: 0});
        $("#rotate_field").text(0);
        $("#rotate_field").val(0);
    //  $('imagebrush-rotation-slider').slider({value: 0});
    //  $("#image_degree_field").text(0);
    //  $("#image_degree_field").val(0);
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
    //reset the slider value
    $('#size-slider').slider({value: 3});
    $("#size_field").text(3);
    $("#size_field").val(3);
    $('#rotate-slider').slider({value: 0});
    $("#rotate_field").text(0);
    $("#rotate_field").val(0);

});

$('#print').click(function(e){
    currentFunction.onPrint();
});

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
    onPrint(){}
    onRotate(){}
    onImageRotate(){}
    onEnterPress(){}
    onColorChange(){}
}    