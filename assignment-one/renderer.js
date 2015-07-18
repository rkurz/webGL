"use strict";

var renderer = new function () {
    var gl;    

    var draw = function (canvas, points, lines) {
        gl = WebGLUtils.setupWebGL( canvas );
        if ( !gl ) { 
            alert( "WebGL isn't available" ); 
        }

        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

        //  Load shaders and initialize attribute buffers
        var program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        // Load the data into the GPU
        var bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        //gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
        gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(4, 11), gl.STATIC_DRAW );

        // Associate out shader variables with our data buffer
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        var fColor = gl.getUniformLocation(program, "fColor");

        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.vertexAttribPointer( fColor, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        render(points, lines, fColor);
    };

    function render(points, lines, fColor)
    {
        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
        gl.uniform4f(fColor, 1, 0, 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, points.length);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(lines));
        gl.uniform4f(fColor, 0, 0, 0, 1);
        gl.drawArrays(gl.LINES, 0, lines.length );
    }

    return {
        draw: draw
    };
} ();






