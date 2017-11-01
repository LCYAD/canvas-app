class DrawingCircle extends PaintFunction{
    constructor(contextReal,contextDraft){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;            
    }
    
    onMouseDown(coord,event){
        this.contextReal.fillStyle = "#f44";
        this.origX = coord[0];
        this.origY = coord[1];
        this.contextDraft.beginPath();
    }
    onDragging(coord,event){
        this.contextDraft.fillStyle = "#f44";
        this.contextDraft.beginPath();
        let radius = Math.sqrt(Math.pow((coord[0]-this.origX), 2) + Math.pow((coord[1]-this.origY), 2));
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.contextDraft.arc(this.origX,this.origY,radius, 0, 2*Math.PI );
        this.contextDraft.stroke();
    }

    onMouseMove(){}
    onMouseUp(coord){
        let radius = Math.sqrt(Math.pow((coord[0]-this.origX), 2) + Math.pow((coord[1]-this.origY), 2));
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.contextReal.beginPath();
        this.contextReal.arc(this.origX,this.origY,radius, 0, 2 * Math.PI );
        this.contextReal.fill()
        this.contextReal.stroke();
    }
    onMouseLeave(){}
    onMouseEnter(){}
    onFinish(){}
    onCancel(){}
}