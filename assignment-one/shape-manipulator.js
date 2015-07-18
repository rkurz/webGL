"use strict";

var shapeManipulator = new function () {
	var shape = [];
	var points = [];
	var lines = [];

	var initShape = function (shapeName) {
		if (shapeName == "Triangle")
			initTriangle();
		else if (shapeName == "Square")
			initSquare();
	}

	function initTriangle() {
		// shape = [
		// 		        vec2( 0, 0 ),
		// 		        vec2( -0.5,  0.5 ),
		// 		        vec2( -0.5, -0.5 )
		// 		   	];

		shape = [
		   [Math.sin(2.0 * Math.PI / 3.0 * 0), Math.cos(2.0 * Math.PI / 3.0 * 0)],
		   [Math.sin(2.0 * Math.PI / 3.0 * 1), Math.cos(2.0 * Math.PI / 3.0 * 1)],
		   [Math.sin(2.0 * Math.PI / 3.0 * 2), Math.cos(2.0 * Math.PI / 3.0 * 2)]
		];
	};

	function initSquare() {
		shape = [
		   [-0.5, 0.5],
		   [0.5, 0.5],
		   [0.5, -0.5],
		   [-0.5, -0.5]
		];
	};

	var tessellate = function (subdivisionCount, rotationAngle, constant) {
		points = [];
		lines = [];

		var shapeAsTriangles = convertShapeToTriangles(shape);
		shapeAsTriangles.forEach(function(triangle) {
			divideTriangle( triangle, subdivisionCount, rotationAngle, constant);
		})
		

		return { points: points, lines: lines };
	};

	function convertShapeToTriangles(shape)
	{
		var result = [];
		var vertexCount = shape.length;
		for(var i = 0; i < vertexCount; i++)
		{
			var a = [0,0];
			var b = shape[i];
			var c = shape[i < vertexCount-1 ? i+1 : 0];

			result.push([a, b, c]);
		}

		return result;
	}

	function divideTriangle( triangle, count, rotationAngle, constant )
	{
		var a = triangle[0];
		var b = triangle[1];
		var c = triangle[2];

	    // check for end of recursion
	    if ( count == 0 ) {
	    	var aPrime = rotate(a, rotationAngle, constant);
	    	var bPrime = rotate(b, rotationAngle, constant);
	    	var cPrime = rotate(c, rotationAngle, constant);
	    	
	    	points.push( aPrime, bPrime, cPrime );
	    	lines.push(aPrime, bPrime, bPrime, cPrime, cPrime, aPrime);
	    }
	    else {

	        //bisect the sides
	        var ab = mix( a, b, 0.5 );
	        var ac = mix( a, c, 0.5 );
	        var bc = mix( b, c, 0.5 );

	        --count;

	        // four new triangles
	        divideTriangle( [a, ab, ac], count, rotationAngle, constant );
	        divideTriangle( [c, ac, bc], count, rotationAngle, constant );
	        divideTriangle( [b, bc, ab], count, rotationAngle, constant );
	        divideTriangle( [ab, ac, bc], count, rotationAngle, constant );
	    }
	}

	function rotate(vertex, rotation, constant)
	{
	    var x = vertex[0];
	    var y = vertex[1];
	    var d = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5);

	    //rotation * Math.PI/180
	    var rotationPrime = radians(rotation) * d * constant;

	    var xPrime = x * Math.cos(rotationPrime) - y * Math.sin(rotationPrime);
	    var yPrime = x * Math.sin(rotationPrime) + y * Math.cos(rotationPrime);

	    return [xPrime, yPrime];
	}

	

	return {
		initShape: initShape,
		tessellate: tessellate
	}
} ();