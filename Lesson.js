async function LoadLesson() {
	console.log("Lesson Loading");
	const filePath = "Sahara.json";
	try {
		const res = await fetch(filePath);
		const lessonData = await res.json();
		console.log(lessonData["Vertices"]);

		for (vert of lessonData["Vertices"]) {
			//console.log(vert);
			let ph = 3.14159* (vert.Latitude)/180;
			let th = -3.14159*(vert.Longitude)/180 + 1.5707;
			points.push([Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph), 0, 0, 0]);
		}
		for (edge of lessonData["Edges"]) {
			edges.push(edge);
		}



		const playground = document.createElement("div");
		document.body.appendChild(playground);

		playground.style.left = "100px";
		playground.style.top = "100px";
		playground.style.width = "300px";
		playground.style.height = "300px";


		let blocks = [];
		blocks[-1] = new Block();
		playground.appendChild(blocks[-1].container);
		blocks[-1].style.left = 100;
		blocks[-1].style.top = 100;
		blocks[-1].update();
		
		for (i in lessonData["Code"]["Types"]) { 
			blocks[i] = new Block();

			playground.appendChild(blocks[i].container);
			blocks[i].style.left = 100;
			blocks[i].style.top = blocks[i-1].getBottom() + 15;
			blocks[i].style.color = lessonData["Code"]["Types"][i]["Color"];
			blocks[i].style.text = lessonData["Code"]["Types"][i]["Name"];
			blocks[i].style.size = lessonData["Code"]["Types"][i]["Size"];
			blocks[i].style.edgeShapes = lessonData["Code"]["Types"][i]["EdgeShapes"];
			blocks[i].update();
		}

		requestAnimationFrame(renderGlobe);
	} catch(err) {
		console.log("Lesson data could not be loaded:\n" + err);
	}
}


