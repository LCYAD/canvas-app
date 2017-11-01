var flat = new Image(10,20);
flat.src = 'assets/img/slash.png';

function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
    return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

class BoardEdge extends PaintFunction{

    constructor(contextReal,contextDraft,canvas_log){
        super();
        this.context = contextReal; 
        this.lastPoint = {};
        this.currentPoint = {};
        this.isDrawing = false;
        this.canvas_log = canvas_log;
        
    }
    
    onMouseDown(coord,event){  
        this.isDrawing = true;
        this.lastPoint = { x: coord[0], y: coord[1] };
        // this.context.drawImage(img,coord[0] ,coord[1], 20, 50)
    }

    onDragging(coord,event){
        if (!this.isDrawing) return;

        this.currentPoint = { x: coord[0], y: coord[1] };
        let dist = distanceBetween(this.lastPoint, this.currentPoint);
        let angle = angleBetween(this.lastPoint, this.currentPoint);
        // for (var i = 0; i < dist; i++) {
        //     let x = this.lastPoint.x + (Math.sin(angle) * i);
        //     let y = this.lastPoint.y + (Math.cos(angle) * i);
                    

        for (var i = 0; i < dist; i++) {
            let x = this.lastPoint.x  + (Math.sin(angle) * i);
            let y = this.lastPoint.y  + (Math.cos(angle) * i);            
            // this.context.scale(2,2);
            this.context.drawImage(flat,x ,y, 20, 50);
            //drawImage(image, dx, dy, dw, dh) dw dh = [pen size]
        }
        this.lastPoint = this.currentPoint
    }

    onMouseMove(){}
    onMouseUp(coord,event,canvas_log){ 
        this.canvas_log.saveState()       
    }
    onMouseLeave(){}
    onMouseEnter(){}


}