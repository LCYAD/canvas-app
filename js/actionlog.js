class ActionLog{
    constructor(contextReal){
        this.context = contextReal;
        this.undo_log = [];
        this.redo_log = [];
        this.currentState = this.context.getImageData(0,0,canvasReal.width, canvasReal.height);
    }

    saveState(){
        /*
            push the get image data for the Real Canvas into the array
            if it is larger than 20, remove the lastest item in the array then push the new one in it
        */
        if (this.undo_log.length> 20){this.log.slice(1, this.undo_log.length);}
        this.undo_log.push(this.currentState);
        this.currentState = this.context.getImageData(0,0,canvasReal.width, canvasReal.height);
        this.redo_log = [];
        console.log(this.undo_log.length);
    }

    undo(){
        if (this.undo_log.length != 0){
            this.redo_log.push(this.currentState);
            this.currentState = this.undo_log.pop();
            this.context.save();
            this.context.fillStyle = "#FFFFFF";
            this.context.fillRect(0,0,$('#canvas-real').width(), $('#canvas-real').height());
            this.context.fill();
            this.context.restore();
            this.context.putImageData(this.currentState, 0, 0);
            console.log(this.undo_log.length);
            console.log(this.redo_log.length);
        }
    }   

    redo(){
        if (this.redo_log.length != 0){
            this.undo_log.push(this.currentState);
            this.currentState = this.redo_log.pop();
            this.context.save();
            this.context.fillStyle = "#FFFFFF";
            this.context.fillRect(0,0,$('#canvas-real').width(), $('#canvas-real').height());
            this.context.fill();
            this.context.restore();
            this.context.putImageData(this.currentState, 0, 0);
            console.log(this.undo_log.length);
            console.log(this.redo_log.length);
        }
    }

    resetLog(){
        this.undo_log = [];
        this.redo_log = [];
        this.currentState = this.context.getImageData(0,0,canvasReal.width, canvasReal.height);
    }
}


