$(window).on('load', function(){

    let canvas_log = new ActionLog(contextReal,contextDraft);

    $( "#draggable" ).draggable().resizable().hide();
    /*$( "#control_pt_1" ).draggable().hide();
    $( "#control_pt_2" ).draggable().hide();
    $( "#control_pt_3" ).draggable().hide();
    $( "#control_pt_4" ).draggable().hide();
    $( "#control_pt_5" ).draggable().hide();
    $( "#control_pt_6" ).draggable().hide();
    $( "#control_pt_7" ).draggable().hide();
    $( "#control_pt_8" ).draggable().hide();*/

    //hide the finish and cancel button
    //$('#finish').hide();
    $('#cancel').hide();
    $('#print').hide();
    $('#rotate-slider-bar').hide();

    //Set the size for the canvas
    let canvas_width = $(window).width()-200;
    let canvas_height = $(window).height()-200;
    $( "#canvas-real" )[0].width = $( "#canvas-draft" )[0].width = canvas_width;
    $( "#canvas-real" )[0].height = $( "#canvas-draft" )[0].height = canvas_height;

    /*Hide the second draft
    $( "#canvas-draft2" ).hide();*/

    $('#size-slider').slider({
        orientation: "horizontal",
        range: false,
        min: 1,
        max: 50,
        value: 3,
        step: 1,
        animate: true,
        slide: function(event, ui){
            $("#size_field").text(ui.value);
            $("#size_field").val(ui.value);
            currentFunction.onChange(ui.value);
        }
    });
    $('#rotate-slider').slider({
        orientation: "horizontal",
        range: false,
        min: 0,
        max: 359,
        value: 0,
        step: 1,
        animate: true,
        slide: function(event, ui){
            $("#rotate_field").text(ui.value);
            $("#rotate_field").val(ui.value);
            currentFunction.onRotate(ui.value);
        }
    });

    //drawing function
    currentFunction = new DrawingLine(contextReal,contextDraft);
    $('#drawing-rectangle').click(()=>{
        currentFunction = new DrawingRectangle(contextReal,contextDraft);
    });
    $('#drawing-rectangle2').click(()=>{
        currentFunction = new DrawingRectangle2(contextReal,contextDraft, canvas_log);
    });
    $('#drawing-line').click(()=>{
        currentFunction = new DrawingLine(contextReal,contextDraft);
    });
    $('#drawing-line-smooth').click(()=>{
        currentFunction = new DrawingLineSmooth(contextReal,contextDraft, canvas_log);
    });
    $('#draw-s-line').click(()=>{
        currentFunction = new Draw_S_Line(contextReal,contextDraft);
    });
    $('#draw-s-line3').click(()=>{
        currentFunction = new Draw_S_Line3(contextReal,contextDraft, canvas_log);
    });
    $('#quad-curve').click(()=>{
        currentFunction = new Quad_Curve(contextReal,contextDraft, canvas_log);
    });
    $('#bezier-curve').click(()=>{
        currentFunction = new Bezier_Curve(contextReal,contextDraft, canvas_log);
    });
    $('#drawing-circle').click(()=>{
        currentFunction = new DrawingCircle(contextReal,contextDraft);
    });
    $('#drawing-circle2').click(()=>{
        currentFunction = new DrawingCircle2(contextReal,contextDraft, canvas_log);
    });
    $('#drawing-ellipse').click(()=>{
        currentFunction = new DrawingEllipse(contextReal,contextDraft, canvas_log);
    });
    $('#eraser').click(()=>{
        currentFunction = new Eraser(contextReal,contextDraft, canvas_log);
    });
    $('#clear').click(()=>{
        contextReal.clearRect(0,0,$('#canvas-real').width(), $('#canvas-real').height());
        canvas_log.saveState();
    });
    $('#undo').click(()=>{
        canvas_log.undo();
    });
    $('#redo').click(()=>{
        canvas_log.redo();
    });
    /*$('#draw-s-line2').click(()=>{
        currentFunction = new Draw_S_Line2(contextReal,contextDraft,contextDraft2);
    });*/
    /*$('#print2').click(() =>{
        let x = $('#draggable').position().left-50;
        let y = $('#draggable').position().top-50;
        let h = $('#image').height();
        let w = $('#image').width();
        let img = document.getElementById("image");
        contextReal.drawImage(img,x,y, w, h);
    });*/
});