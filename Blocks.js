const Palette = [
	["#F75454", "Red"],
	["#E6A45A", "Orange"],
	["#E7C54B", "Yellow"],
	["#9FEB81", "Lime"], 
	["#3EB56F", "Green"],
	["#46C0AC", "Aqua"],
	["#39A2E3", "Blue"],
	["#9F6FF2", "Purple"],
	["#F299E3", "Pink"],
	["#FFFFFF", "White"] 
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
	Pink: 8,
	White: 9
};

class Block {
	constructor() {
		this.container = document.createElement("div");
		this.hitBox = document.createElement("div");

		this.container.id = "Block";
		this.container.style.position = "absolute";
		this.hitBox.style.position = "absolute";

		this.style = {
			width : 50,
			height : 28,
			innerHeight : 0,
			left : 0,
			top : 0,
			color : "Orange",
			size : "Normal",
			edgeShapes : ["Straight", "Straight", "Straight", "Straight"],
			text : "Null",
		};
		this.shift = 0;

		this.style.width = this.style.text.length * 8 + 24;
	
		this.container.innerHTML = this.generateSVG();

		//this.update();
	}

	update() {
		
		if (this.style.size == "Normal") {
			this.style.width = getStringWidth(this.style.text) + 16;
			this.container.style.left = String(this.style.left - 8) + "px";
			this.container.style.top = String(this.style.top - 8) + "px";
			this.container.style.width = (this.style.width + 16) + "px";
			this.container.style.height = (this.style.height + 16) + "px";
			this.hitBox.style.left = "8px";
			this.hitBox.style.top = "8px";
			this.hitBox.style.width = String(this.style.width) + "px";
			this.hitBox.style.height = String(this.style.height) + "px";
		} else if (this.style.size == "Small") {
			this.style.width = getStringWidth(this.style.text) + 16 ;
			this.container.style.left = String(this.style.left - 8) + "px";
			this.container.style.top = String(this.style.top - 8) + "px";
			this.container.style.width = (this.style.width + 16) + "px";
			this.container.style.height = (this.style.height + 16) + "px";
			this.hitBox.style.left = "8px";
			this.hitBox.style.top = "12px";
			this.hitBox.style.width = String(this.style.width ) + "px";
			this.hitBox.style.height = String(this.style.height - 8) + "px";
		} if (this.style.size == "Bracket") {
			this.style.innerHeight = 32;
			this.style.height += this.style.innerHeight;
			this.style.width = getStringWidth(this.style.text) + 16;
			this.container.style.left = String(this.style.left - 8) + "px";
			this.container.style.top = String(this.style.top - 8) + "px";
			this.container.style.width = (this.style.width + 16) + "px";
			this.container.style.height = (this.style.height + 24) + "px";
			this.hitBox.style.left = "8px";
			this.hitBox.style.top = "8px";
			this.hitBox.style.width = String(this.style.width) + "px";
			this.hitBox.style.height = String(this.style.height - this.style.innerHeight) + "px";
		}
		this.container.innerHTML = this.generateSVG();
		this.container.appendChild(this.hitBox);
	}

	getBottom() {
		if (this.style.size == "Normal") {
			return this.style.top + this.style.height + 1;
		} else if (this.style.size == "Small") {
			return this.style.top + this.style.height + 1;
		} else if (this.style.size == "Bracket") {
			return this.style.top + this.style.height + 5;
		}
	}

