class Draw_S_Line2 extends PaintFunction{
    constructor(contextReal,contextDraft,contextDraft2){
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;    
        this.contextDraft2 = contextDraft2;
        this.cp1 = {};
        this.cp2 = {};
        this.draft2 = false;                
    }
    
    onMouseDown(coord,event){
        if (!this.draft2){
            this.contextDraft.strokeStyle = this.contextDraft2.strokeStyle = this.contextReal.strokeStyle = "#df4b26";
            this.contextDraft.lineJoin = this.contextDraft2.lineJoin = this.contextReal.lineJoin = "round";
            this.contextDraft.lineWidth = this.contextDraft2.lineWidth = this.contextReal.lineWidth = parseInt($("#size_field").val());
            this.origX = coord[0];
            this.origY = coord[1];
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(coord[0],coord[1]);
            this.drawDraft(coord[0],coord[1]);
        } else{ //Set the new coordinate to the moved control point then draw link
            this.contextDraft2.clearRect(0,0,canvasDraft2.width,canvasDraft2.height);
            if (event.target.id === 'control_pt_1'){
                this.origX = this.cp2.left;
                this.origY = this.cp2.top;
                this.cp1.left = coord[0]+($(`#${event.target.id}` ).width()/2);
                this.cp1.top = coord[1]+($(`#${event.target.id}` ).height()/2);
            } else{
                this.origX = this.cp1.left;
                this.origY = this.cp1.top;
                this.cp2.left = coord[0]+($(`#${event.target.id}` ).width()/2);
                this.cp2.top = coord[1]+($(`#${event.target.id}` ).height()/2);
            }
            this.contextDraft2.beginPath();
            this.contextDraft2.moveTo(this.origX ,this.origY);
            this.drawDraft2(coord[0]+($(`#${event.target.id}` ).width()/2),coord[1]+($(`#${event.target.id}` ).height()/2));
        }      
    }
    onDragging(coord,event){
        if (!this.draft2){
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            this.contextDraft.beginPath();
            this.contextDraft.moveTo(this.origX ,this.origY);
            this.drawDraft(coord[0],coord[1]);
        } else{
            this.contextDraft2.clearRect(0,0,canvasDraft2.width,canvasDraft2.height);
            let tempWidth = ($(`#${event.target.id}`).width()/2);
            let tempHeight = ($(`#${event.target.id}`).height()/2)
            if (event.target.id === 'control_pt_1'){
                this.origX = this.cp2.left;
                this.origY = this.cp2.top;
                this.cp1.left = coord[0]+ tempWidth;
                this.cp1.top = coord[1]+ tempHeight;
            } else{
                this.origX = this.cp1.left;
                this.origY = this.cp1.top;
                this.cp2.left = coord[0]+tempWidth ;
                this.cp2.top = coord[1]+tempHeight;
            }
            this.contextDraft2.beginPath();
            this.contextDraft2.moveTo(this.origX ,this.origY);
            this.drawDraft2(coord[0]+tempWidth ,coord[1]+tempHeight);
            
        }
    }

    onMouseMove(){}
    onMouseUp(coord, event){
        if (!this.draft2){
            //closing Draft Panel and showing Draft 2 panel (such that all listener for draft will not work)
            this.contextDraft.clearRect(0,0,canvasDraft.width,canvasDraft.height);
            $('#canvas-draft').hide();
            $('#canvas-draft2').show();
            $('#finish').show();
            $('#cancel').show();
            this.draft2 = true;
            this.contextDraft2.beginPath();
            this.contextDraft2.moveTo(this.origX ,this.origY);
            this.contextDraft2.lineTo(coord[0],coord[1]);
            this.contextDraft2.moveTo(coord[0],coord[1]);
            this.contextDraft2.closePath();
            this.contextDraft2.stroke();
            this.cp1 = {left: this.origX, top: this.origY};
            this.cp2 = {left: coord[0], top: coord[1]};       
            $("#control_pt_1").show().offset({top: this.cp1.top+$('#canvas-draft2')[0].offsetTop-($( "#control_pt_1" ).height()/2), 
                                                left: this.cp1.left+$('#canvas-draft2')[0].offsetLeft-($( "#control_pt_1" ).width()/2)});
            $("#control_pt_2").show().offset({top: this.cp2.top+$('#canvas-draft2')[0].offsetTop-($( "#control_pt_2" ).height()/2), 
                                                left: this.cp2.left+$('#canvas-draft2')[0].offsetLeft-($( "#control_pt_2" ).width()/2)});
        } else{
            this.contextDraft2.clearRect(0,0,canvasDraft2.width,canvasDraft2.height);
            if (event.target.id === 'control_pt_1'){
                this.origX = this.cp2.left;
                this.origY = this.cp2.top;
            } else{
                this.origX = this.cp1.left;
                this.origY = this.cp1.top;
            }
            this.contextDraft2.beginPath();
            this.contextDraft2.moveTo(this.origX ,this.origY);
            this.drawDraft2(coord[0]+($(`#${event.target.id}`).width()/2),coord[1]+($(`#${event.target.id}`).height()/2));
        }
    }
    onMouseLeave(){}
    onMouseEnter(){}
    onFinish(){
        this.contextDraft2.clearRect(0,0,canvasDraft2.width,canvasDraft2.height);
        this.contextReal.beginPath();
        this.contextReal.moveTo(this.cp1.left ,this.cp1.top);
        this.contextReal.lineTo(this.cp2.left,this.cp2.top);
        this.contextReal.moveTo(this.cp2.left,this.cp2.top);
        this.contextReal.closePath();
        this.contextReal.stroke();
        $('#canvas-draft').show();
        $('#canvas-draft2').hide();
        $('#finish').hide();
        $('#cancel').hide();
        $("#control_pt_1").hide().offset({top: 0, left: 0});
        $("#control_pt_2").hide().offset({top: 0, left: 0});
        this.draft2 = false;
    }
    onCancel(){
        this.contextDraft2.clearRect(0,0,canvasDraft2.width,canvasDraft2.height);
        $('#canvas-draft').show();
        $('#canvas-draft2').hide();
        $('#finish').hide();
        $('#cancel').hide();
        $("#control_pt_1").hide().offset({top: 0, left: 0});
        $("#control_pt_2").hide().offset({top: 0, left: 0});
        this.draft2 = false;
    }

    //class internal method
    drawDraft(x,y){
        this.contextDraft.lineTo(x,y);
        this.contextDraft.moveTo(x,y);
        this.contextDraft.closePath();
        this.contextDraft.stroke();    
    }
    
    drawDraft2(x,y){
        this.contextDraft2.lineTo(x,y);
        this.contextDraft2.moveTo(x,y);
        this.contextDraft2.closePath();
        this.contextDraft2.stroke();    
    }
}
