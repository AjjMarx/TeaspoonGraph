class Block {
	constructor() {
		this.container = document.createElement("div");

		console.log("Block generated");

		this.container.style.width = "150px";
		this.container.style.height = "100px";
		this.container.style.margin = "30px";


		this.style = {
			width : 100,
			height : 32,
			left : 0,
			right : 0,
			color : "Black",
			size : null,
			edgeShapes : ["Straight", "Puzzle", "Straight", "Puzzle"],
			text : null
		};

	
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
			temp += `16,8 24,16 32,16 40,8 ` + (8 + this.style.width) + `,8 `;	
		}		
		temp += (8 + this.style.width) + `,` + (8 + this.style.height) + ` `;
		if (this.style.edgeShapes[3] == "Straight") {
			temp += `8,` + (8 + this.style.height) + ` `;
		} else if (this.style.edgeShapes[3] == "Puzzle") {
			temp += '40,' + (8 + this.style.height) + ' 32,' + (16 + this.style.height) + ' 24,' + (16 + this.style.height) + ' 16,' + (8 + this.style.height)  + ` 8,` + (8 + this.style.height) + ` `;
		}
			
		temp += `" stroke="red" stroke-width="1" fill="white"/>`;

		temp += `</svg>`;
		return temp;
	}
}
