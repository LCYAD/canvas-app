$(window).on('load', function(){

    let canvasCoverage = 0.7;
    let controlboardWidth = $('#control-board').width();
    let optionboxHeight = $('.option-box').height();
    

    //Hiding current buttons or rotation
    $('#cancel').hide();
    $('#print').hide();
    $('#rotate-slider-bar').hide();
    $("#imagebrush-rotation-slider-bar").hide();
    $('#text-input').draggable().hide();
    
    //Set the size for the canvas
    let canvas_width = ($(window).width()-controlboardWidth)*canvasCoverage;
    let canvas_width_margin = ($(window).width()-controlboardWidth)*(1-canvasCoverage)/2;
    let canvas_height_margin = ($(window).height()-optionboxHeight)*(1-canvasCoverage)/2;
    let canvas_height = ($(window).height()-optionboxHeight)*canvasCoverage;
    $( "#canvas-real" )[0].width = $( "#canvas-draft" )[0].width = canvas_width;
    $( "#canvas-real" )[0].height = $( "#canvas-draft" )[0].height = canvas_height;
    $( "#canvas-real" ).css({marginLeft: `${canvas_width_margin  + controlboardWidth}px`, 
                             marginTop: `${canvas_height_margin + optionboxHeight}px`});
    $( "#canvas-draft" ).css({marginLeft: `${canvas_width_margin  + controlboardWidth}px`, 
                              marginTop: `${canvas_height_margin + optionboxHeight}px`});

    //init the background of canvas to white
    contextReal.save();
    contextReal.fillStyle = contextDraft.fillStyle = "#FFFFFF";
    contextReal.fillRect(0,0,canvas_width , canvas_height);
    contextReal.fill();
    contextDraft.restore();

    let canvas_log = new ActionLog(contextReal,contextDraft);
    


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

    $('#imagebrush-rotation-slider').slider({
        orientation: "horizontal",
        range: false,
        min: 0,
        max: 90,
        value: 0,
        step: 5,
        animate: true,
        slide: function(event, ui){
            $("#image_degree_field").text(ui.value);
            $("#image_degree_field").val(ui.value);
            currentFunction.onImageRotate(ui.value);
        }

        
    });

    //drawing function
    currentFunction = new DrawingLineSmooth(contextReal,contextDraft, canvas_log);
    
    $(window).click(()=>{
        if (currentFunction.constructor.name !== "BoardEdge" && currentFunction.constructor.name !=="EEdge"){
            $("#imagebrush-rotation-slider-bar").hide();
        }    
    })
    $('#drawing-rectangle2').click(()=>{
        currentFunction = new DrawingRectangle2(contextReal,contextDraft, canvas_log);
    });
    $('#drawing-line-smooth').click(()=>{
        currentFunction = new DrawingLineSmooth(contextReal,contextDraft, canvas_log);
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
    $('#drawing-circle2').click(()=>{
        currentFunction = new DrawingCircle2(contextReal,contextDraft, canvas_log);
    });
    $('#drawing-ellipse').click(()=>{
        currentFunction = new DrawingEllipse(contextReal,contextDraft, canvas_log);
    });
    $('#e-edge').click(()=>{
        currentFunction = new EEdge(contextReal,contextDraft, canvas_log);
        $("#imagebrush-rotation-slider-bar").show()
    });
    $('#board-edge').click(()=>{
        currentFunction = new BoardEdge(contextReal,contextDraft, canvas_log);
        $("#imagebrush-rotation-slider-bar").show()
    });
    $('#insert-text').click(()=>{
        currentFunction = new InsertText(contextReal,contextDraft, canvas_log);
    });
    $('#eraser').click(()=>{
        currentFunction = new Eraser(contextReal,contextDraft, canvas_log);
    });
    $('#selector').click(()=>{
        currentFunction = new Selector(contextReal,contextDraft, canvas_log);
    });
    $('#clear').click(()=>{
        contextReal.save();
        contextReal.fillStyle = contextDraft.fillStyle = "#FFFFFF";
        contextReal.fillRect(0,0,canvas_width , canvas_height);
        contextReal.fill();
        contextReal.restore();
    });
    $('#undo').click(()=>{
        canvas_log.undo();
    });
    $('#redo').click(()=>{
        canvas_log.redo();
    });

     //Reset and hide input box when current function change

    
    /*$('#download').click(()=>{
        var dt = canvasReal.toDataURL('image/jpeg');
        this.href = dt;
    });*/

    //Unused functions below
    /*
    $('#drawing-rectangle').click(()=>{
        currentFunction = new DrawingRectangle(contextReal,contextDraft);
    });
    $('#drawing-line').click(()=>{
        currentFunction = new DrawingLine(contextReal,contextDraft);
    });
    $('#draw-s-line').click(()=>{
        currentFunction = new Draw_S_Line(contextReal,contextDraft);
    });
    $('#draw-s-line2').click(()=>{
        currentFunction = new Draw_S_Line2(contextReal,contextDraft,contextDraft2);
    });
    $('#drawing-circle').click(()=>{
        currentFunction = new DrawingCircle(contextReal,contextDraft);
    });
    $('#print2').click(() =>{
        let x = $('#draggable').position().left-50;
        let y = $('#draggable').position().top-50;
        let h = $('#image').height();
        let w = $('#image').width();
        let img = document.getElementById("image");
        contextReal.drawImage(img,x,y, w, h);
    });
    */

})
//resize function - reset the canvas and clear the undo redo array
$(window).on('resize', ()=>{
    
    let canvasCoverage = 0.7;
    let controlboardWidth = $('#control-board').width();
    let optionboxHeight = $('.option-box').height();
    
    //Hiding current buttons or rotation
    $('#cancel').hide();
    $('#print').hide();
    $('#rotate-slider-bar').hide();
    $('#text-input').hide();
    

    //Set the size for the canvas
    let canvas_width = ($(window).width()-controlboardWidth)*canvasCoverage;
    let canvas_width_margin = ($(window).width()-controlboardWidth)*(1-canvasCoverage)/2;
    let canvas_height_margin = ($(window).height()-optionboxHeight)*(1-canvasCoverage)/2;
    let canvas_height = ($(window).height()-optionboxHeight)*canvasCoverage;
    $( "#canvas-real" )[0].width = $( "#canvas-draft" )[0].width = canvas_width;
    $( "#canvas-real" )[0].height = $( "#canvas-draft" )[0].height = canvas_height;
    $( "#canvas-real" ).css({marginLeft: `${canvas_width_margin  + controlboardWidth}px`, 
                             marginTop: `${canvas_height_margin + optionboxHeight}px`});
    $( "#canvas-draft" ).css({marginLeft: `${canvas_width_margin  + controlboardWidth}px`, 
                              marginTop: `${canvas_height_margin + optionboxHeight}px`});

    //Clear Real canvas screen
    contextReal.clearRect(0,0,$('#canvas-real').width(), $('#canvas-real').height());


});