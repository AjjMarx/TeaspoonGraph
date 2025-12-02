class Executor { //executes code
	constructor(iRoot, iCanvas) {
		console.log("Executor enabled");
		
		this.root = iRoot;
		this.canvas = iCanvas;
		
		this.generatePlayButton(), this.playButtonStatus;		
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
			console.log(`play button: ${this.playButtonStatus}`);
		});
	}

	executeSequence() {
		console.log("Beginning execution from root");
		this.root[0].execute();
	}
}
