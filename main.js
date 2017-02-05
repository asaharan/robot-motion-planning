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
var t1 = 0, t2 = 0, increment = 1;
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