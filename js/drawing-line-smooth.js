class DrawingLineSmooth extends PaintFunction{
    
    constructor(contextReal, contextDraft, canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft; 
        this.canvas_log = canvas_log;     
        this.prevCoord = []; 
        this.points = [];         
    }

    onMouseDown(coord,event){
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = rgbaColor;
        this.contextDraft.lineJoin = this.contextDraft.lineCap = "round";
        this.contextReal.lineJoin = this.contextReal.lineCap = "round";
        this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
        this.points.push(coord);
        this.prevCoord = coord;
    }

    onDragging(coord,event){
        this.points.push(coord);
        this.contextDraft.clearRect(0, 0, canvasDraft.width, canvasDraft.height);
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.points[0][0], this.points[0][1]);
        this.prevCoord = this.points[0];
        for (var index = 1; index < this.points.length; index++){
            this.drawDraft(this.points[index][0], this.points[index][1], this.prevCoord[0], this.prevCoord[1]);
            this.prevCoord = this.points[index];
        }
        this.contextDraft.stroke();
    }

    onMouseMove(){}
    onMouseUp(){
        this.contextDraft.clearRect(0, 0, canvasDraft.width, canvasDraft.height);
        this.contextReal.beginPath();
        this.contextReal.moveTo(this.points[0][0], this.points[0][1]);
        this.prevCoord = this.points[0];
        for (var index = 1; index < this.points.length; index++){
            this.drawReal(this.points[index][0], this.points[index][1], this.prevCoord[0], this.prevCoord[1]);
            this.prevCoord = this.points[index];
        }
        this.contextReal.stroke();
        this.canvas_log.saveState();
        this.points.length = 0;
        this.prevCoord = [];
    }
    onMouseLeave(){}
    onMouseEnter(){}
    onFinish(){}
    onCancel(){}
    onChange(){}
    

    //class internal methods
    midPoint(currentX, currentY, prevX, prevY){
        return ([prevX + (currentX - prevX)/2, 
                prevY + (currentY - prevY)/2]);
    }

    drawDraft(currentX, currentY, prevX, prevY){
        let midpt = this.midPoint(currentX, currentY, prevX, prevY);
        this.contextDraft.quadraticCurveTo(prevX, prevY, midpt[0], midpt[1]); 
    }

    drawReal(currentX, currentY, prevX, prevY){
        let midpt = this.midPoint(currentX, currentY, prevX, prevY);
        this.contextReal.quadraticCurveTo(prevX, prevY, midpt[0], midpt[1]); 
    }
    
}