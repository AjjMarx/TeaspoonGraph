const Palette = {
	Red : "#F75454",
	Orange : "#E6A45A",
	Yellow : "#E3D12D",
	Lime : "#9FEB81", 
	Green : "#3EB56F",
	Aqua : "#5ED6D0",
	Blue : "#39A2E3",
	Purple : "#9F6FF2",
	Pink : "#F299E3" 
}

class Block {
	constructor() {
		this.container = document.createElement("div");

		console.log("Block generated");

		this.container.style.width = "150px";
		this.container.style.height = "100px";
		this.container.style.margin = "30px";


		this.style = {
			width : 50,
			height : 32,
			left : 0,
			right : 0,
			color : "Red",
			size : null,
			edgeShapes : ["Straight", "Puzzle", "Straight", "Puzzle"],
			text : "Trade $1 $2 For $3 $4"
		};

		this.style.width = this.style.text.length * 9 + 24;
	
		this.container.innerHTML = this.generateSVG();
	}

	update() {
		
	}

	generateSVG() {
		//console.log(this.style);
		let temp = `<svg width="` + (16 + this.style.width) + `" height="` + (16 + this.style.height) + `">`;
		//temp += `<rect x="8" y="8" width="` + this.style.width  + `" height="` + this.style.height + `" stroke="red" stroke-width="1" fill="white"/>`;
		
		temp += `<polygon points="`;
		
		temp += `8,` + (8 + this.style.height) + ` `;
		temp += `8,8 `;
		if (this.style.edgeShapes[1] == "Straight") {
			console.log("Top:Straight");
			temp += (8 + this.style.width) + `,8 `;	
		} else if (this.style.edgeShapes[1] == "Puzzle") {
			console.log("Top:Puzzle");
			temp += `16,8 24,15 32,15 40,8 ` + (8 + this.style.width) + `,8 `;	
		}		
		temp += (8 + this.style.width) + `,` + (8 + this.style.height) + ` `;
		if (this.style.edgeShapes[3] == "Straight") {
			temp += `8,` + (8 + this.style.height) + ` `;
		} else if (this.style.edgeShapes[3] == "Puzzle") {
			temp += '38,' + (8 + this.style.height) + ' 31,' + (13 + this.style.height) + ' 25,' + (13 + this.style.height) + ' 18,' + (8 + this.style.height)  + ` 8,` + (8 + this.style.height) + ` `;
		}
			
		temp += `" fill="` + Palette[this.style.color]  + `"/>`;
		temp += `<text fill="#ffffff" font-size="18" ` + `x="16" y="` + (16 +this.style.height/2)+ `"` + `>` + this.style.text + ` </text>`;
		temp += `</svg>`;
		return temp;

	}
}
