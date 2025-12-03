const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl", {depth: true, alpha: true});
const ext = gl.getExtension("EXT_frag_depth");
if (!ext) {
    console.warn("EXT_frag_depth not supported on this device!");
}

window.resolution = 600*2;
window.scalingFactor = window.resolution / canvas.getBoundingClientRect().width;
console.log("Canvas scaling factor: " + window.scalingFactor);

canvas.width = window.resolution;
canvas.height = window.resolution;
gl.viewport(0, 0, canvas.width, canvas.height);
const overlay = document.createElement("canvas");
const overlayDepth = document.createElement("canvas");
overlay.width = canvas.width;
overlayDepth.width = canvas.width;
overlay.height = canvas.height;
overlayDepth.height = canvas.height;
const overlayContext = overlay.getContext("2d");

const img = new Image();
img.src = "earth.png";
const earthTex = gl.createTexture();
img.onload = () => {
	gl.bindTexture(gl.TEXTURE_2D, earthTex);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(
        	gl.TEXTURE_2D, 0, gl.RGBA,
        	gl.RGBA, gl.UNSIGNED_BYTE, img
    	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

const vsBase = `
attribute vec2 aPosition;
varying vec2 vUV;

void main() {
  vUV = (aPosition + 1.0) * 0.5; // Map [-1,1] → [0,1]
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

//textured and rotatable but not positionable
const fsGlobe = ` 

#ifdef GL_EXT_frag_depth
    #extension GL_EXT_frag_depth : enable
#endif
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;
uniform float offAxisRotation;
uniform float onAxisRotation;
uniform float dist;
uniform float centerAngle;
uniform float division;

void main() {
	float x = vUV.y * 2.0 - 1.0;
	float y = vUV.x * 2.0 - 1.0;
	float m = x*x + y*y;
	float d = dist;
	if (m < 1.0 / (d*d - 1.0)) {	
		float c = offAxisRotation;
		float ang = atan(x,y) + centerAngle;
		float f1 = sqrt(m) * (-d + sqrt((1.0 - d*d) * m + 1.0)) / (1.0 + m);
		float f1P = sqrt(m) * (-d - sqrt((1.0 - d*d) * m + 1.0)) / (1.0 + m);
		float f2 = (d + sqrt((1.0/(m*m)) + (1.0 - d*d)/m)) / (1.0 + 1.0/m);
		float f2P = (d - sqrt((1.0/(m*m)) + (1.0 - d*d)/m)) / (1.0 + 1.0/m);
		float longitude = atan(-f1*cos(ang), -f2*cos(-c)+f1*sin(ang)*sin(-c)) + onAxisRotation;
		float innerLongitude = atan(-f1P*cos(ang), -f2P*cos(-c)+f1P*sin(ang)*sin(-c)) + onAxisRotation;
		float latitude = asin(-f2*sin(-c) - f1*sin(ang)*cos(-c));
		float innerLatitude = asin(-f2P*sin(-c) - f1P*sin(ang)*cos(-c));
  		//gl_FragColor = vec4(mod(longitude * 3.14159, 1.0), mod(latitude * 3.14159, 1.0), 0.0, 1.0); 
		gl_FragDepthEXT = (f2) / 10.0 + 0.5; 
		if ( mod(division * latitude/3.141592, 1.0) < 0.005 || 
		     ( mod(division * longitude/3.141592, 1.0) < 0.005/cos(latitude)) && 
		     division * latitude/3.141592 < (division / 2.0 - 1.0) &&
 		     division * latitude/3.141592 > (1.0 - division / 2.0))
		{
			gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0);
		} else {
			//float dot = max(0.0,min(1.0,1.5 * atan(20.0 * (-0.707 * cos(longitude - onAxisRotation)*cos(latitude) - 0.707 * sin(longitude - onAxisRotation)*cos(latitude))) / 3.15159 + 1.0)); 
			//gl_FragColor = vec4(dot,dot,dot,1.0);
			gl_FragColor = texture2D(uTexture, vec2(mod(-0.5 * longitude/3.14159, 1.0), latitude/3.14159 + 0.5)); 
			//if (d > 1.0 && texture2D(uTexture, vec2(mod(-0.5 * longitude/3.14159, 1.0), latitude/3.14159 + 0.5)).x < 0.5) {
			//	gl_FragColor = vec4(0.75, 0.75, 0.75, 1.0);
			//} else {
			//	gl_FragColor = texture2D(uTexture, vec2(mod(-0.5 * innerLongitude/3.14159, 1.0), innerLatitude/3.14159 + 0.5)) /8.0;
			//}
		}
			//gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
	} else if (sqrt(m) <= sqrt((1.0 / (d*d - 1.0))) + 0.005) {
		gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0);
		gl_FragDepthEXT = 0.002; 
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		gl_FragDepthEXT = 0.0; 
	}
}
`;

//variable position and size but no texture or rotation
const fsBall = `

