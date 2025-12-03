class Executor { //executes code
	constructor(iRoot, iCanvas, iData, iManager, iCollection) {
		console.log("Executor enabled");
		
		this.root = iRoot;
		this.canvas = iCanvas;
		this.data = iData;
		this.typeManager = iManager;
		this.dropCollecton = iCollection;

		this.playButtonStatus;
		this.generatePlayButton();
		this.agent = {};
		this.labels = [];
		this.agent.start = this.data["Start"];
		this.generateAgent();
		this.navBar; 	
		this.navBlocks = [];	
		this.generateNavigationInfo();
	}
	
	generatePlayButton() {
		this.playButton = document.createElement("div");
		this.playButton.style.width = "100px";
		this.playButton.style.height = "100px";
		this.playButton.style.position = "absolute";
		this.playButton.style.right = "280px";
		this.playButton.style.bottom = "calc(50vh + 330px)";
		this.playButton.style.zIndex = "1";
		this.playButton.style.pointerEvents = 'none';
		this.canvas.parentNode.appendChild(this.playButton);
		
		this.playButton.innerHTML =  `<svg width="100" height="100"><circle cx="50" cy="50" r="45" fill="White" stroke="${Palette[4][0]}" stroke-width="4" /> <polygon points="80,50 35,76 35,24" stroke-width="4" fill="none" stroke="${Palette[4][0]}" /> </svg>`;
	
		this.playButton.querySelector("circle").style.pointerEvents = 'visibleFill';
		this.playButton.querySelector("circle").style.cursor = 'pointer';

		this.playButton.querySelector("circle").addEventListener('click', async () => {
			if (this.playButtonStatus != "Playing") { 
				this.playButtonStatus = "Playing"; 
				await this.playButton.querySelector("polygon").setAttribute("points", "30,70 70,70 70,30 30,30");
				this.executeSequence();
			} else { 
				this.playButtonStatus = "Paused";
				this.playButton.querySelector("polygon").setAttribute("points", "80,50 35,76 35,24");
			} 
		});
	}

	forceStop() {
		this.playButtonStatus = "Paused";		
		this.playButton.querySelector("polygon").setAttribute("points", "80,50 35,76 35,24");
	}

	generateAgent() {
		console.log("Generating the Agent");
		this.agent.index = this.agent.start;
		this.agent.longitude = this.data["Vertices"][this.agent.start]["Longitude"];
		this.agent.latitude = this.data["Vertices"][this.agent.start]["Latitude"];
		this.agent.name = this.data["Vertices"][this.agent.start]["Name"];
		this.labels = [this.agent.index];
	
		this.agent.blob = new Blob([this.data["Agent_Icon"]], {type: "image/svg+xml;charset=utf-8"});
		this.agent.url = URL.createObjectURL(this.agent.blob);
		let localImg = new Image();
		localImg.src = this.agent.url;
		
		localImg.onload = () => { this.agent.img = localImg; }
	}

	getAgentInfo() {
		return this.agent;
	}

	getAdjacent(n) {
		let temp = [];
		for (let e of this.data["Edges"]) {
			if (e[0] == n || e[1] == n) {
				temp.push(e)
			}
		}
		return temp;
	}

	getNeighbors(n) {
		let adj = this.getAdjacent(n);
		let temp = [];
		for (let e of adj) {
			if (e[0] != n) {
				temp.push(e[0]);
			} else if (e[1] != n) {
				temp.push(e[1]);
			}
		}
		return temp;
	}

	generateNavigationInfo() {
		this.navBar = document.createElement("div");
		this.navBar.style.width = "600px";
		this.navBar.style.height = "30px";
		this.navBar.style.position = "absolute";
		this.navBar.style.right = "30px";
		this.navBar.style.bottom = "calc(50vh + 300px)";
		this.navBar.style.zIndex = "1";
		this.navBar.style.pointerEvents = 'none';
		this.canvas.parentNode.appendChild(this.navBar);
		this.updateNavigationInfo();
	}

	updateNavigationInfo() {
		this.navBar.innerHTML = "";
		let leftSide = 10;
		let hereDt = this.data["Code"]["Functions"]["Here"];
		let hereBlck = new programBlock("Here", hereDt["type"], hereDt["text"], hereDt["inputs"], null, leftSide, 0, this.typeManager, this.navBar);
		hereBlck.dropsiteCollection = this.dropCollecton;
		hereBlck.IDnum = 0;
		hereBlck.update();
		leftSide += hereBlck.mainBlock.style.width + 12;
		let txtBlck = document.createElement("div");
		txtBlck.style.position = "absolute";
		txtBlck.style.left = leftSide + "px";
		txtBlck.innerHTML = "is";
		txtBlck.style.top = "3px";
		this.navBar.appendChild(txtBlck);
		leftSide += 30;
		//console.log(this.data["Vertices"][this.agent.index].Name);
		let locDt = this.data["Code"]["Functions"][this.data["Vertices"][this.agent.index].Name];
		let locBlck = new programBlock(this.data["Vertices"][this.agent.index].Name, locDt["type"], locDt["text"], locDt["inputs"], null, leftSide, 0, this.typeManager, this.navBar);
		locBlck.dropsiteCollection = this.dropCollecton;
		locBlck.IDnum = 0;
		locBlck.update();
		leftSide += locBlck.mainBlock.style.width + 20;
		
		let neiDt = this.data["Code"]["Functions"]["Neighbor"];
		console.log(neiDt);
		let neiBlck = new programBlock("Neighbor", neiDt["type"], neiDt["text"], neiDt["inputs"], null, leftSide, 0, this.typeManager, this.navBar);
		neiBlck.dropsiteCollection = this.dropCollecton;
		neiBlck.IDnum = 0;
		neiBlck.mainBlock.style.rawText = "Neighbors";
		neiBlck.update();
		leftSide += neiBlck.mainBlock.style.width + 12;
		this.navBlocks.push(hereBlck, locBlck, neiBlck);
		for (let n of this.getNeighbors(this.agent.index)) {
			let dt = this.data["Code"]["Functions"][this.data["Vertices"][n].Name];
			//console.log(this.data["Vertices"][n].Name, this.data["Code"]["Functions"]);
			console.log(this.data["Vertices"][n].Name);
			let blck = new programBlock(this.data["Vertices"][n].Name, dt["type"], dt["text"], dt["inputs"], null, leftSide, 0, this.typeManager, this.navBar);
			leftSide += blck.mainBlock.style.width + 5;
			blck.dropsiteCollection = this.dropCollecton;
			blck.IDnum = 0;
			blck.update();
			this.navBlocks.push(blck);
		}
	}

	async moveTo(iLatitude, iLongitude, rate) {
		return new Promise((resolve) => {
			const startTime = performance.now();
			const p1 = toRect(Math.PI * this.agent.latitude/180, -Math.PI * this.agent.longitude/180 + Math.PI/2);
			const p2 = toRect(Math.PI * iLatitude/180, -Math.PI * iLongitude/180 + Math.PI/2);
			let n1 = Math.sqrt(p1[0]*p1[0]+p1[1]*p1[1]+p1[2]*p1[2]);
			let n2 = Math.sqrt(p2[0]*p2[0]+p2[1]*p2[1]+p2[2]*p2[2]);
			let p3 = [p1[0]/n1, p1[1]/n1, p1[2]/n1, 1,0,0];
			let p4 = [p2[0]/n2, p2[1]/n2, p2[2]/n2, 0,0,0];
			let dotv = (p3[0]*p2[0]+p3[1]*p2[1]+p3[2]*p2[2]);
			let p5 = [p2[0] - dotv*p3[0], p2[1] - dotv*p3[1], p2[2] - dotv*p3[2]];

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

			function interpolate(t) {
				let angle = (t - startTime) * rate;
				if (angle <  Math.atan2(coeff1, coeff2)) {
					let Ax = (basisX[0]*Math.cos(angle) + basisY[0]*Math.sin(angle));
					let Ay = (basisX[1]*Math.cos(angle) + basisY[1]*Math.sin(angle));
					let Az = (basisX[2]*Math.cos(angle) + basisY[2]*Math.sin(angle));
					this.agent.latitude = 180 * toSphere(Ax, Ay, Az)[0] / Math.PI;
		  			this.agent.longitude = -((180/Math.PI) * (toSphere(Ax, Ay, Az)[1] - Math.PI/2));
					requestAnimationFrame(interpolate.bind(this));
				} else {
					this.agent.latitude = iLatitude;
					this.agent.longitude = iLongitude;
					//this.updateNavigationInfo();
					resolve();	
				}
			}
			
			requestAnimationFrame(interpolate.bind(this));	
		});
	}

	async executeSequence() {
		await this.root[0].execute(this);
	//	this.playButtonStatus = "Paused";
	//	this.playButton.querySelector("polygon").setAttribute("points", "80,50 35,76 35,24");
	}
}

function toRect(ph, th) {
	return  [Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph)];
}

function toSphere(x, y, z) {
	return [Math.atan2(z, Math.sqrt(x*x + y*y)), Math.atan2(y,x), Math.sqrt(x*x + y*y + z*z)];
}
