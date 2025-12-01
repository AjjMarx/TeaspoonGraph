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
		this.svg = document.createElement("div");

		this.container.id = "Block";
		this.container.style.position = "absolute";
		this.svg.style.position = "absolute";
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
	
		this.svg.innerHTML = this.generateSVG();
		this.svg.firstChild.addEventListener("dragstart", e => e.preventDefault());
		this.svg.firstChild.lastChild.addEventListener("dragstart", e => e.preventDefault());
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
			//this.style.height += this.style.innerHeight;
			this.style.width = getStringWidth(this.style.text) + 16;
			this.container.style.left = String(this.style.left - 8) + "px";
			this.container.style.top = String(this.style.top - 8) + "px";
			this.container.style.width = (this.style.width + 16) + "px";
			this.container.style.height = (this.style.height + this.style.innerHeight + 24) + "px";
			this.hitBox.style.left = "8px";
			this.hitBox.style.top = "8px";
			this.hitBox.style.width = String(this.style.width) + "px";
			this.hitBox.style.height = String(this.style.height) + "px";
		}
		this.svg.innerHTML = this.generateSVG();
		this.svg.firstChild.addEventListener("dragstart", e => e.preventDefault());
		this.svg.firstChild.lastChild.addEventListener("dragstart", e => e.preventDefault());
		this.container.appendChild(this.svg);
		this.container.appendChild(this.hitBox);
	}

	setInnerHeight(val) {
		this.style.innerHeight = val;
	}

	getBottom() {
		if (this.style.size == "Normal") {
			return this.style.top + this.style.height + 1;
		} else if (this.style.size == "Small") {
			return this.style.top + this.style.height + 1;
		} else if (this.style.size == "Bracket") {
			return this.style.top + this.style.height + this.style.innerHeight + 11;
		}
	}

	getTotalHeight() {
		if (this.style.size == "Bracket") {
			return this.style.height + this.style.innerHeight + 14;
		} else {
			return this.style.height + 4;
		}
	}

	generateSVG() {
		let temp;
		if (this.style.size == "Bracket") {
			temp = `<svg width="` + (32 + this.style.width) + `" height="` + (26 + this.style.height + this.style.innerHeight) + `">`;
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
			let tHeight = this.style.height;
			let totHeight = this.style.height + this.style.innerHeight + 6;	
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
			`15,` + (totHeight) + ` 24.7, ` + (totHeight) + ` 32.7,` + (totHeight + 7) + 
			` 39.3,` + (totHeight + 7) + ' 47.3,' + (totHeight) + 
			` 58,` + (totHeight) + ` 58,` + (totHeight + 12) + ` `; 
			
			if (this.style.edgeShapes[3] == "Straight") {
				temp += `8,` + (12 + totHeight) + ` `;
			} else if (this.style.edgeShapes[3] == "Puzzle") {
				temp += '39.3,' + (12 + totHeight) + ' 31.3,' + (19 + totHeight) + ' 24.7,' + 
				(19 + totHeight) + ' 16.7,' + (12 + totHeight)  + ` 8,` + (12 + totHeight) + ` `;
			}
		}


		temp += `" fill="` + Palette[PaletteReverse[this.style.color]][0]  + `"/>`;
		temp += `<text fill="#ffffff" font-size="15" style="user-select: none; pointer-events: none; -webkit-user-select: none; -moz-user-select: none;" x="16" y="` + (14 +(this.style.height)/2)+ `"` + `>` + this.style.text + ` </text>`;
		temp += `</svg>`;
		return temp;
	}
}

class typeManager {
	constructor() {
		this.typeMap = new Map();
		this.functionMap = new Map();
	}

	addType(iName, iColor, iSize, iEdgeShapes) {
		this.typeMap.set(iName, {"Color": iColor, "Size": iSize, "EdgeShapes": iEdgeShapes});
	}
	
	addFunction(iDefault, iType, iText, iInput, iCode) {
		this.functionMap.set(iDefault, {"Type" : iType, "Text" : iText, "Input" : iInput, "Code" : iCode});
	}
	
	getFunctionData(iDefault) {
		if (this.functionMap.get(iDefault)) {
			return this.functionMap.get(iDefault);
		} else { return "err"; }
	}