#ifdef GL_EXT_frag_depth
    #extension GL_EXT_frag_depth : enable
#endif
precision mediump float;
varying vec2 vUV;
uniform sampler2D colorText;
uniform float dist;
uniform float offAxisRotation;
uniform float onAxisRotation;
uniform float centerRotation;
uniform float x1;
uniform float y1;
uniform float z1; 
uniform vec3 inpColor;

void main() {
	float th = -onAxisRotation;
	float ph = -offAxisRotation;
	float x = vUV.y * 2.0 - 1.0;
	float y = vUV.x * 2.0 - 1.0;
	//float x1 = cos(th) * inpX - sin(th) * inpZ;
	//float zt = sin(th) * inpX + cos(th) * inpZ;
	//float z1 = cos(ph) * zt - sin(ph) * inpY;
	//float y1 = sin(ph) * zt + cos(ph) * inpY;
	float r = 0.008;
	float g = atan(x, y) + centerRotation;
	float a = sqrt(x*x + y*y);
	float d = dist - z1;
	float k = (2.0*x1*cos(g) + 2.0*y1*sin(g)) / 2.0;
	float r2 = (pow(-2.0*x1*cos(g)-2.0*y1*sin(g), 2.0)-4.0*(x1*x1+y1*y1-r*r)) / 4.0;
	float f1 = (pow(2.0*k*a-2.0*d*a*a, 2.0) - 4.0*(a*a+1.0)*(-a*d*k+k*k+d*d*a*a-k*d*a-r2));
	float val = (-(2.0*k*a-2.0*d*a*a) + sqrt(f1)) / (2.0*(a*a+1.0)) + z1;
	
	if (f1 >= 0.0) {
		gl_FragColor = vec4(inpColor, 1.0);//texture2D(colorText, vUV);
		gl_FragDepthEXT = (val/10.0 + 0.5); //max(0.0, 1.0 - val);
	} else {  
		gl_FragDepthEXT = 0.001;
	}
	//if (vUV.x > 0.5) {	
	//	gl_FragDepthEXT = 1.0; 
	//}
}
`;

const fsFilter = `

#ifdef GL_EXT_frag_depth
    #extension GL_EXT_frag_depth : enable
#endif
precision mediump float;
void main() {
	 gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
	gl_FragDepthEXT = 0.001;
}
`;

const fsOverlay = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;

void main() {
	gl_FragColor = vec4(texture2D(uTexture, vUV));
}
`;

function compileShader(src, type) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		throw new Error(gl.getShaderInfoLog(shader));
	return shader;
}

const globeShader = gl.createProgram();
gl.attachShader(globeShader, compileShader(vsBase, gl.VERTEX_SHADER));
gl.attachShader(globeShader, compileShader(fsGlobe, gl.FRAGMENT_SHADER));
gl.linkProgram(globeShader);
const ballShader = gl.createProgram();
gl.attachShader(ballShader, compileShader(vsBase, gl.VERTEX_SHADER));
gl.attachShader(ballShader, compileShader(fsBall, gl.FRAGMENT_SHADER));
gl.linkProgram(ballShader);
if (!gl.getProgramParameter(globeShader, gl.LINK_STATUS))
 	throw new Error(gl.getProgramInfoLog(globeShader));
if (!gl.getProgramParameter(ballShader, gl.LINK_STATUS))
 	throw new Error(gl.getProgramInfoLog(ballShader));
