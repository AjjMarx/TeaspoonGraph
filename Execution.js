class Executor { //executes code
	constructor(iRoot, iCanvas, iData) {
		console.log("Executor enabled");
		
		this.root = iRoot;
		this.canvas = iCanvas;
		this.data = iData;

		this.playButtonStatus;
		this.generatePlayButton();
		this.agent = {};
		this.labels = [];
		this.agent.start = this.data["Start"];
		this.generateAgent(); 		
	}
	
	generatePlayButton() {
		this.playButton = document.createElement("div");
		this.playButton.style.width = "100px";
		this.playButton.style.height = "100px";
		this.playButton.style.position = "absolute";
		this.playButton.style.right = "280px";
		this.playButton.style.bottom = "calc(50vh + 300px)";
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

	generateAgent() {
		console.log("Generating the Agent");
		this.agent.index = this.agent.start;
		this.agent.longitude = this.data["Vertices"][this.agent.start]["Longitude"];
		this.agent.latitude = this.data["Vertices"][this.agent.start]["Latitude"];
		this.agent.name = this.data["Vertices"][this.agent.start]["Name"];
		this.labels = [this.agent.index];
	
		console.log(this.data["Agent_Icon"]);	
		this.agent.blob = new Blob([this.data["Agent_Icon"]], {type: "image/svg+xml;charset=utf-8"});
		this.agent.url = URL.createObjectURL(this.agent.blob);
		let localImg = new Image();
		localImg.src = this.agent.url;
		
		localImg.onload = () => { this.agent.img = localImg; }

		console.log(this.agent, this.getNeighbors(this.agent.index));
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

	async executeSequence() {
		await this.root[0].execute();
		this.playButtonStatus = "Paused";
		this.playButton.querySelector("polygon").setAttribute("points", "80,50 35,76 35,24");
	}
}
