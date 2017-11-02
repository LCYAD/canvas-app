class Bezier_Curve extends PaintFunction{  //using one canvas draft only
    constructor(contextReal,contextDraft, canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;
        this.canvas_log = canvas_log;
        this.startpt = {x:0, y:0};
        this.endpt = {x:0, y:0};
        this.midpt1 = {x:0, y:0};
        this.midpt2 = {x:0, y:0};
        this.quadcoord = {'start': this.startpt, 'mid1': this.midpt1, 'mid2': this.midpt2, 'end': this.endpt};
        this.prevCoord = {x:0, y:0};
        this.cp_size = 20;  //setting standard size of the control points
        this.phase_adjust = false;
        this.dragpt;
        this.finish = false;
    }
    
    onMouseDown(coord,event){
        //setting style
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = rgbaColor;
        this.contextDraft.lineJoin = this.contextReal.lineJoin = "round";
        this.contextDraft.lineCap = this.contextReal.lineCap = "round";
        this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
        //check to see the phase adjust has started or not
        if (!this.phase_adjust){
            //to begin, set all 3 points to be the same
            this.startpt = {x:coord[0], y:coord[1]};
            this.midpt1 = {x:coord[0], y:coord[1]};
            this.midpt2 = {x:coord[0], y:coord[1]};
            this.endpt = {x:coord[0], y:coord[1]};
            this.quadcoord = {'start': this.startpt, 'mid1': this.midpt1, 'mid2': this.midpt2, 'end': this.endpt};
        } else{
            //the coordinate is passed to the moving point
            this.checkCP(coord[0], coord[1]);
            if (!this.finish){
                this.quadcoord[this.dragpt] = {x:coord[0], y:coord[1]};
                //draw 4 control points
                this.drawCPDraft(this.quadcoord.start.x,this.quadcoord.start.y);
                this.drawCPDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y);
                this.drawCPDraft(this.quadcoord.mid2.x,this.quadcoord.mid2.y);
                this.drawCPDraft(this.quadcoord.end.x,this.quadcoord.end.y);
                this.drawCPLine();
            } 
        }
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.quadcoord.start.x,this.quadcoord.start.y);
        this.drawCurveDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y, this.quadcoord.mid2.x,this.quadcoord.mid2.y,
                            this.quadcoord.end.x,this.quadcoord.end.y);
    }      


    onDragging(coord,event){
        if (!this.finish){
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            if(!this.phase_adjust){
            //mid at beginning is: 
            this.midpt1 = {x: (this.quadcoord.start.x + (coord[0] - this.quadcoord.start.x)/4), 
                           y: (this.quadcoord.start.y + (coord[1] - this.quadcoord.start.y)/4)-40};
            this.midpt2 = {x: (this.quadcoord.start.x + (coord[0] - this.quadcoord.start.x)/4*3), 
                           y: (this.quadcoord.start.y + (coord[1] - this.quadcoord.start.y)/4)+40};
            this.endpt = {x:coord[0], y:coord[1]};
            this.quadcoord.mid1 = this.midpt1;
            this.quadcoord.mid2 = this.midpt2;
            this.quadcoord.end = this.endpt;
            }else{
                //the coordinate is passed to the moving point
                this.quadcoord[this.dragpt] = {x:coord[0], y:coord[1]};
                //draw 4 control points
                this.drawCPDraft(this.quadcoord.start.x,this.quadcoord.start.y);
                this.drawCPDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y);
                this.drawCPDraft(this.quadcoord.mid2.x,this.quadcoord.mid2.y);
                this.drawCPDraft(this.quadcoord.end.x,this.quadcoord.end.y);
                this.drawCPLine();
            }
            this.prevCoord = {x:coord[0], y:coord[1]};
            console.log(JSON.stringify(this.quadcoord));
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.quadcoord.start.x,this.quadcoord.start.y);
            this.drawCurveDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y, this.quadcoord.mid2.x,this.quadcoord.mid2.y,
                this.quadcoord.end.x,this.quadcoord.end.y);
        } else{}
        
    }
    onMouseMove(){}
    onMouseUp(coord, event){
        if (!this.finish){
            /*
            if not phase adjust stage then just set end pt as current coordinate, and print out control point
            else check to see if cp1 was clicked or cp2 was clicked then update the new coordinate
            */
            if (!this.phase_adjust){
                this.midpt1 = {x: (this.quadcoord.start.x + (coord[0] - this.quadcoord.start.x)/4), 
                                y: (this.quadcoord.start.y + (coord[1] - this.quadcoord.start.y)/4)-40};
                this.midpt2 = {x: (this.quadcoord.start.x + (coord[0] - this.quadcoord.start.x)/4*3), 
                                y: (this.quadcoord.start.y + (coord[1] - this.quadcoord.start.y)/4)+40};
                this.endpt = {x:coord[0], y:coord[1]};
                this.quadcoord.mid1 = this.midpt1;
                this.quadcoord.mid2 = this.midpt2;
                this.quadcoord.end = this.endpt;
                this.phase_adjust = true;
                $('#cancel').show();
            } else{
                //the coordinate is passed to the moving point
                this.quadcoord[this.dragpt] = {x:coord[0], y:coord[1]};
            }
            this.prevCoord = {x:coord[0], y:coord[1]};
            //draw the final version on the draft page and the 2 cp
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.quadcoord.start.x,this.quadcoord.start.y);
            this.drawCurveDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y, this.quadcoord.mid2.x,this.quadcoord.mid2.y,
                this.quadcoord.end.x,this.quadcoord.end.y);
            //draw 4 control points
            this.drawCPDraft(this.quadcoord.start.x,this.quadcoord.start.y);
            this.drawCPDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y);
            this.drawCPDraft(this.quadcoord.mid2.x,this.quadcoord.mid2.y);
            this.drawCPDraft(this.quadcoord.end.x,this.quadcoord.end.y);
            this.drawCPLine();;
        } else{
            console.log(JSON.stringify(this.quadcoord));
            //reset all boolean
            this.finish = this.phase_adjust = false;
            //clear draft canvas and print on real canvas
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height); 
            this.contextReal.beginPath();
            this.contextReal.moveTo(this.quadcoord.start.x,this.quadcoord.start.y);
            this.contextReal.bezierCurveTo(this.quadcoord.mid1.x,this.quadcoord.mid1.y, this.quadcoord.mid2.x,this.quadcoord.mid2.y,
                this.quadcoord.end.x,this.quadcoord.end.y);
            this.contextReal.stroke();
            this.canvas_log.saveState();
            //hide the cancel button
            $('#cancel').hide();
        }
    }

    onMouseLeave(){
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        if (!this.phase_adjust){
            this.endpt = this.prevCoord;
            this.midpt1 = {x: (this.quadcoord.start.x + (this.prevCoord.x - this.quadcoord.start.x)/4), 
                            y: (this.quadcoord.start.y + (this.prevCoord.y - this.quadcoord.start.y)/4)-40};
            this.midpt2 = {x: (this.quadcoord.start.x + (this.prevCoord.x - this.quadcoord.start.x)/4*3), 
                            y: (this.quadcoord.start.y + (this.prevCoord.y - this.quadcoord.start.y)/4)+40};
            this.quadcoord.mid = this.midpt;
            this.quadcoord.end = this.endpt;
        } else{
            //the coordinate is passed to the moving point
            this.quadcoord[this.dragpt] = this.prevCoord;
            //draw 4 control points
            this.drawCPDraft(this.quadcoord.start.x,this.quadcoord.start.y);
            this.drawCPDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y);
            this.drawCPDraft(this.quadcoord.mid2.x,this.quadcoord.mid2.y);
            this.drawCPDraft(this.quadcoord.end.x,this.quadcoord.end.y);
            this.drawCPLine();;
        }
        console.log(JSON.stringify(this.quadcoord));
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.quadcoord.start.x,this.quadcoord.start.y);
        this.drawCurveDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y, this.quadcoord.mid2.x,this.quadcoord.mid2.y,
            this.quadcoord.end.x,this.quadcoord.end.y);
    }

    onMouseEnter(){}
    onFinish(){}
    onCancel(){
        this.finish = this.phase_adjust = false;
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        $('#cancel').hide();
    }
    onChange(){
        //when the setting changes take the new setting then redraw the canvas but only on phase_adjust mode
        if (this.phase_adjust){
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            //refresh setting
            this.contextDraft.strokeStyle = this.contextReal.strokeStyle = rgbaColor;
            this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
            //redraw curve
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.quadcoord.start.x,this.quadcoord.start.y);
            this.drawCurveDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y, this.quadcoord.mid2.x,this.quadcoord.mid2.y,
                this.quadcoord.end.x,this.quadcoord.end.y);

            //draw 4 control points
            this.drawCPDraft(this.quadcoord.start.x,this.quadcoord.start.y);
            this.drawCPDraft(this.quadcoord.mid1.x,this.quadcoord.mid1.y);
            this.drawCPDraft(this.quadcoord.mid2.x,this.quadcoord.mid2.y);
            this.drawCPDraft(this.quadcoord.end.x,this.quadcoord.end.y);
            this.drawCPLine();
        }
    }

    //class internal method
    drawCurveDraft(mid1x,mid1y,mid2x,mid2y, endx, endy){
        this.contextDraft.bezierCurveTo(mid1x,mid1y,mid2x,mid2y,endx, endy)
        this.contextDraft.stroke();
    }

    drawCPDraft(x, y){
        //set initial style
        this.contextDraft.save();
        //circle style
        this.contextDraft.lineWidth = this.contextReal.lineWidth = 2;
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "black";
        this.contextDraft.setLineDash([2, 4])
        //draw circle on current mouse point
        this.contextDraft.beginPath();
        this.contextDraft.arc(x, y, this.cp_size/2, 0, 2*Math.PI);
        this.contextDraft.stroke();
        //restore previous setting
        this.contextDraft.restore();
    }

    drawCPLine(){
        //set initial style
        this.contextDraft.save();
        //circle style
        this.contextDraft.lineWidth = this.contextReal.lineWidth = 1;
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "red";
        this.contextDraft.setLineDash([2, 4]);
        //draw a dotted line from start to end and passing mid point
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.quadcoord.start.x, this.quadcoord.start.y);
        this.contextDraft.lineTo(this.quadcoord.mid1.x, this.quadcoord.mid1.y);
        this.contextDraft.lineTo(this.quadcoord.mid2.x, this.quadcoord.mid2.y);
        this.contextDraft.lineTo(this.quadcoord.end.x, this.quadcoord.end.y);
        this.contextDraft.stroke();
        this.contextDraft.restore();
    }

    between(test, num1, num2){
        return test >= num1 && test <= num2;
    }

    checkCP(x,y){
        if ((this.between(x,this.quadcoord.start.x - this.cp_size/2, this.quadcoord.start.x + this.cp_size/2))
            && (this.between(y,this.quadcoord.start.y - this.cp_size/2, this.quadcoord.start.y+ this.cp_size/2))){
            this.dragpt = 'start';
            console.log('Start point was clicked was clicked');
        } else if ((this.between(x,this.quadcoord.mid1.x - this.cp_size/2, this.quadcoord.mid1.x + this.cp_size/2))
                && (this.between(y,this.quadcoord.mid1.y - this.cp_size/2, this.quadcoord.mid1.y + this.cp_size/2))){
            this.dragpt = 'mid1';         
            console.log('Mid 1 point was clicked was clicked');
        } else if ((this.between(x,this.quadcoord.mid2.x - this.cp_size/2, this.quadcoord.mid2.x + this.cp_size/2))
                && (this.between(y,this.quadcoord.mid2.y - this.cp_size/2, this.quadcoord.mid2.y + this.cp_size/2))){
            this.dragpt = 'mid2';         
            console.log('Mid 2 point was clicked was clicked');
        } else if ((this.between(x,this.quadcoord.end.x - this.cp_size/2, this.quadcoord.end.x + this.cp_size/2))
                && (this.between(y,this.quadcoord.end.y- this.cp_size/2, this.quadcoord.end.y + this.cp_size/2))){
            this.dragpt = 'end';  
            console.log('End point was clicked was clicked');
        } else{
            //if the mouse is not clicked inside the circle then end phase adjust and cancel
            this.finish = true;
        }
    }
    
}
