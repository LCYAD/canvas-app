class Eraser extends PaintFunction{
    
    constructor(contextReal, contextDraft, canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;     
        this.canvas_log = canvas_log; 
        this.prevCoord = []; 
        this.points = [];
        this.cp_size = 30;         
    }

    onMouseDown(coord,event){
        //set style
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "white";
        this.contextDraft.lineJoin = this.contextDraft.lineCap = "round";
        this.contextReal.lineJoin = this.contextReal.lineCap = "round";
        this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val())+2;
        this.cp_size = this.contextDraft.lineWidth*2;
        //draw initial white line on draft
        this.points.push(coord);
        this.prevCoord = coord;
        //print circle
        this.drawCPDraft(coord[0], coord[1]);
    }

    onDragging(coord,event){
        //drawing on draft with coordinate pushed to the array
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
        this.drawCPDraft(coord[0], coord[1]);
    }

    onMouseMove(){}
    onMouseUp(){
        //set style
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "white";
        this.contextDraft.lineWidth = this.contextReal.lineWidth =  parseInt($("#size_field").val())+2;
        //clear Draft
        this.contextDraft.clearRect(0, 0, canvasDraft.width, canvasDraft.height);
        //draw line back to real
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
    onRotate(){}
    

    //class internal methods
    midPoint(currentX, currentY, prevX, prevY){
        return ([prevX + (currentX - prevX)/2, 
                prevY + (currentY - prevY)/2]);
    }

    drawDraft(currentX, currentY, prevX, prevY){
        //find the mid point and move the curve on the draft canvas using quadratic curve 
        let midpt = this.midPoint(currentX, currentY, prevX, prevY);
        this.contextDraft.quadraticCurveTo(prevX, prevY, midpt[0], midpt[1]); 
    }

    drawReal(currentX, currentY, prevX, prevY){
        //find the mid point and move the curve on the real canvas using quadratic curve 
        let midpt = this.midPoint(currentX, currentY, prevX, prevY);
        this.contextReal.quadraticCurveTo(prevX, prevY, midpt[0], midpt[1]); 
    }

    drawCPDraft(currentX, currentY){
        //set initial style
        this.contextDraft.save();
        //circle style
        this.contextDraft.lineWidth = this.contextReal.lineWidth = 2;
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "black";
        this.contextDraft.setLineDash([2, 2])
        //draw circle on current mouse point
        this.contextDraft.beginPath();
        this.contextDraft.arc(currentX, currentY, this.cp_size/2, 0, 2*Math.PI);
        this.contextDraft.stroke();
        //restore previous setting
        this.contextDraft.restore();
    }
    
}