	contains(iType) {
		return !(this.typeMap.get(iType.replace(/^#/, "")) == null);
	}

	getColor(iType) {
		return this.typeMap.get(iType.replace(/^#/, ""))["Color"];
	}
	
	getSize(iType) {
		return this.typeMap.get(iType.replace(/^#/, ""))["Size"];
	}

	getEdgeShapes(iType) {
		return this.typeMap.get(iType.replace(/^#/, ""))["EdgeShapes"];
	}
}

class programBlock {
	constructor(iDefault, iType, iText, iInputTypes, iLeft, iTop, iTypeManager, iContainer) {
		this.defaultName = iDefault
		this.type = iType;
		this.text = iText;
		this.inputTypes = iInputTypes;
		this.left = iLeft;
		this.top = iTop;
		this.typeManager = iTypeManager;
		this.container = iContainer;
		this.dropsiteCollection = null;
		
		this.canDrag = true;
		this.inputs = [];
		this.children = [];
		this.dropSites = {};
		if (this.typeManager.getSize(this.type) == "Bracket") {
			this.canHaveChildren = true;
		} else {
			this.canHaveChildren = false;
		}
		this.parent = null;
		this.width = 0;
		this.height = 0;
		this.code = this.blankFunction;

		this.IDnum = crypto.randomUUID();
	
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
		if (this.mainBlock.style.size == "Bracket") {
			this.mainBlock.style.innerHeight = 20;
		}
		this.container.appendChild(this.mainBlock.container);
		this.mainBlock.update();
		this.mainBlock.hitBox.draggable = this.canDrag;
		if (this.inputTypes && this.inputTypes.length > 0) {
			this.subBlocks = [];
			let firstHalf = "";
			let remainder = this.text;
			let index = 0;
			let pShift = 12;
			for (let types in this.inputTypes) {
				index = remainder.indexOf(`$` + String(parseInt(types) + 1));
				firstHalf = remainder.substring(0, index);
				remainder = remainder.substring(index);
				this.subBlocks[types] = new Block();
				this.subBlocks[types].style.left = pShift + getStringWidth(firstHalf);
				this.subBlocks[types].style.top = 10;
				this.subBlocks[types].style.height = 24;
				this.subBlocks[types].style.color = "White";
				this.subBlocks[types].style.size = "Small";
				this.subBlocks[types].style.text = " ";
				this.subBlocks[types].container.style.pointerEvents = 'none';
				if (this.typeManager.contains(this.inputTypes[types])) {
					this.subBlocks[types].style.edgeShapes = this.typeManager.getEdgeShapes(this.inputTypes[types]);
				} else {	
					this.subBlocks[types].style.edgeShapes = ["Straight", "Straight", "Straight", "Straight"];
				}
				this.mainBlock.container.appendChild(this.subBlocks[types].container);	
				this.subBlocks[types].update();

				this.subBlocks[types].container.style.zIndex = "99";
	
				pShift += getStringWidth(firstHalf);
			}
		} 
	
		this.mainBlock.hitBox.addEventListener("dragstart", async (e) => {
			if (this.canDrag) {
				console.log("Dragging");
				
			
				if (!!window.chrome) {
					e.dataTransfer.setDragImage(this.mainBlock.hitBox, 0, 0);
				} else {
					e.dataTransfer.setDragImage(this.mainBlock.svg.firstChild, 0, 0);
				}

				if (this.parent) {
					console.log("Removing from sequence");
					this.parent.children.splice(this.parent.children.indexOf(this), 1);
					await setTimeout(() => { 
						this.eraseRender();
						this.removeDropSites();
						this.getRoot().update(); 
					}, 1);
					this.container.clipboard = this;
					//this.parent = null;	
				}	
				
				e.dataTransfer.setData("application/Block", JSON.stringify({
					Default : this.defaultName,
					ID : this.IDnum
				}));
				setTimeout(() => {
					for (let boxes of this.dropsiteCollection) { boxes.style.zIndex = "999"; }
				}, 1);	
			}
		});
		this.mainBlock.hitBox.addEventListener("dragend", (e) => {
			if (this.canDrag) {
				console.log("Done dragging");
				for (let boxes of this.dropsiteCollection) { boxes.style.zIndex = "-1"; }
			}
		});	
	}
	
	update() {
		//console.log("Updateing " + this.defaultName);
		
		let inner = 0;
		//console.log(this.children, this.children.length);
		if (this.children.length > 0) {
			for (let ch in this.children) {
				let child = this.children[ch];
				if (ch == 0) {
					child.mainBlock.style.top = this.mainBlock.getBottom() - this.mainBlock.style.innerHeight - 10;
				} else {
					child.mainBlock.style.top = this.children[ch-1].mainBlock.getBottom();
				}
				child.mainBlock.style.left = this.mainBlock.style.left + 8; 
				child.update();
				inner = Math.max(inner, child.getBottom() - this.mainBlock.style.top - this.mainBlock.style.height + 2);
			}
		}

		//console.log(inner);
		if (this.typeManager.getSize(this.type) == "Bracket") { 
			this.mainBlock.setInnerHeight(Math.max(20, inner)); 
		}	
		this.mainBlock.update();
		this.updateDropSites();
		
		//console.log("Done updating " + this.defaultName);
	}

	eraseRender() {
		this.mainBlock.svg.innerHTML = "";
		if (this.subBlocks) {
			for (let sub of this.subBlocks) {
				sub.svg.innerHTML = "";
			}	
		}
		if (this.children) {
			for (let child of this.children) {
				child.eraseRender();
			}
		}
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

	generateDropSites() {
		if (this.typeManager.getSize(this.type) == "Bracket") {
			this.dropSites["Backet"] = document.createElement("div");
			this.dropsiteCollection.push(this.dropSites["Backet"]);
			this.dropSites["Backet"].style.outline = "1px solid blue";
			this.dropSites["Backet"].style.position = "absolute";
			this.dropSites["Backet"].style.width = this.mainBlock.style.width + "px";
			this.dropSites["Backet"].style.height = "32px";
			this.dropSites["Backet"].style.left = (this.mainBlock.style.left + 8) + "px";
			this.dropSites["Backet"].style.top = (this.mainBlock.getBottom() - this.mainBlock.style.innerHeight - 20)+ "px";
			this.dropSites["Backet"].style.zIndex = "999";
			this.container.appendChild(this.dropSites["Backet"]);
			
			this.dropSites["Backet"].addEventListener("dragover", (e) => {
				e.preventDefault();
			});

			this.dropSites["Backet"].addEventListener("drop", (e) => {
				console.log(e);
				e.preventDefault();
				let defaultName = JSON.parse(e.dataTransfer.getData("application/Block"))["Default"]; 
				let IDhash = JSON.parse(e.dataTransfer.getData("application/Block"))["ID"];
				if (IDhash && this.container.clipboard && this.container.clipboard.IDnum == IDhash) { 
					console.log("Subtree is being moved"); 
					let blockToMove = this.container.clipboard;
					blockToMove.parent = this;
					blockToMove.dropsiteCollection = this.dropsiteCollection;
					blockToMove.regenerateDropSite();
					this.children.unshift(blockToMove);	
				} else {
					let defaultData = this.typeManager.getFunctionData(defaultName);
					if (this.typeManager.getEdgeShapes(defaultData["Type"])[1] == "Puzzle") {
						let newBlock = new programBlock(defaultName, defaultData["Type"], defaultData["Text"], 
						defaultData["Input"], this.mainBlock.style.left + 8, this.mainBlock.getBottom() - this.mainBlock.style.innerHeight - 11, this.typeManager, this.container);
						newBlock.dropsiteCollection = this.dropsiteCollection;
						newBlock.generateDropSites();
						newBlock.parent = this;
						this.children.unshift(newBlock);
					}
				}
				//console.log(this.getRoot());
				this.getRoot().update();
			});			
		} 	
		
		if ((this.typeManager.getSize(this.type) == "Normal" || this.typeManager.getSize(this.type) == "Bracket") && this.typeManager.getEdgeShapes(this.type)[3] == "Puzzle") {
			this.dropSites["below"] = document.createElement("div");
			this.dropsiteCollection.push(this.dropSites["below"]);
			this.dropSites["below"].style.outline = "1px solid blue";
			this.dropSites["below"].style.position = "absolute";
			this.dropSites["below"].style.width = (this.mainBlock.style.width + 16) + "px";
			this.dropSites["below"].style.height = (this.mainBlock.style.height) + "px";
			this.dropSites["below"].style.left = (this.mainBlock.style.left) + "px";
			this.dropSites["below"].style.top = (this.mainBlock.getBottom() - this.mainBlock.style.height/2)+ "px";
			this.dropSites["below"].style.zIndex = "999";
			this.container.appendChild(this.dropSites["below"]);
		
			this.dropSites["below"].addEventListener("dragover", (e) => {
				e.preventDefault();
			});

			this.dropSites["below"].addEventListener("drop", (e) => {
				e.preventDefault();
				let defaultName = JSON.parse(e.dataTransfer.getData("application/Block"))["Default"]; 
				let IDhash = JSON.parse(e.dataTransfer.getData("application/Block"))["ID"];
				let defaultData = this.typeManager.getFunctionData(defaultName);
				if (IDhash && this.container.clipboard && this.container.clipboard.IDnum == IDhash) { 
					console.log("Subtree is being moved"); 
					let blockToMove = this.container.clipboard;
					blockToMove.parent = this.parent;
					blockToMove.dropsiteCollection = this.dropsiteCollection;
					blockToMove.regenerateDropSite();
					//console.log(this.parent.children, this.parent.children.indexOf(this));
					this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, blockToMove);
				} else {
					if (this.typeManager.getEdgeShapes(defaultData["Type"])[1] == "Puzzle") {
						let newBlock = new programBlock(defaultName, defaultData["Type"], defaultData["Text"], 
						defaultData["Input"], this.mainBlock.style.left, this.mainBlock.getBottom(), this.typeManager, this.container);
						newBlock.dropsiteCollection = this.dropsiteCollection;
						newBlock.generateDropSites();
						newBlock.parent = this.parent;
						//console.log(this.parent.children, this.parent.children.indexOf(this));
						this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, newBlock);
					}
				}
				//console.log(this.getRoot());
				this.getRoot().update();
			});
		}
	}

	updateDropSites() {
		if (this.dropSites["Backet"]) {
			//console.log("Updating bracket");
			this.dropSites["Backet"].style.top = (this.mainBlock.style.top + this.mainBlock.style.height/2) + "px";
			this.dropSites["Backet"].style.left = (this.mainBlock.style.left + 8) + "px";
			if (this.children[0]) {
				this.dropSites["Backet"].style.removeProperty('height');
				//console.log(this.children[0].mainBlock.hitBox.parentElement.getBoundingClientRect().height);
				this.dropSites["Backet"].style.bottom = (this.children[0].mainBlock.container.parentElement.getBoundingClientRect().height - 
				this.children[0].mainBlock.hitBox.getBoundingClientRect().top + this.children[0].mainBlock.hitBox.getBoundingClientRect().height/2 + 3) + "px";
			}
		}	
		if (this.dropSites["below"]) {
			//console.log("Updating below");
			this.dropSites["below"].style.top = (this.mainBlock.getBottom() - this.mainBlock.style.height/2)+ "px";
		}
	}

	removeDropSites() {
		if (this.dropSites) {
			for (let site in this.dropSites) {
				this.dropSites[site].remove();
			}
		}
		if (this.children) {
			for (let child of this.children) {
				child.removeDropSites();
			}
		}
	}
		
	regenerateDropSite() {
		this.generateDropSites();
		if (this.children) {
			for (let child of this.children) {
				child.regenerateDropSite();
			}
		}
	}

	getRoot() {
		if (this.parent) {
			return this.parent.getRoot();
		} else {
			return this
		}
	}
	
	toggleDrag(bl) {
		if (bl) { this.canDrag = true; } else { this.canDrag = false; } 
		this.mainBlock.hitBox.draggable = this.canDrag;
	}
}

const sampleCanvas = document.createElement("canvas");
const sampleCanvasContext = sampleCanvas.getContext('2d');
sampleCanvasContext.font = "15px 'Roboto Mono', monospace";

function getStringWidth(str) {
	const textMeasure = sampleCanvasContext.measureText(str);
	return textMeasure.width;
}
