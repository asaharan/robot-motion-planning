(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var Point = require('./Point');
function Line(startPoint, endPoint){
	this.P1 = startPoint;
	this.P2 = endPoint;
	this.isVertical = ( this.P1.x == this.P2.x );
	this.isHorizontal = ( this.P1.y == this.P2.y );

	this.A = this.P2.y - this.P1.y;
	this.B = -( this.P2.x - this.P1.x );
	this.C = this.P1.x * ( this.A ) + this.P1.y * this.B;
	if(this.A < 0){
		this.A = this.A * -1;
		this.B = this.B * -1;
		this.C = this.C * -1;
	}
	if(this.A !=0){
		this.B = this.B / this.A;
		this.C = this.C / this.A;
		this.A = 1;
	}
}

/*
* check if point lies on segment assuming that point lies on line
*/
Line.prototype.doesPointLiesOnSegment = function(point){
	if(this.isVertical){
		if(Math.min(this.P1.y, this.P2.y) <= point.y && Math.max(this.P1.y, this.P2.y) >= point.y ){
			return true;
		}
		return false;
	}
	if(Math.min(this.P1.x, this.P2.x) <= point.x && Math.max(this.P1.x, this.P2.x) >= point.x ){
		return true;
	}
	return false;
}

Line.prototype.getPointOfIntersection = function(line){
	var x = 1.0*(line.B * this.C - this.B * line.C) / (line.B * this.A - this.B * line.A);
	var y = 1.0*(line.A * this.C - this.A * line.C) / (line.A * this.B - this.A * line.B);
	return new Point(x,y);
}

Line.prototype.areParallel = function(line){
	if(this.A ==0 && line.A == 0){//horizontal line
		return true;
	}
	if(this.B ==0 && line.B == 0){//vertical line
		return true;
	}
	if( this.B == line.B ){
		return true;
	}
	return false;
}

Line.prototype.areCoincident = function(line){
	if(this.areParallel(line)){
		if(this.C == line.C){
			return true;
		}
	}
	return false;
}

Line.prototype.doesIntersect = function(line){
	if(this.areParallel(line)){
		if(this.areCoincident(line)){
			if(this.doesPointLiesOnSegment(line.P1)){
				return true;
			}
		}
		return false;
	}
	var pointOfIntersection = this.getPointOfIntersection(line);
	return (this.doesPointLiesOnSegment(pointOfIntersection) && line.doesPointLiesOnSegment(pointOfIntersection));
}

module.exports = Line;

},{"./Point":3}],3:[function(require,module,exports){
function Point(x,y){
	this.x = x;
	this.y = y;
}

module.exports = Point;

},{}],4:[function(require,module,exports){
var Line = require('./Line');
function Polygon(points, color){
	if(points.length < 3){
		throw new Error("Polygon needs atleast 3 points");
	}
	this.points = points;
	this.boundary = [];
	this.color = color;
	for(var i = 0; i < this.points.length; i++){
		if(i == this.points.length - 1){//last point and first point
			this.boundary.push(new Line(this.points[i], this.points[0]));
			continue;
		}
		this.boundary.push(new Line(this.points[i], this.points[i+1]));
	}
}
Polygon.prototype.doesIntersect = function(lines){
	for(var i = 0; i < this.boundary.length; i++){
		for(var j = 0; j < lines.length; j++){
			if(lines[j].doesIntersect(this.boundary[i])){
				return true;
			}
		}
	}
	return false;
}

module.exports = Polygon;
},{"./Line":2}],5:[function(require,module,exports){
var UI = require('./UI');
var Line = require('./lib/Line');
var Point = require('./lib/Point');
var Polygon = require('./lib/Polygon');
var l1 = 1.5, l2 = 2;
var arm;
var P1 = new Point(4,4);
var P2;
var P3;
var line1;
var line2;
var t1 = 0, t2 = 0, increment = 0.5;
var intersectionAngles = [];
function configureSpace(){
	function cos(degrees){
		return Math.cos(degrees*Math.PI / 180);
	}
	function sin(degrees){
		return Math.sin(degrees*Math.PI / 180);
	}
	for(t1 = 0; t1 < 360; t1 += increment){
		for(t2 = 0; t2 < 360; t2 += increment){
			P2 = new Point( P1.x + l1*cos(t1), P1.y + l1*sin(t1) );
			P3 = new Point( P1.x + l1*cos(t1) + l2 * cos(t1 + t2), P1.y + l1*sin(t1) + l2 * sin(t1+t2)  );
			line1 = new Line(P1,P2);
			line2 = new Line(P2,P3);
			arm = [line1, line2];
			if(RO.doesIntersect(arm)){
				intersectionAngles.push({'t1':t1, 't2':t2, color:RO.color});
			}
			if(SO.doesIntersect(arm)){
				intersectionAngles.push({'t1':t1, 't2':t2, color:SO.color});
			}
			if(TO.doesIntersect(arm)){
				intersectionAngles.push({'t1':t1, 't2':t2, color:TO.color});
			}
		}	
	}
}

//SquareObstacle - SO
var squareCorners = [new Point(1,8), new Point(1,7), new Point(4,7), new Point(4,8)];
var SO = new Polygon(squareCorners,'#f44336');
var triangleCorners = [new Point(5,4), new Point(5,1), new Point(10,7)]
var TO = new Polygon(triangleCorners,'#03a9f4');
var randomCorners = [new Point(0,0), new Point(2.5,2), new Point(2.5,2.5), 
					 new Point(1,2.5), new Point(2.5,3), new Point(0,3)]
var RO = new Polygon(randomCorners, '#4caf50');

configureSpace();
var ui = new UI(intersectionAngles, [TO, SO, RO], {center:{x:P1.x, y:P1.y}, radius:l1+l2});
},{"./UI":1,"./lib/Line":2,"./lib/Point":3,"./lib/Polygon":4}]},{},[5]);
