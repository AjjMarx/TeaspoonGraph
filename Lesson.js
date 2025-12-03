async function LoadLesson() {
	console.log("Lesson Loading");
	const filePath = "Sahara.json";
	//try {
	
		const res = await fetch(filePath);
		const lessonData = await res.json();
		console.log(lessonData["Vertices"]);
		
		titleSection.innerHTML = `<center><b>` + lessonData["LessonName"] + `</b></center>`; 	

		for (vert of lessonData["Vertices"]) {
			//console.log(vert);
			let ph = 3.14159* (vert.Latitude)/180;
			let th = -3.14159*(vert.Longitude)/180 + 1.5707;
			points.push([Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph), 0, 0, 0, vert.Name]);
			lessonData["Code"]["Functions"][vert.Name] = {
				"type" : "Vertex",
				"text" : vert.Name,
				"inputs" : null,
				"code" : `return \"${vert.Name}\";`
			};
		}
		for (edge of lessonData["Edges"]) {
			edges.push(edge);
		}



		const toolBox = document.createElement("div");
		document.body.appendChild(toolBox);
		toolBox.style.position = "absolute";
		toolBox.style.overflowY = 'auto';
		toolBox.style.backgroundColor = "#E0E0EF";
		toolBox.style.borderRadius = '20px';

		toolBox.style.left = "10px";
		toolBox.style.top = "30px";
		toolBox.style.width = "280px";
		toolBox.style.bottom = "10px";

		let mainManager = new typeManager();
		for (i of lessonData["Code"]["Types"]) {
			mainManager.addType(i["Name"], i["Color"], i["Size"], i["EdgeShapes"]);
		}

		let blocks = [];
		let dropCollection = [];
	
		let it = 0;	
		let startTop = 10;
		let horizontal = 10;
		for (blockName in lessonData["Code"]["Functions"]) {
			if (blockName != "On_Start") {
				let blockData = lessonData["Code"]["Functions"][blockName];
				mainManager.addFunction(blockName, blockData["type"], blockData["text"], blockData["inputs"], blockData["code"]);
				if (it > 0) {
					startTop = blocks[it-1].getBottom() + 10
				} 
				blocks[it] = new programBlock(blockName, blockData["type"], blockData["text"], blockData["inputs"], null, 10, startTop, mainManager, toolBox);
				blocks[it].IDnum = 0;
				blocks[it].dropsiteCollection = dropCollection;
				if (horizontal + blocks[it].mainBlock.style.width + 10< 270 && it > 0) { 
					blocks[it].mainBlock.style.left = horizontal + 10;
					blocks[it].mainBlock.style.top = blocks[it-1].mainBlock.style.top;
				} else {
					horizontal = 10;
				}
				blocks[it].update();
				horizontal += blocks[it].mainBlock.style.width + 10;
				it++;
			}
		}

		const playground = document.createElement("div");
		document.body.appendChild(playground);
		playground.style.position = "absolute";
		playground.style.left = "320px";
		playground.style.top = "80px";
		playground.style.right = "640px";
		playground.style.bottom = "10px";
		playground.style.overflowY = 'auto';
		playground.clipboard = null;

		let headerData = lessonData["Code"]["Functions"]["On_Start"];
		let headerBlock = new programBlock("On_Start", headerData["type"], headerData["text"], headerData["inputs"], headerData["code"], 10, 30, mainManager, playground);
		headerBlock.dropsiteCollection = dropCollection;
		headerBlock.generateDropSites();
		headerBlock.toggleDrag(false);
		
		let programSequence = [headerBlock];

		let mainExecutor = new Executor(programSequence, canvas, lessonData);

		refExecutor = mainExecutor;	
		requestAnimationFrame(renderGlobe);
	//} catch(err) {
	//	console.log("Lesson data could not be loaded:\n" + err);
	//}
}


