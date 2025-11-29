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



		const toolBox = document.createElement("div");
		document.body.appendChild(toolBox);
		toolBox.style.position = "absolute";
		toolBox.style.overflowY = 'auto';

		toolBox.style.left = "10px";
		toolBox.style.top = "30px";
		toolBox.style.width = "300px";
		toolBox.style.bottom = "10px";

		let mainTypes = new typeManager();
		for (i of lessonData["Code"]["Types"]) {
			mainTypes.add(i["Name"], i["Color"], i["Size"], i["EdgeShapes"]);
		}

		let blocks = [];
	
		let it = 0;	
		let startTop = 10;
		for (blockName in lessonData["Code"]["Functions"]) {
			let blockData = lessonData["Code"]["Functions"][blockName];
			if (it > 0) {
				startTop = blocks[it-1].getBottom() + 10
			} 
			blocks[it] = new programBlock(blockData["type"], blockData["text"], blockData["inputs"], 30, startTop, mainTypes, toolBox);
			it++;
		}

		requestAnimationFrame(renderGlobe);
	} catch(err) {
		console.log("Lesson data could not be loaded:\n" + err);
	}
}