const filterShader = gl.createProgram();
gl.attachShader(filterShader, compileShader(vsBase, gl.VERTEX_SHADER));
gl.attachShader(filterShader, compileShader(fsFilter, gl.FRAGMENT_SHADER));
gl.linkProgram(filterShader);
if (!gl.getProgramParameter(filterShader, gl.LINK_STATUS))
 	throw new Error(gl.getProgramInfoLog(filterShader));
const overlayShader = gl.createProgram();
gl.attachShader(overlayShader, compileShader(vsBase, gl.VERTEX_SHADER));
gl.attachShader(overlayShader, compileShader(fsOverlay, gl.FRAGMENT_SHADER));
gl.linkProgram(overlayShader);
if (!gl.getProgramParameter(overlayShader, gl.LINK_STATUS))
	throw new Error(gl.getProgramInfoLog(overlayShader));

const overlayTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

const vertices = new Float32Array([
  -1, -1, 3, -1, -1, 3
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, window.resolution, window.resolution);

gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthBuffer
);

if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("FBO incomplete");
}



const posLocGlobe = gl.getAttribLocation(globeShader, "aPosition");
const posLocBall = gl.getAttribLocation(ballShader, "aPosition");
const posLocOverlay = gl.getAttribLocation(overlayShader, "aPosition");

const overlayTextureUniformLocation = gl.getUniformLocation(overlayShader, "uTexture");

const offAxis = gl.getUniformLocation(globeShader, "offAxisRotation");
const onAxis = gl.getUniformLocation(globeShader, "onAxisRotation");
const cameraDistGL = gl.getUniformLocation(globeShader, "dist");
const centerAxisGL = gl.getUniformLocation(globeShader, "centerAngle");
const divisionsGL = gl.getUniformLocation(globeShader, "division");
const ballDistGL = gl.getUniformLocation(ballShader, "dist");
const ballOffAxis = gl.getUniformLocation(ballShader, "offAxisRotation");
const ballOnAxis = gl.getUniformLocation(ballShader, "onAxisRotation");
const ballX = gl.getUniformLocation(ballShader, "x1");
const ballY = gl.getUniformLocation(ballShader, "y1");
const ballZ = gl.getUniformLocation(ballShader, "z1");
const ballCenterRotate = gl.getUniformLocation(ballShader, "centerRotation");
const ballColor = gl.getUniformLocation(ballShader, "inpColor");

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.depthFunc(gl.GREATER);

const points = [];
//for (let i = 0; i < 200; i++) {
	//let th = Math.random()*6.283;
	//let ph = (Math.random()-0.5)*6.283;
	//points.push([Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph), Math.random(), Math.random(), Math.random()]);
//}
const edges = [];

overlayContext.fillStyle = "White";
overlayContext.font = "24px 'Roboto Mono', monospace";


function proj(Ax, Ay, Az, onAxis, offAxis, cent, dist) {
	let Lx = Ax*Math.cos(onAxis) + Ay*Math.sin(onAxis);
	let Qy = -Ax*Math.sin(onAxis) + Ay*Math.cos(onAxis);
	let Ly = (Qy*Math.cos(offAxis) + Az*Math.sin(offAxis));
	let Lz = -Qy*Math.sin(offAxis) + Az*Math.cos(offAxis);
	let TLx = (Lx*Math.cos(cent) + Lz*Math.sin(cent));
	let TLz = (-Lx*Math.sin(cent) + Lz*Math.cos(cent));	
	let fact = window.resolution/ ( 2*window.scalingFactor);
	let S1 = fact*(TLx/(dist - Ly)) + fact;
	let S2 = fact*(TLz/(dist - Ly)) + fact;
	return [S1, S2, Ly];
}

