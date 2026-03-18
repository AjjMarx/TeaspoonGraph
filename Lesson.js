async function LoadLesson() {
	console.log("Lesson Loading");

	let browserInfo = navigator.userAgent;
	let mobileRegexp = /android|iphone|kindle|ipad/i;
	if (mobileRegexp.test(browserInfo)) {
		console.error("Sorry, this webpage is not designed for mobile browsers. Please try again on a desktop or laptop browser");
		document.body.innerHTML = `<center><h2>Sorry, this webpage is not designed for mobile browsers. Please try again on a desktop or laptop browser</h2><br><a target="_blank" rel="noopener noreferrer" href="https://github.com/AjjMarx/TeaspoonGraph">github.com/AjjMarx/TeaspoonGraph</a></center>`;
	} else {

	const filePath = "Sahara.json";
	let programSequence, lessonData, mainManager, dropCollection;
	try {
	
		const res = await fetch(filePath);
		lessonData = await res.json();
		lessonData.flip = [];
		lessonData["Vertex_Weights_Inverse"] = [];
		console.log(lessonData["Vertices"]);
		
		titleSection.innerHTML = `<center><b>` + lessonData["Title"] + `</b></center><center>` + lessonData["Subtitle"] + '</center>'; 
		description.innerHTML = lessonData["Description"];

		for (i in lessonData["Vertices"]) {
			//console.log(vert);
			let vert = lessonData["Vertices"][i];
			let ph = 3.14159* (vert.Latitude)/180;
			let th = -3.14159*(vert.Longitude)/180 + 1.5707;
			points.push([Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph), 0, 0, 0, vert.Name]);
			lessonData.flip[vert.Name] = Number(i);
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

		for (i in lessonData["Vertex_Weights"]) {
			lessonData["Vertex_Weights_Inverse"][lessonData["Vertex_Weights"][i]] = i;
		}

		const toolBox = document.createElement("div");
		toolBox.className = "bento";
		document.body.appendChild(toolBox);
		toolBox.style.position = "absolute";
		toolBox.style.overflowY = 'auto';
		//toolBox.style.backgroundColor = "#E0E0EF";
		//toolBox.style.borderRadius = '20px';

		toolBox.style.left = "10px";
		toolBox.style.top = "80px";
		toolBox.style.width = "280px";
		toolBox.style.bottom = "5px";

		const toolBoxTitle = document.createElement("div");
		toolBoxTitle.className = "bentoTitle";
		document.body.appendChild(toolBoxTitle);
		toolBoxTitle.innerHTML = "TOOLBOX";
		toolBoxTitle.style.position = "absolute";
		toolBoxTitle.style.backgroundColor = Palette[0][0];
		toolBoxTitle.style.left = "6px";
		toolBoxTitle.style.top = "76px";
		toolBoxTitle.style.height = "1.5em";

		mainManager = new typeManager();
		for (i of lessonData["Code"]["Types"]) {
			mainManager.addType(i["Name"], i["Color"], i["Size"], i["EdgeShapes"]);
		}

		let blocks = [];
		dropCollection = [];
	
		let it = 0;	
		let startTop = 45;
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
				if (horizontal + blocks[it].mainBlock.style.width + 10< 250 && it > 0) { 
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
		playground.className = "bento";
		playground.style.left = "307px";
		playground.style.top = "80px";
		playground.style.right = "calc(30% + 13px)";
		playground.style.bottom = "5px";
		playground.style.overflowY = 'auto';
		playground.clipboard = null;

		const playgroundTitle = document.createElement("div");
		playgroundTitle.className = "bentoTitle";
		document.body.appendChild(playgroundTitle);
		playgroundTitle.innerHTML = "PLAYGROUND";
		playgroundTitle.style.position = "absolute";
		playgroundTitle.style.backgroundColor = Palette[6][0];
		playgroundTitle.style.left = "304px";
		playgroundTitle.style.top = "76px";
		playgroundTitle.style.height = "1.5em";

		const Field = document.getElementById("FieldWrapper");
		console.log(Field);
		Field.style.position = "absolute";
		Field.style.right = "10px";
		Field.style.width = "calc(30% - 14px)";
		Field.style.top = "80px";
		Field.style.bottom = "5px";

		canvas.style.position = "relative"
		canvas.style.width = "90%";
		canvas.style.height =  "auto";
		canvas.style.left = "5%";

		const FieldTitle = document.createElement("div");
		FieldTitle.className = "bentoTitle";
		document.body.appendChild(FieldTitle);
		FieldTitle.innerHTML = "FIELD";
		FieldTitle.style.position = "absolute";
		FieldTitle.style.backgroundColor = Palette[4][0];
		FieldTitle.style.left = "calc(70% - 7px)";
		FieldTitle.style.top = "76px";
		FieldTitle.style.height = "1.5em";

		let headerData1 = lessonData["Code"]["Functions"]["On_Start1"];
		let headerData2 = lessonData["Code"]["Functions"]["On_Start2"];
		let headerBlock1 = new programBlock("On_Start1", headerData1["type"], headerData1["text"], headerData1["inputs"], headerData1["code"], 10, 30, mainManager, playground);
		let headerBlock2 = new programBlock("On_Start2", headerData2["type"], headerData2["text"], headerData2["inputs"], headerData2["code"], 10, 100, mainManager, playground);
		headerBlock1.dropsiteCollection = dropCollection;
		headerBlock2.dropsiteCollection = dropCollection;
		headerBlock1.generateDropSites();
		headerBlock2.generateDropSites();
		headerBlock1.toggleDrag(false);
		headerBlock2.toggleDrag(false);
		
		programSequence = [headerBlock1, headerBlock2];


	} catch(err) {
		console.error(err);
	}
	//let mainExecutor = new Executor(programSequence, canvas, lessonData, mainManager, dropCollection);
	//refExecutor = mainExecutor;	
	requestAnimationFrame(renderGlobe);
	}
}


