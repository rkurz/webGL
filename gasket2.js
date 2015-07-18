"use strict";

//var canvas;
var gl;

var points = [];

//var NumTimesToSubdivide = 1;

//window.onload = init;

function DrawStuff(canvas, subDivisionCount, rotationAngle)
{
    points = [];
    
    //alert("Hello");
    //var txtSubdivisionCount = document.getElementById("txtSubdivisionCount");
    var NumTimesToSubdivide = subDivisionCount;
    //canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    // var vertices = [
    //     vec2( -1, -1 ),
    //     vec2(  0,  1 ),
    //     vec2(  1, -1 )
    // ];
    // var vertices = [
    //     vec2( 0.7, 0 ),
    //     vec2( -0.35,  0.61 ),
    //     vec2( -0.35, -0.61 )
    // ];
    var vertices = [
        vec2( 0, 0 ),
        vec2( -0.5,  0.5 ),
        vec2( -0.5, -0.5 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide, rotationAngle);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c, rotationAngle )
{
    points.push( rotate(a, rotationAngle), rotate(b, rotationAngle), rotate(c, rotationAngle) );
    //points.push( a, b, c );
}

function divideTriangle( a, b, c, count, rotationAngle )
{

    // check for end of recursion

    if ( count == 0 ) {
        triangle( a, b, c, rotationAngle );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // four new triangles

        divideTriangle( a, ab, ac, count, rotationAngle );
        divideTriangle( c, ac, bc, count, rotationAngle );
        divideTriangle( b, bc, ab, count, rotationAngle );
        divideTriangle( ab, ac, bc, count, rotationAngle );
    }
}

function rotate(v, theta)
{
    var x = v[0];
    var y = v[1];
    //var d = Math.sqrt(x*x + y*y);
    var d = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5);

    var rotationAngle = theta * d * 0.01;
    var xPrime = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
    var yPrime = x * Math.sin(rotationAngle) - y * Math.cos(rotationAngle);

    return vec2(xPrime, yPrime);
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
