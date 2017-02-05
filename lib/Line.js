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
