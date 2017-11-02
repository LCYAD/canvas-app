class DrawingEllipse extends PaintFunction{
    constructor(contextReal,contextDraft, canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;  
        this.canvas_log = canvas_log;
        this.startpt = {x:0, y:0};
        this.endpt = {x:0, y:0};
        this.prevCoord = {x:0, y:0};
        this.cp_size = 20;  //setting standard size of the control points
        this.phase_adjust = false;
        this.dragpt;
        this.finish = false;
        this.cornerCP = {1:{x:0,y:0},2:{x:0,y:0},3:{x:0,y:0},4:{x:0,y:0}};
        //this.midCP = {1:{x:0,y:0},2:{x:0,y:0},3:{x:0,y:0},4:{x:0,y:0}};  <-Mid point is not implemented
        this.centre_pt = {x:0, y:0};
        this.degree_current = 0;
        this.ellipseWidth = 0;
        this.ellipseHeight = 0;
        this.border = true;
        this.fill = false;
        this.move = false;
        this.rotation = 0;      
    }
    
    onMouseDown(coord,event){
        //setting style
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = rgbaColor;
        this.contextDraft.lineJoin = this.contextReal.lineJoin = "round";
        this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
        this.contextDraft.fillStyle = this.contextReal.fillStyle = "#f44";
        this.rotation  = parseInt($("#rotate_field").val()) || 0;
        //check to see the phase adjust has started or not
        if (!this.phase_adjust){
            //to begin, set all points to be the same
            this.startpt = {x:coord[0], y:coord[1]};
            this.endpt = {x:coord[0], y:coord[1]};
        } else{
            this.checkCP(coord[0], coord[1]);
            this.endpt = {x:coord[0], y:coord[1]};
        }
        if (!this.finish && !this.move){
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.createCP();
            this.drawEllipse();
        } else if (this.move){
            this.prevCoord = {x:coord[0], y:coord[1]};
        }
    }

    onDragging(coord,event){
        this.endpt = {x:coord[0], y:coord[1]};
        if (!this.finish && !this.move){
        
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.createCP();
            this.drawEllipse();
            //this.drawLine();
        } else if (this.move){
            this.moveEllipse();
            this.prevCoord = {x:coord[0], y:coord[1]};
        }
    }

    onMouseMove(){}
    onMouseUp(coord){
        this.endpt = {x:coord[0], y:coord[1]};
        this.prevCoord = {x:coord[0], y:coord[1]};
        if (!this.finish && !this.move){ 
            if (!this.phase_adjust){
                this.phase_adjust = true;
                $('#cancel').show();
                $('#rotate-slider-bar').show();
                $('#print').show();
            }
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.createCP();
            this.drawEllipse();
            //this.drawLine();
            
        } else if (this.move){
            this.moveEllipse();
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.move = false;
        } else{
            console.log('ending..')
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            //draw the points on the real canvas
            this.contextReal.beginPath();
            this.contextReal.ellipse(this.centre_pt.x, this.centre_pt.y, this.ellipseWidth, this.ellipseHeight, 
                                        (this.rotation)*Math.PI/180, 0, 2*Math.PI);
            if (this.border){this.contextReal.stroke();} //draw border if it is choosed
            if (this.fill){this.contextReal.fill();} //fill rect if it is choosed
            this.canvas_log.saveState();
            //reset all parameter
            this.finish = this.phase_adjust = this.move = false;
            this.border = true;
            this.fill = false;
            //hide cancel and rotation panel
            $('#cancel').hide();
            $('#rotate-slider-bar').hide();
            $('#print').hide();
        }
        
    }
    onMouseLeave(){
        this.endpt = {x:this.prevCoord.x, y:this.prevCoord.y};
        if (!this.finish && !this.move){
            this.createCP();
            this.drawEllipse();
        }
    }
    onMouseEnter(){}
    onFinish(){}
    onCancel(){
        console.log('cancelling');
        this.finish = this.phase_adjust = this.move = false;
        this.border = true;
        this.fill = false;
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        $('#cancel').hide();
        $('#print').hide();
        $('#rotate-slider-bar').hide();
    }
    onChange(){
        if (this.phase_adjust){
            //refresh setting
            this.contextDraft.strokeStyle = this.contextReal.strokeStyle = rgbaColor;
            this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
            //redraw curve
            this.drawEllipse();
        }
    }
    onPrint(){
        //print a copy onto the real canvas and move the curve and control points to the right and down 10px
        this.contextReal.beginPath();
        this.contextReal.ellipse(this.centre_pt.x, this.centre_pt.y, this.ellipseWidth, this.ellipseHeight, 
                                    (this.rotation)*Math.PI/180, 0, 2*Math.PI);
        if (this.border){this.contextReal.stroke();} //draw border if it is choosed
        if (this.fill){this.contextReal.fill();} //fill rect if it is choosed
        this.canvas_log.saveState();

        //clear the Draft canvas and redraw with new poistion
        this.cornerCP = {   1: {x: this.cornerCP['1'].x + 10 , y: this.cornerCP['1'].y + 10},
                            2: {x: this.cornerCP['2'].x + 10 , y: this.cornerCP['2'].y + 10},
                            3: {x: this.cornerCP['3'].x + 10 , y: this.cornerCP['3'].y + 10},
                            4: {x: this.cornerCP['4'].x + 10 , y: this.cornerCP['4'].y + 10}};
        this.centre_pt = {x: this.centre_pt.x + 10 , y: this.centre_pt.y + 10};
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.drawEllipse();
        //console.log(`Finished: ${this.finish}`);
        //console.log(`Phase 2: ${this.phase_adjust}`);
    }
    onRotate(degree){
        let degree_change = degree - this.degree_current;
        this.degree_current = degree;
        this.rotation = degree;
        this.cornerCP = {   1: this.rotateCoord({x: this.cornerCP['1'].x - this.centre_pt.x, y: this.cornerCP['1'].y - this.centre_pt.y}, degree_change),
                            2: this.rotateCoord({x: this.cornerCP['2'].x - this.centre_pt.x, y: this.cornerCP['2'].y - this.centre_pt.y}, degree_change),
                            3: this.rotateCoord({x: this.cornerCP['3'].x - this.centre_pt.x, y: this.cornerCP['3'].y - this.centre_pt.y}, degree_change),
                            4: this.rotateCoord({x: this.cornerCP['4'].x - this.centre_pt.x, y: this.cornerCP['4'].y - this.centre_pt.y}, degree_change)};
        this.drawEllipse();
        //console.log(JSON.stringify(this.cornerCP));
    }

    //internal method
    createCP(){
        /*
            1. find the center point
            2. determine the start and end coordinate
            3. unrotate the start and end to its unrotated state.
            4. generate the other 2 points
            5. rotate all the points
        */
        this.rotation = parseInt($("#rotate_field").val()) || 0;

        this.centre_pt = {x: this.startpt.x + (this.endpt.x-this.startpt.x)/2, y: this.startpt.y + (this.endpt.y-this.startpt.y)/2};
        let unrotated_start = this.rotateCoord({x: this.startpt.x - this.centre_pt.x, y: this.startpt.y - this.centre_pt.y}, this.rotation*-1);
        let unrotated_end = this.rotateCoord({x: this.endpt.x - this.centre_pt.x, y: this.endpt.y - this.centre_pt.y}, this.rotation*-1);

        //update the new ellipse width and height
        this.ellipseWidth = Math.abs(unrotated_end.x - unrotated_start.x)/2;
        this.ellipseHeight = Math.abs(unrotated_end.y - unrotated_start.y)/2;


        if (!this.phase_adjust){
            this.cornerCP = {   1: this.rotateCoord({x: this.startpt.x - this.centre_pt.x, y: this.startpt.y - this.centre_pt.y}, this.rotation),
                                2: this.rotateCoord({x: this.endpt.x - this.centre_pt.x, y: this.startpt.y - this.centre_pt.y}, this.rotation),
                                3: this.rotateCoord({x: this.endpt.x - this.centre_pt.x, y: this.endpt.y - this.centre_pt.y}, this.rotation),
                                4: this.rotateCoord({x: this.startpt.x - this.centre_pt.x, y: this.endpt.y - this.centre_pt.y}, this.rotation)};
        } else{
            if (this.dragpt === 1){
                this.cornerCP = {1: this.endpt,
                                 2: this.rotateCoord({x: unrotated_end.x - this.centre_pt.x, y: unrotated_start.y - this.centre_pt.y}, this.rotation),
                                 3: this.startpt,
                                 4: this.rotateCoord({x: unrotated_start.x - this.centre_pt.x, y: unrotated_end.y - this.centre_pt.y}, this.rotation)};
            } else if (this.dragpt === 2){
                this.cornerCP = {1: this.rotateCoord({x: unrotated_start.x - this.centre_pt.x, y: unrotated_end.y - this.centre_pt.y}, this.rotation),
                                 2: this.endpt,
                                 3: this.rotateCoord({x: unrotated_end.x - this.centre_pt.x, y: unrotated_start.y - this.centre_pt.y}, this.rotation),
                                 4: this.startpt};
            } else if (this.dragpt === 3){
                this.cornerCP = {1: this.startpt,
                                 2: this.rotateCoord({x: unrotated_end.x - this.centre_pt.x, y: unrotated_start.y - this.centre_pt.y}, this.rotation),
                                 3: this.endpt,
                                 4: this.rotateCoord({x: unrotated_start.x - this.centre_pt.x, y: unrotated_end.y - this.centre_pt.y}, this.rotation)};
            } else if (this.dragpt === 4){
                this.cornerCP = {1: this.rotateCoord({x: unrotated_end.x - this.centre_pt.x, y: unrotated_start.y - this.centre_pt.y}, this.rotation),
                                 2: this.startpt,
                                 3: this.rotateCoord({x: unrotated_start.x - this.centre_pt.x, y: unrotated_end.y - this.centre_pt.y}, this.rotation),
                                 4: this.endpt};
            }
        }  
    }

    rotateCoord(coord, degree){
        // the coord x and y will be rotated then returned with the added centre_pt coordinate
        let rotateRAD = (degree)*Math.PI/180;
            return {x: coord.x*Math.cos(rotateRAD) - coord.y*Math.sin(rotateRAD) + this.centre_pt.x,
                    y: coord.x*Math.sin(rotateRAD) + coord.y*Math.cos(rotateRAD) + this.centre_pt.y};
    }

    /*drawLine(){
        this.contextDraft.save();
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "red";
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.startpt.x, this.startpt.y);
        this.contextDraft.lineTo(this.endpt.x, this.endpt.y);
        this.contextDraft.stroke();
        this.contextDraft.restore();
    }*/

    moveEllipse(){
        //get the different between end point and prevCoord then move all 4 corners accordingly
        console.log(`Moving from ${JSON.stringify(this.prevCoord)} to ${JSON.stringify(this.endpt)} `);
        let x_change = this.endpt.x - this.prevCoord.x;
        let y_change = this.endpt.y - this.prevCoord.y;
        this.cornerCP = {   1: {x: this.cornerCP['1'].x + x_change , y: this.cornerCP['1'].y + y_change},
                            2: {x: this.cornerCP['2'].x + x_change , y: this.cornerCP['2'].y + y_change},
                            3: {x: this.cornerCP['3'].x + x_change , y: this.cornerCP['3'].y + y_change},
                            4: {x: this.cornerCP['4'].x + x_change , y: this.cornerCP['4'].y + y_change}};
        this.centre_pt = {x: this.centre_pt.x + x_change , y: this.centre_pt.y + y_change};
        this.drawEllipse();
    }

    drawEllipse(){
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);

        let rotateRAD = (this.rotation)*Math.PI/180;
        
        //use line to draw the perimeter of the rectangle
        this.contextDraft.beginPath();
        this.contextDraft.ellipse(this.centre_pt.x, this.centre_pt.y, this.ellipseWidth, this.ellipseHeight, rotateRAD, 0, 2*Math.PI);
        if (this.border){this.contextDraft.stroke();} //draw border if it is choosed
        if (this.fill){this.contextDraft.fill();} //fill rect if it is choosed
        
        //console.log(JSON.stringify(this.cornerCP));
        //console.log(JSON.stringify(this.midCP));

        //set initial style
        this.contextDraft.save();

        //control point style set
        this.contextDraft.lineWidth = this.contextReal.lineWidth = 2;
        this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "black";
        this.contextDraft.setLineDash([2, 4]);

        //print out the corner control point
        this.drawCPDraft(this.cornerCP['1'].x, this.cornerCP['1'].y);
        this.drawCPDraft(this.cornerCP['2'].x, this.cornerCP['2'].y);
        this.drawCPDraft(this.cornerCP['3'].x, this.cornerCP['3'].y);
        this.drawCPDraft(this.cornerCP['4'].x, this.cornerCP['4'].y);

        /*print out the middle control point
        this.drawCPDraft(this.midCP['1'].x, this.midCP['1'].y);
        this.drawCPDraft(this.midCP['2'].x, this.midCP['2'].y);
        this.drawCPDraft(this.midCP['3'].x, this.midCP['3'].y);
        this.drawCPDraft(this.midCP['4'].x, this.midCP['4'].y);*/
        
        //Draw centre point - this.drawCPDraft(this.centre_pt.x, this.centre_pt.y);
        
        //Draw the border for the 4 control points
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.cornerCP['1'].x, this.cornerCP['1'].y);
        this.contextDraft.lineTo(this.cornerCP['2'].x, this.cornerCP['2'].y);
        this.contextDraft.lineTo(this.cornerCP['3'].x, this.cornerCP['3'].y);
        this.contextDraft.lineTo(this.cornerCP['4'].x, this.cornerCP['4'].y);
        this.contextDraft.closePath();
        this.contextDraft.stroke();
        

        //restore previous setting
        this.contextDraft.restore();
    }

    drawCPDraft(x, y){
        //draw circle on current mouse point
        this.contextDraft.beginPath();
        this.contextDraft.arc(x, y, this.cp_size/2, 0, 2*Math.PI);
        this.contextDraft.stroke();
    }


    between(test, num1, num2){
        return test >= num1 && test <= num2;
    }

    checkCP(x,y){
        // check which point is clicked and the diagonal becomes the start point
        if ((this.between(x,this.cornerCP['1'].x - this.cp_size/2, this.cornerCP['1'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['1'].y - this.cp_size/2, this.cornerCP['1'].y+ this.cp_size/2))){
            this.dragpt = 1;
            this.startpt = this.cornerCP['3'];
            console.log('Corner 1 was clicked');
        } else if ((this.between(x,this.cornerCP['2'].x - this.cp_size/2, this.cornerCP['2'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['2'].y - this.cp_size/2, this.cornerCP['2'].y+ this.cp_size/2))){
            this.dragpt = 2;
            this.startpt = this.cornerCP['4'];
            console.log('Corner 2 was clicked');
        } else if ((this.between(x,this.cornerCP['3'].x - this.cp_size/2, this.cornerCP['3'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['3'].y - this.cp_size/2, this.cornerCP['3'].y+ this.cp_size/2))){
            this.dragpt = 3;
            this.startpt = this.cornerCP['1'];
            console.log('Corner 3 was clicked');
        } else if ((this.between(x,this.cornerCP['4'].x - this.cp_size/2, this.cornerCP['4'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['4'].y - this.cp_size/2, this.cornerCP['4'].y+ this.cp_size/2))){
            this.dragpt = 4;
            this.startpt = this.cornerCP['2'];
            console.log('Corner 4 was clicked');
        }/* Mid-point is skipped for the time being
        
            else if ((this.between(x,this.midCP['1'].x - this.cp_size/2, this.midCP['1'].x + this.cp_size/2))
            && (this.between(y,this.midCP['1'].y - this.cp_size/2, this.midCP['1'].y+ this.cp_size/2))){
            this.dragpt = 'start';
            console.log('Middle 1 was clicked');
        } else if ((this.between(x,this.midCP['2'].x - this.cp_size/2, this.midCP['2'].x + this.cp_size/2))
            && (this.between(y,this.midCP['2'].y - this.cp_size/2, this.midCP['2'].y+ this.cp_size/2))){
            this.dragpt = 'start';
            console.log('Middle 2 was clicked');
        } else if ((this.between(x,this.midCP['3'].x - this.cp_size/2, this.midCP['3'].x + this.cp_size/2))
            && (this.between(y,this.midCP['3'].y - this.cp_size/2, this.midCP['3'].y+ this.cp_size/2))){
            this.dragpt = 'start';
            console.log('Middle 3 was clicked');
        } else if ((this.between(x,this.midCP['4'].x - this.cp_size/2, this.midCP['4'].x + this.cp_size/2))
            && (this.between(y,this.midCP['4'].y - this.cp_size/2, this.midCP['4'].y+ this.cp_size/2))){
            this.dragpt = 'start';
            console.log('Middle 4 was clicked');
        }*/ else {
            //draw the path out and use isPointInPath
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.cornerCP['1'].x, this.cornerCP['1'].y);
            this.contextDraft.lineTo(this.cornerCP['2'].x, this.cornerCP['2'].y);
            this.contextDraft.lineTo(this.cornerCP['3'].x, this.cornerCP['3'].y);
            this.contextDraft.lineTo(this.cornerCP['4'].x, this.cornerCP['4'].y);
            this.contextDraft.closePath();
            if (this.contextDraft.isPointInPath(x,y)){
                this.move = true;
                console.log('The box is ready to be moved');
            } else{
                console.log('Ready to end the value');
                //if the mouse is not clicked inside the circle then end phase adjust and cancel
                this.finish = true;
            }
        }
    }
}