function renderArc(p1, p2, onAxis, offAxis, cent, dist) {
	let n1 = Math.sqrt(p1[0]*p1[0]+p1[1]*p1[1]+p1[2]*p1[2]);
	let n2 = Math.sqrt(p2[0]*p2[0]+p2[1]*p2[1]+p2[2]*p2[2]);
	let p3 = [p1[0]/n1, p1[1]/n1, p1[2]/n1, 1,0,0];
	let p4 = [p2[0]/n2, p2[1]/n2, p2[2]/n2, 0,0,0];
	let dotv = (p3[0]*p2[0]+p3[1]*p2[1]+p3[2]*p2[2]);
	let p5 = [
	p2[0] - dotv*p3[0],
	p2[1] - dotv*p3[1],
	p2[2] - dotv*p3[2], 
	0,0,0];

	let n3 = Math.sqrt(p5[0]*p5[0]+p5[1]*p5[1]+p5[2]*p5[2]);
	let p6 = [p5[0]/n3, p5[1]/n3, p5[2]/n3, 0,1,0];

	let basisX = p3;
	let basisY = p6;

	let d11 = 1;
	let d12 = 0;
	let d22 = 1;
	let v2 = p2[0]*basisX[0] + p2[1]*basisX[1] + p2[2]*basisX[2];
	let v1 = p2[0]*basisY[0] + p2[1]*basisY[1] + p2[2]*basisY[2];
	let D = d11*d22 - d12*d12;
	let coeff1 = (v1*d22 - v2*d12)/D;
	let coeff2 = (v2*d11 - v1*d12)/D;

	let miniraise = 1.0;
	
	let step = Math.atan2(coeff1, coeff2)/Math.max(1, Math.floor(150 * Math.atan2(coeff1, coeff2)));
	overlayContext.lineWidth = 2*window.scalingFactor;
		
	overlayContext.lineWidth = 5;
	overlayContext.beginPath();
	for (let t = 0; t < Math.atan2(coeff1, coeff2) + step/2; t += step) {
		let Ax = (basisX[0]*Math.cos(t) + basisY[0]*Math.sin(t))*miniraise;
		let Ay = (basisX[1]*Math.cos(t) + basisY[1]*Math.sin(t))*miniraise;
		let Az = (basisX[2]*Math.cos(t) + basisY[2]*Math.sin(t))*miniraise;
		let S = proj(Ax, Ay, Az, onAxis, offAxis, cent, dist)	
		
		if (Math.atan2(coeff1, coeff2) < 6*step || Math.floor(Math.abs(t*75))%2 == 0) {
			overlayContext.strokeStyle = `rgba(${0}, ${0}, ${0}, ${1})`;
		} else {
			overlayContext.strokeStyle = `rgba(${0}, ${0}, ${0}, ${0})`;
		}
		
		if (S[2] > 1/dist) {
			overlayContext.lineTo(window.scalingFactor*(S[0]), overlay.height - window.scalingFactor*(S[1]));
			overlayContext.stroke();
			overlayContext.beginPath();
		}
		overlayContext.moveTo(window.scalingFactor*(S[0]), overlay.height - window.scalingFactor*(S[1]));
	}
	overlayContext.stroke();
}

let refExecutor = null;

