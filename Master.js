function coordinateTransform(x, y, onAxisRotation, offAxisRotation, dist, centerRotate) {
	let m = x*x + y*y;
	let c = offAxisRotation;
	let d = dist;
	let ang = Math.atan2(x, y) + centerRotate;
	let f1 = Math.sqrt(m) * (-d + Math.sqrt((1.0 - d*d) * m + 1.0)) / (1.0 + m);
	let f2 = (d + Math.sqrt((1.0/(m*m)) + (1.0 - d*d)/m)) / (1.0 + 1.0/m);
	let longitude = Math.atan2(-f1*Math.cos(ang), -f2*Math.cos(-c) + f1*Math.sin(ang)*Math.sin(-c)) + onAxisRotation;
	let latitude  = Math.asin(-f2*Math.sin(-c) - f1*Math.sin(ang)*Math.cos(-c));
	return [latitude, longitude, f1];
}

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let offAxisDegree = 0;
let onAxisDegree = 0;
let renderOffAxis = 0;
let renderOnAxis = 0;
let startOnAxis = 0;
let startOffAxis = 0;
let endOnAxis = 0;
let endOffAxis = 0;
let centerAxis = 0;
let cameraDistance = 1.5;
let divisions = 32;
let timeDelta = 0;

let minimumDistance = 1.125;
let maximumDistance = 5;

window.addEventListener("mousemove", (event) => {
	if (mouseDown) {
		const rect = canvas.getBoundingClientRect();
		let mx = ((rect.height - (mouseY - rect.top)) / rect.height) * 2.0 - 1.0;
		let my = ((mouseX - rect.left) / rect.width) * 2.0 - 1.0;
		startOnAxis = coordinateTransform(mx, my, onAxisDegree, offAxisDegree, cameraDistance, centerAxis)[1];
		startOffAxis = coordinateTransform(mx, my, onAxisDegree, offAxisDegree, cameraDistance, centerAxis)[0];
		mouseX = event.clientX;
		mouseY = event.clientY;
		mx = ((rect.height - (mouseY - rect.top)) / rect.height) * 2.0 - 1.0;
		my = ((mouseX - rect.left) / rect.width) * 2.0 - 1.0;
		endOnAxis = coordinateTransform(mx, my, onAxisDegree, offAxisDegree, cameraDistance, centerAxis)[1];
		endOffAxis = coordinateTransform(mx, my, onAxisDegree, offAxisDegree, cameraDistance, centerAxis)[0];

		if (startOnAxis && endOnAxis) {
			onAxisDegree += startOnAxis - endOnAxis;
			offAxisDegree += startOffAxis - endOffAxis;
		}
	} else {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
});

window.addEventListener("mousedown", (event) => {
	mouseDown = true;
});

window.addEventListener("mouseup", (event) => {
	mouseDown = false;
});

const titleSection = document.getElementById("titleSection");
const stats = document.getElementById("stats");
const toolBox = document.getElementById("toolBox");
const playground = document.getElementById("playground");
//const field = document.getElementById("FieldWrapper");
const description = document.getElementById("description"); 
const descriptionFade = document.getElementById("descriptionFade"); 
const descriptionButton = document.getElementById("descriptionButton"); 
const helpButton = document.getElementById("helpButton"); 
playground.clipboard = null;

descriptionButton.addEventListener('click', (event) => {
	description.style.display = descriptionFade.style.display = descriptionButton.style.display = "none";
});

helpButton.addEventListener('click', (event) => {
	description.style.display = descriptionFade.style.display = descriptionButton.style.display = "block";
});

window.addEventListener('wheel', (event) => {
	if (canvas.matches(":hover")) {
		cameraDistance += event.deltaY/100;
		cameraDistance = Math.min(maximumDistance, Math.max(minimumDistance, cameraDistance));
	}
});

document.addEventListener('dragstart', (event) => {
	if (event.target.tagName.toLowerCase() === 'text') {
		event.preventDefault();
		event.stopPropagation();
	}
}, true);

//document.addEventListener('click', function(event) {
//    console.log('Clicked element:', event.target);
//});

LoadLesson();