	generateSVG() {
		let temp;
		if (this.style.size == "Bracket") {
			temp = `<svg width="` + (32 + this.style.width) + `" height="` + (24 + this.style.height) + `">`;
		} else {
			temp = `<svg width="` + (32 + this.style.width) + `" height="` + (16 + this.style.height) + `">`;
		}		

		temp += `<polygon points="`;
		
		if (this.style.size == "Normal") {	
			if (this.style.edgeShapes[0] == "Straight") {
				temp += `8,` + (8 + this.style.height) + ` 8,8 `;
			} else if (this.style.edgeShapes[0] == "Angle") {
				temp += `0,` + (8 + this.style.height/2) + ` 8,8 `;
			} else if (this.style.edgeShapes[2] == "Round") { 
				for (let i = 0; i < 3.14159; i+=0.39269) {
					temp += (12 - 0.75*Math.sin(i)*this.style.height/2) + `,` + (8 + this.style.height/2 + Math.cos(i)*this.style.height/2) + ` `;
				}
			} else if (this.style.edgeShapes[2] == "Arrow") {
				temp += ` 8,` + (8 + this.style.height);
				temp += ` 9,` + (8 + this.style.height * 0.75); 
				temp += ` 6,` + (8 + this.style.height * 0.75); 
				temp += ` 6,` + (8 + this.style.height); 
				temp += ` 0,` + (8 + this.style.height/2); 
				temp += ` 6,8`; 
				temp += ` 6,` + (8 + this.style.height * 0.25); 
				temp += ` 9,` + (8 + this.style.height * 0.25); 
				temp += ` 8,8 `;
			}

			if (this.style.edgeShapes[1] == "Straight") {
				temp += (8 + this.style.width) + `,8 `;	
			} else if (this.style.edgeShapes[1] == "Puzzle") {
				temp += `16,8 24,15 32,15 40,8 ` + (8 + this.style.width) + `,8 `;	
			}		

			if (this.style.edgeShapes[2] == "Straight") {
				temp += (8 + this.style.width) + `,` + (8 + this.style.height) + ` `;
			} else if (this.style.edgeShapes[2] == "Angle") {
				temp += (16 + this.style.width) + `,` + (8 + this.style.height/2) + ` ` + (8 + this.style.width) + `,` + (8 + this.style.height) + ` `;
			} else if (this.style.edgeShapes[2] == "Round") {
				for (let i = 3.14159; i > 0; i-=0.39269) {
					temp += (8 + this.style.width + 0.75*Math.sin(i)*this.style.height/2) + `,` + (8 + this.style.height/2 + Math.cos(i)*this.style.height/2) + ` `;
				}
			} else if (this.style.edgeShapes[2] == "Arrow") {
				temp += (7 + this.style.width) + `,` + (8 + this.style.height/4) + ` `;
				temp += (10 + this.style.width) + `,` + (8 + this.style.height/4) + ` `;
				temp += (10 + this.style.width) + `,` + (8) + ` `;
				temp += (16 + this.style.width) + `,` + (8 + this.style.height/2) + ` `;
				temp += (10 + this.style.width) + `,` + (8 + this.style.height) + ` `;
				temp += (10 + this.style.width) + `,` + (8 + this.style.height * 0.75) + ` `;
				temp += (7 + this.style.width) + `,` + (8 + this.style.height * 0.75) + ` `;
				temp += (8 + this.style.width) + `,` + (8 + this.style.height) + ` `;
			}

			if (this.style.edgeShapes[3] == "Straight") {
				temp += `8,` + (8 + this.style.height) + ` `;
			} else if (this.style.edgeShapes[3] == "Puzzle") {
				temp += '39.3,' + (8 + this.style.height) + ' 31.3,' + (15 + this.style.height) + ' 24.7,' + 
				(15 + this.style.height) + ' 16.7,' + (8 + this.style.height)  + ` 8,` + (8 + this.style.height) + ` `;
			}
		} else if (this.style.size == "Small") {	
			if (this.style.edgeShapes[0] == "Straight") {
				temp += `12,` + (4 + this.style.height) + ` 12,12 `;
			} else if (this.style.edgeShapes[0] == "Angle") {
				temp += `4,` + (8 + this.style.height/2) + ` 12,12 `;
			} else if (this.style.edgeShapes[2] == "Round") { 
				for (let i = 3.14159; i > 0; i-=0.39269) {
					temp += (16 + Math.sin(i)*(4 - this.style.height/2)) + `,` + (8 + this.style.height/2 + Math.cos(i)*(4 - this.style.height/2)) + ` `;
				}
			} else if (this.style.edgeShapes[2] == "Arrow") {
				temp += ` 12,` + (4 + this.style.height);
				temp += ` 13,` + (8 + this.style.height * 0.66); 
				temp += ` 10,` + (8 + this.style.height * 0.66); 
				temp += ` 10,` + (4 + this.style.height); 
				temp += ` 2,` + (8 + this.style.height/2); 
				temp += ` 10,12`; 
				temp += ` 10,` + (8 + this.style.height * 0.33); 
				temp += ` 13,` + (8 + this.style.height * 0.33); 
				temp += ` 12,12 `;
			}

			temp += (4 + this.style.width) + `,12 `;	

			if (this.style.edgeShapes[2] == "Straight") {
				temp += (4 + this.style.width) + `,` + (4 + this.style.height) + ` `;
			} else if (this.style.edgeShapes[2] == "Angle") {
				temp += (12 + this.style.width) + `,` + (8 + this.style.height/2) + ` ` + (4 + this.style.width) + `,` + (4 + this.style.height) + ` `;
			} else if (this.style.edgeShapes[2] == "Round") {
				for (let i = 0; i < 3.14159; i+=0.39269) {
					temp += (0 + this.style.width - Math.sin(i)*(4 - this.style.height/2)) + `,` + (8 + this.style.height/2 + Math.cos(i)*(4 - this.style.height/2)) + ` `;
				}
			} else if (this.style.edgeShapes[2] == "Arrow") {
				temp += (3 + this.style.width) + `,` + (8 + this.style.height/3) + ` `;
				temp += (6 + this.style.width) + `,` + (8 + this.style.height/3) + ` `;
				temp += (6 + this.style.width) + `,` + (12) + ` `;
				temp += (12 + this.style.width) + `,` + (8 + this.style.height/2) + ` `;
				temp += (6 + this.style.width) + `,` + (4 + this.style.height) + ` `;
				temp += (6 + this.style.width) + `,` + (8 + this.style.height * 0.66) + ` `;
				temp += (3 + this.style.width) + `,` + (8 + this.style.height * 0.66) + ` `;
				temp += (4 + this.style.width) + `,` + (4 + this.style.height) + ` `;
			}

			temp += `12,` + (4 + this.style.height) + ` `;
		} else if (this.style.size == "Bracket") {
			let tHeight = this.style.height - this.style.innerHeight;	
			temp += `8,` + (8 + tHeight) + ` 8,8 `;

			if (this.style.edgeShapes[1] == "Straight") {
				temp += (8 + this.style.width) + `,8 `;	
			} else if (this.style.edgeShapes[1] == "Puzzle") {
				temp += `16,8 24,15 32,15 40,8 ` + (8 + this.style.width) + `,8 `;	
			} else if (this.style.edgeShapes[1] == "Cap") {
				temp += `20,0 44,0 56,8 `;
				temp += (8 + this.style.width) + `,8 `;
			}		

			temp += (8 + this.style.width) + `,` + (8 + tHeight) + ` `;
			
			temp += '47.3,' + (8 + tHeight) + ' 39.3,' + (15 + tHeight) + ' 32.7,' + 
			(15 + tHeight) + ' 24.7,' + (8 + tHeight)  + ` 15,` + (8 + tHeight) + ` ` +
			`15,` + (this.style.height) + ` 24.7, ` + (this.style.height) + ` 32.7,` + (this.style.height + 7) + 
			` 39.3,` + (this.style.height + 7) + ' 47.3,' + (this.style.height) + 
			` 58,` + (this.style.height) + ` 58,` + (this.style.height + 12) + ` `; 
			
			if (this.style.edgeShapes[3] == "Straight") {
				temp += `8,` + (12 + this.style.height) + ` `;
			} else if (this.style.edgeShapes[3] == "Puzzle") {
				temp += '39.3,' + (12 + this.style.height) + ' 31.3,' + (19 + this.style.height) + ' 24.7,' + 
				(19 + this.style.height) + ' 16.7,' + (12 + this.style.height)  + ` 8,` + (12 + this.style.height) + ` `;
			}
		}


		temp += `" fill="` + Palette[PaletteReverse[this.style.color]][0]  + `"/>`;
		temp += `<text fill="#ffffff" font-size="15" style="user-select: none;" x="16" y="` + (14 +(this.style.height - this.style.innerHeight)/2)+ `"` + `>` + this.style.text + ` </text>`;
		temp += `</svg>`;
		
		return temp;
	}
}

