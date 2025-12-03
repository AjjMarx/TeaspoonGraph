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


const FPSticker =  document.createElement("div");
document.body.appendChild(FPSticker);

FPSticker.style.position = "absolute";
FPSticker.style.right = "5px";
FPSticker.style.bottom = "5px";
FPSticker.style.width = "170px";
FPSticker.style.height = "25px";
FPSticker.textContent = timeDelta;
//const sidebar = document.createElement("div");
//document.body.appendChild(sidebar);

const AttributionSection = document.createElement("div");

AttributionSection.style.position = "absolute";
AttributionSection.style.top = "2em";
AttributionSection.style.height = "1em";
AttributionSection.style.left = "25%";
AttributionSection.style.width = "50%";
AttributionSection.innerHTML = `<center>Created by Alexandra Marx, <a target="_blank" rel="noopener noreferrer" href="mailto:ajjmarx@umich.edu">ajjmarx@umich.edu</a>, <a target="_blank" rel="noopener noreferrer" href="https://github.com/AjjMarx/TeaspoonGraph">github.com/AjjMarx/TeaspoonGraph</a></center>`;
document.body.appendChild(AttributionSection);

const titleSection = document.createElement("div");

titleSection.style.position = "absolute";
titleSection.style.top = "10px";
titleSection.style.height = "1em";
titleSection.style.width = "100%";
titleSection.innerHTML = "<center>Untitled Lesson</center>"
document.body.appendChild(titleSection);

const credit = document.createElement("div");
document.body.appendChild(credit);

credit.style.position = "absolute";
credit.style.bottom = "calc(50vh - 300px)";
credit.style.width = "600px";
credit.style.right = "30px";
credit.style.height = "2em";
credit.innerHTML = `<center><a target="_blank" rel="noopener noreferrer" href="https://visibleearth.nasa.gov/images/76487/june-blue-marble-next-generation/76492l">NASA 2004</a></center>`;
credit.style.userSelect = 'none';
/*
sidebar.style.width = "300px";
sidebar.style.height = "300px";
sidebar.style.borderRadius = '15px';
sidebar.style.outline = "3px solid black";
sidebar.style.padding = "10px";


sliders = [];
sliders["dist"] = document.createElement("input");
sliders["dist"].type = "range";
sliders["dist"].min = minimumDistance;
sliders["dist"].max = maximumDistance;
sliders["dist"].value = cameraDistance;
sliders["dist"].step = "0.001";

sliders["dist"].addEventListener("input", () => {
	cameraDistance = Number(sliders["dist"].value);
});

sliders["rote"] = document.createElement("input");
sliders["rote"].type = "range";
sliders["rote"].min = "-3.14159";
sliders["rote"].max = "3.14159";
sliders["rote"].value = centerAxis;
sliders["rote"].step = "0.001";

sliders["rote"].addEventListener("input", () => {
	centerAxis = Number(sliders["rote"].value);
});

sliders["divide"] = document.createElement("input");
sliders["divide"].type = "range";
sliders["divide"].min = "0";
sliders["divide"].max = "128";
sliders["divide"].value = divisions;
sliders["divide"].step = "2";

sliders["divide"].addEventListener("input", () => {
	divisions = Number(sliders["divide"].value);
});


const distLabel = document.createElement("label");
distLabel.textContent = "Camera Distance:";
sidebar.appendChild(distLabel);
sidebar.appendChild(sliders["dist"]);
const roteLabel = document.createElement("label");
roteLabel.textContent = "Center rotate:";
sidebar.appendChild(roteLabel);
sidebar.appendChild(sliders["rote"]);
const divLabel = document.createElement("label");
divLabel.textContent = "Divisions:";
sidebar.appendChild(divLabel);
sidebar.appendChild(sliders["divide"]);
*/
window.addEventListener('wheel', (event) => {
	if (canvas.matches(":hover")) {
		cameraDistance += event.deltaY/100;
		cameraDistance = Math.min(maximumDistance, Math.max(minimumDistance, cameraDistance));
	}
//	sliders["dist"].value = cameraDistance;
});

document.addEventListener('dragstart', e => {
	if (e.target.tagName.toLowerCase() === 'text') {
		e.preventDefault();
		e.stopPropagation();
	}
}, true);

//document.addEventListener('click', function(event) {
//    console.log('Clicked element:', event.target);
//});

LoadLesson();
