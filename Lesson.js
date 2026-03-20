async function LoadLesson() {
	console.log("Lesson Loading");

	let browserInfo = navigator.userAgent;
	let mobileRegexp = /android|iphone|kindle|ipad/i;
	if (mobileRegexp.test(browserInfo)) {
		console.error("Sorry, this webpage is not designed for mobile browsers. Please try again on a desktop or laptop browser");
		document.body.innerHTML = `<center><h2>Sorry, this webpage is not designed for mobile browsers. Please try again on a desktop or laptop browser</h2><br><a target="_blank" rel="noopener noreferrer" href="https://github.com/AjjMarx/TeaspoonGraph">github.com/AjjMarx/TeaspoonGraph</a></center>`;
	} else {

	let filePath = window.location.hash.substring(1);

    		const response = await fetch(filePath, {
      		method: 'HEAD',
      		cache: 'no-store' 
    		});
	if (!response.ok || filePath.length < 3) {filePath = "Sahara.json";}
		
	let programSequence, lessonData, mainManager, dropCollection;
	try {
	
		const res = await fetch(filePath);
		lessonData = await res.json();
		lessonData.flip = [];
		lessonData["Vertex_Weights_Inverse"] = [];
		console.log(lessonData["Vertices"]);
		
		titleSection.innerHTML = `<center><b>` + lessonData["Title"] + `</b></center><center>` + lessonData["Subtitle"] + '</center>';
		description.textContent = lessonData["Description"];

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

		mainManager = new typeManager();
		for (i of lessonData["Code"]["Types"]) {
			mainManager.addType(i["Name"], i["Color"], i["Size"], i["EdgeShapes"]);
		}

		let blocks = [];
		dropCollection = [];
	
		let it = 0;	
		let startTop = 45;
		let horizontal = 10;
		let blockName;
		for (blockName in lessonData["Code"]["Functions"]) {
			if (blockName != "undefined") {
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


		let headerData1 = lessonData["Code"]["Functions"]["Male_Activate"];
		let headerBlock1 = new programBlock("On_Start1", headerData1["type"], headerData1["text"], headerData1["inputs"], headerData1["code"], 10, 50, mainManager, playground);
		headerBlock1.dropsiteCollection = dropCollection;
		headerBlock1.generateDropSites();
		headerBlock1.toggleDrag(false);
		
		programSequence = [headerBlock1];


	} catch(err) {
		console.error(err);
	}

	//let mainExecutor = new Executor(programSequence, canvas, lessonData, mainManager, dropCollection);
	//refExecutor = mainExecutor;
	
	if (lessonData["Environment"] == "Globe") {
		requestAnimationFrame(renderGlobe);
	} else {
		document.getElementById("glcanvas").remove();

	}
	
	}
}


