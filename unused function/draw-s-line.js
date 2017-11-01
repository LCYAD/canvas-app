class Draw_S_Line extends PaintFunction{
    constructor(contextReal,contextDraft){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;             
    }
    
    onMouseDown(coord,event){
        console.log(event);
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "#df4b26";
        this.contextDraft.lineJoin = this.contextReal.lineJoin = "round";
        this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
        this.origX = coord[0];
        this.origY = coord[1];
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(coord[0],coord[1]);
        this.draw(coord[0],coord[1]);
    }
    onDragging(coord,event){
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.origX ,this.origY);
        this.draw(coord[0],coord[1]);
    }

    onMouseMove(){}
    onMouseUp(coord){
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.contextReal.beginPath();
        this.contextReal.moveTo(this.origX ,this.origY);
        this.contextReal.lineTo(coord[0],coord[1]);
        this.contextReal.moveTo(coord[0],coord[1]);
        this.contextReal.closePath();
        this.contextReal.stroke();   
    }
    onMouseLeave(){}
    onMouseEnter(){}
    onFinish(){}
    onCancel(){}
    onChange(){}


    //class internal method
    draw(x,y){
        this.contextDraft.lineTo(x,y);
        this.contextDraft.moveTo(x,y);
        this.contextDraft.closePath();
        this.contextDraft.stroke();    
    }
}