function renderGlobe(t) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, earthTex);
	gl.enable(gl.DEPTH_TEST);
	const startTime = performance.now();
	gl.finish();
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0, 0, 0, 1);
	gl.clearDepth(0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	overlayContext.clearRect(0, 0, overlay.width, overlay.height);
	
	gl.useProgram(globeShader);
	gl.enableVertexAttribArray(posLocGlobe);
	gl.vertexAttribPointer(posLocGlobe, 2, gl.FLOAT, false, 0, 0);
	gl.uniform1f(offAxis, offAxisDegree);
	gl.uniform1f(onAxis, onAxisDegree);
	gl.uniform1f(cameraDistGL, cameraDistance);
	gl.uniform1f(centerAxisGL, centerAxis);
	gl.uniform1f(divisionsGL, divisions/2);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
    	gl.clearColor(0, 0, 0, 1);

	for (const E of edges) {
		if (E) {
		//	console.log(E);
			renderArc(points[E[0]], points[E[1]], onAxisDegree, offAxisDegree, centerAxis, cameraDistance); 
		}
	}

	gl.useProgram(overlayShader);
	gl.enable(gl.BLEND);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, overlay);	
	gl.uniform1i(overlayTextureUniformLocation, 0);
	gl.disable(gl.DEPTH_TEST);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	overlayContext.clearRect(0, 0, canvas.width, canvas.height);
	overlayContext.lineWidth = 10;

	gl.useProgram(ballShader);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.enableVertexAttribArray(posLocBall);
	gl.uniform1f(ballDistGL, cameraDistance);
	gl.uniform1f(ballOffAxis, offAxisDegree);
	gl.uniform1f(ballOnAxis, onAxisDegree);
	gl.vertexAttribPointer(posLocBall, 2, gl.FLOAT, false, 0, 0);
	gl.enable(gl.SCISSOR_TEST);
	
	if (refExecutor && refExecutor.agent) {
		for (let index of refExecutor.labels) {
			coord = points[index];

			let [Sx, Sy, Ly] = proj(coord[0], coord[1], coord[2] - 0.01, onAxisDegree, offAxisDegree, centerAxis, cameraDistance);
	
			overlayContext.font = `28px 'Roboto Mono', monospace`;	
			overlayContext.strokeText(coord[6], window.scalingFactor*(Sx) - overlayContext.measureText(coord[6]).width/2 , overlay.height - window.scalingFactor*(Sy) + overlayContext.measureText(coord[6]).actualBoundingBoxAscent);
			overlayContext.fillText(coord[6], window.scalingFactor*(Sx) - overlayContext.measureText(coord[6]).width/2 , overlay.height - window.scalingFactor*(Sy) + overlayContext.measureText(coord[6]).actualBoundingBoxAscent);	
		}
		let ph = 3.14159 * refExecutor.agent.latitude / 180;
		let th = -3.14159 * refExecutor.agent.longitude / 180 + 1.5707;
		coord = [Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph)];
		let [Sx, Sy, Ly] = proj(coord[0], coord[1], coord[2], onAxisDegree, offAxisDegree, centerAxis, cameraDistance);
		if (refExecutor.agent.img) {
			overlayContext.drawImage(refExecutor.agent.img, window.scalingFactor*(Sx) - 50, overlay.height - window.scalingFactor*(Sy) - 75, 75, 75);
		}
	}

	for (const i in points) {
		coord = points[i];
		let Ax = coord[0];
		let Ay = coord[1];
		let Az = coord[2];

		let Lx = Ax*Math.cos(onAxisDegree) + Ay*Math.sin(onAxisDegree);
		let Qy = -Ax*Math.sin(onAxisDegree) + Ay*Math.cos(onAxisDegree);
		let Ly = Qy*Math.cos(offAxisDegree) + Az*Math.sin(offAxisDegree);
		let Lz = -Qy*Math.sin(offAxisDegree) + Az*Math.cos(offAxisDegree);
		let TLx = Lx*Math.cos(centerAxis) - Lz*Math.sin(-centerAxis);
		let TLz = Lx*Math.sin(-centerAxis) + Lz*Math.cos(centerAxis); 
		gl.uniform1f(ballCenterRotate, centerAxis);
		gl.uniform1f(ballX, Lx);
		gl.uniform1f(ballZ, Ly);
		gl.uniform1f(ballY, Lz);
		gl.uniform3fv(ballColor, new Float32Array([coord[3], coord[4], coord[5]]));
		if ((TLx/(cameraDistance - Ly))*(TLx/(cameraDistance - Ly)) + (TLz/(cameraDistance - Ly))*(TLz/(cameraDistance - Ly)) 
		    < (0.9 / (cameraDistance*cameraDistance - 1.0)) && Ly < 0.4) {
			continue;
		}
		let Sx = 300*(TLx/(cameraDistance - Ly)) + 300;	
		let Sy = 300*(TLz/(cameraDistance - Ly)) + 300;
		gl.scissor(window.scalingFactor*(Sx) - 80, window.scalingFactor*(Sy) - 80, 160, 160);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

	}

	gl.disable(gl.SCISSOR_TEST);

	gl.useProgram(overlayShader);
	gl.enable(gl.BLEND);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, overlay);	
	gl.uniform1i(overlayTextureUniformLocation, 0);
	gl.disable(gl.DEPTH_TEST);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	gl.useProgram(filterShader);
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	gl.finish();
	timeDelta = performance.now() - startTime;
	FPSticker.textContent = String(Math.min(60, Math.floor(1000/timeDelta))) + " FPS (Virtual)";
	requestAnimationFrame(renderGlobe);
}



