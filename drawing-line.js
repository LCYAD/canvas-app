class DrawingLine extends PaintFunction{
    constructor(contextReal){
        super();
        this.context = contextReal;            
    }

    onMouseDown(coord,event){
        this.context.strokeStyle = "black";
        this.context.lineJoin = this.context.Cap = "round";
        this.context.lineCap = "round";
        this.context.lineWidth = parseInt($("#size_field").val());
        this.context.beginPath();
        this.context.moveTo(coord[0],coord[1]);
        this.draw(coord[0],coord[1]);
        this.prevCoord = coord;
    }
    onDragging(coord,event){
        this.draw(coord[0],coord[1]);
    }

    onMouseMove(){}
    onMouseUp(){}
    onMouseLeave(){}
    onMouseEnter(){}
    onFinish(){}
    onCancel(){}

    draw(x,y){
        this.context.lineTo(x,y);
        this.context.moveTo(x,y);
        this.context.closePath();
        this.context.stroke();    
    }
}