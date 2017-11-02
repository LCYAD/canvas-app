class DrawingCircle2 extends PaintFunction{
    constructor(contextReal,contextDraft, canvas_log){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;
        this.canvas_log = canvas_log;
        this.endpt = {x:0, y:0};
        this.prevCoord = {x:0, y:0};
        this.cp_size = 20;  //setting standard size of the control points
        this.phase_adjust = false;
        this.dragpt;
        this.finish = false;
        this.cornerCP = {1:{x:0,y:0},2:{x:0,y:0},3:{x:0,y:0},4:{x:0,y:0}};
        //this.midCP = {1:{x:0,y:0},2:{x:0,y:0},3:{x:0,y:0},4:{x:0,y:0}};  <-Mid point is not implemented
        this.centre_pt = {x:0, y:0};
        this.radius= 0;
        this.border = true;
        this.fill = false;
        this.move = false;
        this.print = false;
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
            this.centre_pt = {x:coord[0], y:coord[1]};
            this.endpt = {x:coord[0], y:coord[1]};
        } else{
            this.checkCP(coord[0], coord[1]);
            if (this.dragpt === '1' || this.dragpt === '3' ){
                //only adjust the y coord
                this.endpt.y = coord[1];
            } else if (this.dragpt === '2' || this.dragpt === '4'){
                //only adjust the x coord
                this.endpt.x = coord[0];
            }
        }
        if (!this.finish && !this.move){
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.createCP();
            this.drawCircle();
            //this.drawLine();
        } else if (this.move){
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.drawCircle();
        }
    }

    onDragging(coord,event){
        this.endpt = {x:coord[0], y:coord[1]};
        if (!this.finish && !this.move){
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.createCP();
            this.drawCircle();
            //this.drawLine();
        } else if (this.move){
            this.moveCircle();
            this.prevCoord = {x:coord[0], y:coord[1]};
        }
    }

    onMouseMove(){}
    onMouseUp(coord){
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        this.endpt = {x:coord[0], y:coord[1]};
        this.prevCoord = {x:coord[0], y:coord[1]};
        if (!this.finish && !this.move){ 
            if (!this.phase_adjust){
                this.phase_adjust = true;
                $('#cancel').show();
                $('#print').show();
            }
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.createCP();
            this.drawCircle();
            //this.drawLine();
            
        } else if (this.move){
            this.moveCircle();
            this.prevCoord = {x:coord[0], y:coord[1]};
            this.move = false;
        } else{
            console.log('ending..')
            //draw the points on the real canvas
            this.contextReal.beginPath();
            this.contextReal.arc(this.centre_pt.x, this.centre_pt.y, this.radius, 0, 2*Math.PI);
            if (this.border){this.contextReal.stroke();} //draw border if it is choosed
            if (this.fill){this.contextReal.fill();} //fill rect if it is choosed
            this.canvas_log.saveState();
             //reset all parameter
             this.finish = this.phase_adjust = this.move = false;
             this.radius = this.dragpt = 0;
             this.border = true;
             this.fill = false;
             //hide cancel and rotation panel
             $('#cancel').hide();
             $('#print').hide();
        }
        
    }
    onMouseLeave(){
        this.endpt = {x:this.prevCoord.x, y:this.prevCoord.y};
        if (!this.finish && !this.move){
            this.createCP();
            this.drawCircle();
        }
    }
    onMouseEnter(){}
    onFinish(){}
    onCancel(){
        this.finish = this.phase_adjust = this.move = false;
        this.radius = this.dragpt = 0;
        this.border = true;
        this.fill = false;
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
        $('#cancel').hide();
        $('#print').hide();
    }
    onChange(){
        if (this.phase_adjust){
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            //refresh setting
            this.contextDraft.strokeStyle = this.contextReal.strokeStyle = "grey";
            this.contextDraft.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
            //redraw curve
            this.drawCircle();
        }
    }
    onPrint(){
        //print a copy onto the real canvas and move the curve and control points to the right and down 10px
        this.contextReal.beginPath();
        this.contextReal.arc(this.centre_pt.x, this.centre_pt.y, this.radius, 0, 2*Math.PI);
        if (this.border){this.contextReal.stroke();} //draw border if it is choosed
        if (this.fill){this.contextReal.fill();} //fill rect if it is choosed
        this.canvas_log.saveState();

        //clear the Draft canvas and redraw with new poistion
        this.cornerCP = {   1: {x: this.cornerCP['1'].x + 10 , y: this.cornerCP['1'].y + 10},
                            2: {x: this.cornerCP['2'].x + 10 , y: this.cornerCP['2'].y + 10},
                            3: {x: this.cornerCP['3'].x + 10 , y: this.cornerCP['3'].y + 10},
                            4: {x: this.cornerCP['4'].x + 10 , y: this.cornerCP['4'].y + 10}};
        this.centre_pt = {x: this.centre_pt.x + 10 , y: this.centre_pt.y + 10};
        this.print = true;
        this.drawCircle();
        //console.log(`Finished: ${this.finish}`);
        //console.log(`Phase 2: ${this.phase_adjust}`);
    }
    onRotate(){}

    //internal method
    createCP(){
        /*
            The 4 control points will be on the circle edge, and each control point can only expand the circle in one direction
            For example, the control point 1 can only move up and down (only take new y coordinate, x stays the same)
                         the control point 2 can only move left and right (only take new x coordinate, y stays the same)
                         the control point 3 can only move up and down (only take new y coordinate, x stays the same)
                         the control point 4 can only move left and right (only take new x coordinate, y stays the same)
            1. get the distance between the end point and centre point
            2. define the other 3 points
        */

        this.radius = Math.sqrt(Math.pow((this.endpt.y - this.centre_pt.y),2) + Math.pow((this.endpt.x - this.centre_pt.x),2));

        if (!this.phase_adjust){
            this.cornerCP = {   1: {x: this.centre_pt.x, y: this.centre_pt.y - this.radius},
                                2: {x: this.centre_pt.x + this.radius, y: this.centre_pt.y},
                                3: {x: this.centre_pt.x, y: this.centre_pt.y + this.radius},
                                4: {x: this.centre_pt.x - this.radius, y: this.centre_pt.y}};
        } else{
            //calculate the distance between dragging point and centre point then add them to the other 3 points
            if (this.dragpt === '1'){
                this.cornerCP = {1: {x: this.centre_pt.x, y: this.centre_pt.y - this.radius},
                                 2: {x: this.centre_pt.x + this.radius, y: this.centre_pt.y},
                                 3: {x: this.centre_pt.x, y: this.centre_pt.y + this.radius},
                                 4: {x: this.centre_pt.x - this.radius, y: this.centre_pt.y}};
            } else if (this.dragpt === '2'){
                this.cornerCP = {1: {x: this.centre_pt.x, y: this.centre_pt.y - this.radius},
                                 2: {x: this.centre_pt.x + this.radius, y: this.centre_pt.y},
                                 3: {x: this.centre_pt.x, y: this.centre_pt.y + this.radius},
                                 4: {x: this.centre_pt.x - this.radius, y: this.centre_pt.y}};
            } else if (this.dragpt === '3'){
                this.cornerCP = {1: {x: this.centre_pt.x, y: this.centre_pt.y - this.radius},
                                 2: {x: this.centre_pt.x + this.radius, y: this.centre_pt.y},
                                 3: {x: this.centre_pt.x, y: this.centre_pt.y + this.radius},
                                 4: {x: this.centre_pt.x - this.radius, y: this.centre_pt.y}};
            } else if (this.dragpt === '4'){
                this.cornerCP = {1: {x: this.centre_pt.x, y: this.centre_pt.y - this.radius},
                                 2: {x: this.centre_pt.x + this.radius, y: this.centre_pt.y},
                                 3: {x: this.centre_pt.x, y: this.centre_pt.y + this.radius},
                                 4: {x: this.centre_pt.x - this.radius, y: this.centre_pt.y}};
            }
        }  
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

    moveCircle(){
        //get the different between end point and prevCoord then move all 4 corners accordingly
        //console.log(`Moving from ${JSON.stringify(this.prevCoord)} to ${JSON.stringify(this.endpt)} `);
        let x_change = this.endpt.x - this.prevCoord.x;
        let y_change = this.endpt.y - this.prevCoord.y;
        this.cornerCP = {   1: {x: this.cornerCP['1'].x + x_change , y: this.cornerCP['1'].y + y_change},
                            2: {x: this.cornerCP['2'].x + x_change , y: this.cornerCP['2'].y + y_change},
                            3: {x: this.cornerCP['3'].x + x_change , y: this.cornerCP['3'].y + y_change},
                            4: {x: this.cornerCP['4'].x + x_change , y: this.cornerCP['4'].y + y_change}};
        this.centre_pt = {x: this.centre_pt.x + x_change , y: this.centre_pt.y + y_change};
        this.drawCircle();
    }

    drawCircle(){
        this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);

        //get radius if the radius is not moving
        if (!this.move && !this.print){
            this.radius = Math.sqrt(Math.pow((this.endpt.y - this.centre_pt.y),2) + Math.pow((this.endpt.x - this.centre_pt.x),2));
        }
        
        //use line to draw the perimeter of the rectangle
        this.contextDraft.beginPath();
        this.contextDraft.arc(this.centre_pt.x, this.centre_pt.y, this.radius, 0, 2*Math.PI)
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
        if (this.phase_adjust){
            this.drawCPDraft(this.cornerCP['1'].x, this.cornerCP['1'].y);
            this.drawCPDraft(this.cornerCP['2'].x, this.cornerCP['2'].y);
            this.drawCPDraft(this.cornerCP['3'].x, this.cornerCP['3'].y);
            this.drawCPDraft(this.cornerCP['4'].x, this.cornerCP['4'].y);
        } else {
            this.drawCPDraft(this.endpt.x, this.endpt.y);
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.centre_pt.x, this.centre_pt.y);
            this.contextDraft.lineTo(this.endpt.x, this.endpt.y);
            this.contextDraft.stroke();
        }
        

        //Draw centre point - this.drawCPDraft(this.centre_pt.x, this.centre_pt.y)
    
        //restore previous setting
        this.contextDraft.restore();
        this.print = false;
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
            this.dragpt = '1';
            this.endpt = this.cornerCP['1'];
            console.log('Corner 1 was clicked');
        } else if ((this.between(x,this.cornerCP['2'].x - this.cp_size/2, this.cornerCP['2'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['2'].y - this.cp_size/2, this.cornerCP['2'].y+ this.cp_size/2))){
            this.dragpt = '2';
            this.endpt = this.cornerCP['2'];
            console.log('Corner 2 was clicked');
        } else if ((this.between(x,this.cornerCP['3'].x - this.cp_size/2, this.cornerCP['3'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['3'].y - this.cp_size/2, this.cornerCP['3'].y+ this.cp_size/2))){
            this.dragpt = '3';
            this.endpt = this.cornerCP['3'];
            console.log('Corner 3 was clicked');
        } else if ((this.between(x,this.cornerCP['4'].x - this.cp_size/2, this.cornerCP['4'].x + this.cp_size/2))
            && (this.between(y,this.cornerCP['4'].y - this.cp_size/2, this.cornerCP['4'].y+ this.cp_size/2))){
            this.dragpt = '4';
            this.endpt = this.cornerCP['4'];
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
            this.contextDraft.arc(this.centre_pt.x, this.centre_pt.y, this.radius, 0, 2*Math.PI)
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