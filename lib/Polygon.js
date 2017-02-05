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