class typeManager {
	constructor() {
		this.map = new Map();	
	}

	add(iName, iColor, iSize, iEdgeShapes) {
		this.map.set(iName, {"Color": iColor, "Size": iSize, "EdgeShapes": iEdgeShapes});
	}

	getColor(iType) {
		return this.map.get(iType.replace(/^#/, ""))["Color"];
	}
	
	getSize(iType) {
		return this.map.get(iType.replace(/^#/, ""))["Size"];
	}

	getEdgeShapes(iType) {
		return this.map.get(iType.replace(/^#/, ""))["EdgeShapes"];
	}
}

class programBlock {
	constructor(iType, iText, iInputTypes, iLeft, iTop, iTypeManager, iContainer) {
		this.type = iType;
		this.text = iText;
		this.inputTypes = iInputTypes;
		this.left = iLeft;
		this.top = iTop;
		this.typeManager = iTypeManager;
		this.container = iContainer;
		
		this.inputs = [];
		this.canHaveChildren = false;
		this.children = [];
		this.width = 0;
		this.height = 0;
		this.code = this.blankFunction;
	
		this.generateBlock();
	}

	generateBlock() {
		this.mainBlock = new Block();
		this.mainBlock.style.left = this.left;
		this.mainBlock.style.top = this.top;
		this.mainBlock.style.color = this.typeManager.getColor(this.type);
		this.mainBlock.style.size = this.typeManager.getSize(this.type);
		this.mainBlock.style.edgeShapes = this.typeManager.getEdgeShapes(this.type);
		this.mainBlock.style.text = this.text;
		this.container.appendChild(this.mainBlock.container);
//		console.log(this.inputTypes);
		this.mainBlock.update();
		if (this.inputTypes && this.inputTypes.length > 0) {
			this.subBlocks = [];
			let firstHalf = "";
			let remainder = this.text;
			let index = 0;
			let pShift = 12;
			//console.log("program block has " + this.inputTypes.length + "input types: ")
			for (let types in this.inputTypes) {
				//console.log(this.inputTypes[types]);
				//console.log(types);
				console.log(`$` + String(parseInt(types) + 1));
				index = remainder.indexOf(`$` + String(parseInt(types) + 1));
				firstHalf = remainder.substring(0, index);
				remainder = remainder.substring(index);
				console.log(firstHalf + "    " + remainder);
				this.subBlocks[types] = new Block();
				this.subBlocks[types].style.left = pShift + getStringWidth(firstHalf);
				this.subBlocks[types].style.top = 10;
				this.subBlocks[types].style.height = 24;
				this.subBlocks[types].style.color = "White";
				this.subBlocks[types].style.size = "Small";
				this.subBlocks[types].style.text = " ";
				this.subBlocks[types].style.edgeShapes = ["Straight", "Straight", "Straight", "Straight"];
				this.mainBlock.container.appendChild(this.subBlocks[types].container);	
				this.subBlocks[types].update();
				console.log(this.subBlocks[types].style.height);

				pShift += getStringWidth(firstHalf);
			}
		} 
	
	}
	
	update() {
		this.mainBlock.update();
	}

	async blankFunction() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	setPosition(iLeft, iTop) {
		this.left = iLeft;
		this.top = iTop;
		this.mainBlock.style.left = this.left;
		this.mainBlock.style.top = this.top;
		this.update();
	}
		
	setText(iText) {
		this.text = iText;
		this.mainBlock.style.text = this.text;
		this.update();
	}
	
	getBottom() {
		return this.mainBlock.getBottom();
	}

	execute() {
		console.log("Executing")
	}

	deleteBlock() {

	}
}

const sampleCanvas = document.createElement("canvas");
const sampleCanvasContext = sampleCanvas.getContext('2d');
sampleCanvasContext.font = "15px 'Roboto Mono', monospace";

function getStringWidth(str) {
	const textMeasure = sampleCanvasContext.measureText(str);
	return textMeasure.width;
}
