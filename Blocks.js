const Palette = [
	["#F75454", "Red"],
	["#E6A45A", "Orange"],
	["#E3D12D", "Yellow"],
	["#9FEB81", "Lime"], 
	["#3EB56F", "Green"],
	["#5ED6D0", "Aqua"],
	["#39A2E3", "Blue"],
	["#9F6FF2", "Purple"],
	["#F299E3", "Pink"] 
];

const PaletteReverse = {
	Red : 0,
	Orange : 1,
	Yellow : 2,
	Lime : 3,
	Green : 4,
	Aqua : 5,
	Blue : 6,
	Purple : 7,
	Pink: 8
};

class Block {
	constructor() {
		this.container = document.createElement("div");
		this.hitBox = document.createElement("div");

		this.container.id = "Block";
		this.container.style.position = "absolute";
		this.container.appendChild(this.hitBox);
		this.hitBox.style.position = "relative";

		this.style = {
			width : 50,
			height : 32,
			left : 0,
			top : 0,
			color : "Orange",
			size : null,
			edgeShapes : ["Straight", "Puzzle", "Straight", "Puzzle"],
			text : "Trade $1 $2 For $3 $4"
		};

		this.style.width = this.style.text.length * 8 + 24;
	
		this.container.innerHTML = this.generateSVG();

		//this.update();
	}

	update() {
		this.style.width = this.style.text.length * 8 + 24;
		this.container.style.left = String(this.style.left - 8) + "px";
		this.container.style.top = String(this.style.top - 8) + "px";
		this.container.style.width = String(16 + this.style.width) + "px";
		this.container.style.height = String(16 + this.style.height) + "px";
		this.hitBox.style.left = "8px";
		this.hitBox.style.top = "8px";
		this.hitBox.style.width = String(this.style.width) + "px";
		this.hitBox.style.height = String(this.style.height) + "px";
		this.container.innerHTML = this.generateSVG();
	}

	getBottom() {
		return this.style.top + this.style.height + 1;
	}

	generateSVG() {
		let temp = `<svg width="` + (16 + this.style.width) + `" height="` + (16 + this.style.height) + `">`;
		
		temp += `<polygon points="`;
		
		temp += `8,` + (8 + this.style.height) + ` `;
		temp += `8,8 `;
		if (this.style.edgeShapes[1] == "Straight") {
			temp += (8 + this.style.width) + `,8 `;	
		} else if (this.style.edgeShapes[1] == "Puzzle") {
			temp += `16,8 24,15 32,15 40,8 ` + (8 + this.style.width) + `,8 `;	
		}		
		temp += (8 + this.style.width) + `,` + (8 + this.style.height) + ` `;
		if (this.style.edgeShapes[3] == "Straight") {
			temp += `8,` + (8 + this.style.height) + ` `;
		} else if (this.style.edgeShapes[3] == "Puzzle") {
			temp += '39.3,' + (8 + this.style.height) + ' 31.3,' + (15 + this.style.height) + ' 24.7,' + (15 + this.style.height) + ' 16.7,' + (8 + this.style.height)  + ` 8,` + (8 + this.style.height) + ` `;
		}
		console.log(this.style.color);
		temp += `" fill="` + Palette[PaletteReverse[this.style.color]][0]  + `"/>`;
		temp += `<text fill="#ffffff" font-size="16" ` + `x="16" y="` + (14 +this.style.height/2)+ `"` + `>` + this.style.text + ` </text>`;
		temp += `</svg>`;
		return temp;

	}
}
