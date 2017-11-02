class Draw_S_Line3 extends PaintFunction{  //using one canvas draft only
    constructor(contextReal,contextDraft, canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;
        this.canvas_log = canvas_log;
        this.origX = 0;
        this.origY = 0;
        this.cp1 = {x:0, y:0};
        this.cp2 = {x:0, y:0};
        this.prevCoord = {x:0, y:0};
        this.cp_size = 20;  //setting standard size of the control points
        this.phase_adjust = false;
        this.cp1_clicked = false;
        this.cp2_clicked = false;
        this.finish = false;
    }
    
    onMouseDown(coord,event){
        //setting style
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = rgbaColor;
        this.contextDraft.lineJoin = this.contextReal.lineJoin = "round";
        this.contextDraft.lineCap = this.contextReal.lineCap = "round";
        this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
        console.log(this.contextDraft.lineWidth/2);
        //check to see the phase adjust has started or not
        if (!this.phase_adjust){
            this.origX = coord[0];
            this.origY = coord[1];
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(coord[0],coord[1]);
            this.drawDraft(coord[0],coord[1]);
        } else{
            //Need to check which control point was clicked on
            this.checkCP(coord[0], coord[1]);
            // if pressed outside of control point draft is cleared and reset
            if (!this.finish){
                //if not canceled then only cp1 or cp2 can be clicked
                if (this.cp1_clicked){
                    this.origX = this.cp2.x;
                    this.origY = this.cp2.y;
                    console.log('CP1 is now selected');
                    console.log(`Starting @ x: ${this.origX} and y: ${this.origY}`);
                } else{
                    this.origX = this.cp1.x;
                    this.origY = this.cp1.y;
                    console.log('CP2 is now selected');
                    console.log(`Starting @ x: ${this.origX} and y: ${this.origY}`);
                }
                this.contextDraft.beginPath();
                this.contextDraft.moveTo(this.origX, this.origY);
                this.drawDraft(coord[0],coord[1]);
                this.drawCPDraft(this.origX, this.origY);
                this.drawCPDraft(coord[0], coord[1]);
            }
        }      
    }

    onDragging(coord,event){
        if (!this.finish){
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.origX ,this.origY);
            this.drawDraft(coord[0],coord[1]);
            this.prevCoord = {x:coord[0], y:coord[1]};
            if(this.phase_adjust){
                //draw 2 control points
                this.drawCPDraft(this.origX, this.origY);
                this.drawCPDraft(coord[0], coord[1]);
            }
        }
    }
    onMouseMove(){}
    onMouseUp(coord, event){
        if (!this.finish){
            //draw the final version on the draft page and the 2 cp
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.origX ,this.origY);
            this.drawDraft(coord[0],coord[1]);
            /*
            if not phase adjust stage then just set initial cp1 & 2 coord,
            else check to see if cp1 was clicked or cp2 was clicked then update the new coordinate
            */
            if (!this.phase_adjust){
                this.cp1 = {x: this.origX, y: this.origY};
                this.cp2 = {x: coord[0], y: coord[1]};
                this.phase_adjust = true;
                $('#cancel').show();
            } else{
                if (this.cp1_clicked){
                    this.cp1 = {x: coord[0], y: coord[1]};
                } else{
                    this.cp2 = {x: coord[0], y: coord[1]};
                }
                //Resetting CP1 and CP2 test
                this.cp1_clicked = false;
                this.cp2_clicked = false;
            }
            //draw 2 control points
            this.drawCPDraft(this.cp1.x, this.cp1.y);
            this.drawCPDraft(this.cp2.x, this.cp2.y);
        } else{
            //reset all boolean
            this.finish = this.phase_adjust = this.cp1_clicked =  this.cp2_clicked = false;
            //clear draft canvas and print on real canvas
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            this.contextReal.beginPath();
            this.contextReal.moveTo(this.cp1.x ,this.cp1.y);
            this.contextReal.lineTo(this.cp2.x,this.cp2.y);
            this.contextReal.closePath();
            this.contextReal.stroke();
            this.canvas_log.saveState();   
            $('#cancel').hide();
        }
    }

    onMouseLeave(){
        //connect the previous point to the original
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.origX ,this.origY);
        this.drawDraft(this.prevCoord.x,this.prevCoord.y);
        //Same as mouse up update the coord based on phase adjust or not
        if (!this.phase_adjust){
            this.cp1 = {x: this.origX, y: this.origY};
            this.cp2 = {x: this.prevCoord.x, y: this.prevCoord.y};
        }else{
            if (this.cp1_clicked){
                this.cp1 = {x: this.prevCoord.x, y: this.prevCoord.y};
            } else{
                this.cp2 = {x: this.prevCoord.x, y: this.prevCoord.y};
            }
            //draw 2 control points
            this.drawCPDraft(this.cp1.x, this.cp1.y);
            this.drawCPDraft(this.cp2.x, this.cp2.y);
            console.log(`On Leave: cp1 is ${JSON.stringify(this.cp1)}`);
            console.log(`On Leave: cp2 is ${JSON.stringify(this.cp2)}`);
        }
    }

    onMouseEnter(){}
    onFinish(){}
    onCancel(){
        this.finish = this.phase_adjust = this.cp1_clicked =  this.cp2_clicked = false;
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
            this.contextDraft.moveTo(this.cp1.x ,this.cp1.y);
            this.drawDraft(this.cp2.x,this.cp2.y);

            //draw 2 control points
            this.drawCPDraft(this.cp1.x, this.cp1.y);
            this.drawCPDraft(this.cp2.x, this.cp2.y);
        }
    }
    onPrint(){}
    //class internal method
    drawDraft(x,y){
        this.contextDraft.lineTo(x,y);
        this.contextDraft.moveTo(x,y);
        this.contextDraft.closePath();
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

    between(test, num1, num2){
        return test >= num1 && test <= num2;
    }

    checkCP(x,y){
        if ((this.between(x,this.cp1.x - this.cp_size/2, this.cp1.x + this.cp_size/2))
            && (this.between(y,this.cp1.y - this.cp_size/2, this.cp1.y + this.cp_size/2))){
            this.cp1_clicked = true;
            console.log('CP1 was clicked');
        } else if ((this.between(x,this.cp2.x - this.cp_size/2, this.cp2.x + this.cp_size/2))
                && (this.between(y,this.cp2.y - this.cp_size/2, this.cp2.y + this.cp_size/2))){
            this.cp2_clicked = true;
            console.log('CP2 was clicked');
        } else{
            //if the mouse is not clicked inside the circle then end phase adjust and cancel
            this.finish = true;
        }
        if (this.cp1_clicked && this.cp2_clicked){
            //this prevent confusion if 2 circle are overlapping each other
            this.cp2_clicked = false;  
        }
    }
    
}
