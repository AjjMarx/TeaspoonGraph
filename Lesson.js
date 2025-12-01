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
		toolBox.style.width = "270px";
		toolBox.style.bottom = "10px";

		let mainManager = new typeManager();
		for (i of lessonData["Code"]["Types"]) {
			mainManager.addType(i["Name"], i["Color"], i["Size"], i["EdgeShapes"]);
		}

		let blocks = [];
		let dropCollection = [];
	
		let it = 0;	
		let startTop = 10;
		for (blockName in lessonData["Code"]["Functions"]) {
			if (blockName != "On_Start") {
				let blockData = lessonData["Code"]["Functions"][blockName];
				mainManager.addFunction(blockName, blockData["type"], blockData["text"], blockData["inputs"], blockData["code"]);
				if (it > 0) {
					startTop = blocks[it-1].getBottom() + 10
				} 
				blocks[it] = new programBlock(blockName, blockData["type"], blockData["text"], blockData["inputs"], 10, startTop, mainManager, toolBox);
				blocks[it].IDnum = 0;
				blocks[it].dropsiteCollection = dropCollection;
				blocks[it].update();
				it++;
			}
		}

		const playground = document.createElement("div");
		document.body.appendChild(playground);
		playground.style.position = "absolute";
		playground.style.left = "320px";
		playground.style.top = "30px";
		playground.style.right = "640px";
		playground.style.bottom = "10px";
		playground.style.overflowY = 'auto';

		let headerData = lessonData["Code"]["Functions"]["On_Start"];
		let headerBlock = new programBlock("On_Start", headerData["type"], headerData["text"], headerData["inputs"], 10, 30, mainManager, playground);
		headerBlock.dropsiteCollection = dropCollection;
		headerBlock.generateDropSites();
		headerBlock.toggleDrag(false);
		
		let programSequence = [headerBlock];

		requestAnimationFrame(renderGlobe);
	} catch(err) {
		console.log("Lesson data could not be loaded:\n" + err);
	}
}


