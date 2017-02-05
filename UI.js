function UI(intersectionAngles, obstacles, circle){
	this.intersectionAngles = intersectionAngles;
	this.obstacles = obstacles;
	this.circle = circle;
	this.configureSpaceCanvas = document.getElementById("configure-space");
	this.configureSpaceCanvasCtx = this.configureSpaceCanvas.getContext("2d");
	for(var i = 0; i < this.intersectionAngles.length; i++){
		var p = this.intersectionAngles[i];
		this.configureSpaceCanvasCtx.fillStyle=p.color;
		this.configureSpaceCanvasCtx.fillRect(p.t1, p.t2, 1, 1);
	}
	this.drawObstacleSpace();
}

UI.prototype.drawObstacleSpace = function(){
	var boundary;
	var color = 'red';
	var obstacleSpaceCanvas = document.getElementById("obstacle-space");
	var obstacleSpaceCanvasCtx = obstacleSpaceCanvas.getContext("2d");
	var line;
	var scale = 45;

	obstacleSpaceCanvasCtx.beginPath();
	obstacleSpaceCanvasCtx.arc(scale * this.circle.center.x, scale * this.circle.center.y, scale * this.circle.radius, 0, 2 * Math.PI);
	obstacleSpaceCanvasCtx.fillStyle = 'rgba(255,255,255,0.1)';
	obstacleSpaceCanvasCtx.fill();
	obstacleSpaceCanvasCtx.strokeStyle = 'black';
	obstacleSpaceCanvasCtx.stroke();

	obstacleSpaceCanvasCtx.fillStyle='black';
	obstacleSpaceCanvasCtx.fillRect(scale * this.circle.center.x, scale * this.circle.center.y, 5, 5);

	for(var i =0; i < this.obstacles.length; i++){
		obstacleSpaceCanvasCtx.beginPath();
		boundary = this.obstacles[i].boundary;
		color = this.obstacles[i].color;
		for(var j = 0; j < boundary.length; j++){
			line = boundary[j];
			obstacleSpaceCanvasCtx.moveTo( scale * line.P1.x, scale * line.P1.y);
			obstacleSpaceCanvasCtx.strokeStyle=color;
			obstacleSpaceCanvasCtx.lineTo( scale * line.P2.x, scale * line.P2.y);
			obstacleSpaceCanvasCtx.stroke();
		}
		obstacleSpaceCanvasCtx.closePath();
	}
}

module.exports = UI;