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
		this.container.style.pointerEvents = 'none';
		this.svg.style.pointerEvents = 'none';
		this.hitBox.style.pointerEvents = 'auto';
		this.hitBox.style.position = "absolute";
		//this.hitBox.style.outline = "1px solid green";
		

		this.style = {
			width : 50,
			height : 28,
			innerHeight : 0,
			left : 0,
			top : 0,
			color : "Orange",
			size : "Normal",
			edgeShapes : ["Straight", "Straight", "Straight", "Straight"],
			rawText : null,
			text : null,
			parameterWidths : null,
			stroke : false
		};
		this.innerSections = []
	
		this.shift = 0;

	
		this.svg.innerHTML = this.generateSVG();
		this.svg.firstChild.addEventListener("dragstart", e => e.preventDefault());
		this.svg.firstChild.lastChild.addEventListener("dragstart", e => e.preventDefault());
	}

	update() {
		this.splitStr();
		if (typeof(this.style.text) == 'object') { 
			this.style.width = 16;
			for (let sub of this.style.text) {
				this.style.width += Number(getStringWidth(sub));
			} 
			for (let wid of this.style.parameterWidths) {
				this.style.width += Number(wid);
			}
		} else if (typeof(this.style.text) == 'string') {
			this.style.width = getStringWidth(this.style.text) + 16;
		}
		if (this.style.size == "Normal") {
			this.container.style.left = String(this.style.left - 8) + "px";
			this.container.style.top = String(this.style.top - 8) + "px";
			this.container.style.width = (this.style.width + 16) + "px";
			this.container.style.height = (this.style.height + 16) + "px";
			this.hitBox.style.left = "8px";
			this.hitBox.style.top = "8px";
			this.hitBox.style.width = String(this.style.width) + "px";
			this.hitBox.style.height = String(this.style.height) + "px";
		} else if (this.style.size == "Small") {
			this.container.style.left = String(this.style.left - 8) + "px";
			this.container.style.top = String(this.style.top - 8) + "px";
			this.container.style.width = (this.style.width + 16) + "px";
			this.container.style.height = (this.style.height + 16) + "px";
			this.hitBox.style.left = "8px";
			this.hitBox.style.top = "12px";
			this.hitBox.style.width = String(this.style.width ) + "px";
			this.hitBox.style.height = String(this.style.height - 8) + "px";
		} if (this.style.size == "Bracket") {
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

	splitStr() {
		let iter = 0;
		let contains = true;
		let remainder = this.style.rawText;
		let tempTextArr = [];
		let tempInnerArr = [];
		while (contains && iter < 100) {
			let index = remainder.indexOf(`$` + String(parseInt(iter) + 1));
			if (index > -1) { contains = true; } else {contains = false; break; }
			tempTextArr[iter] = remainder.substring(0, index);
			tempInnerArr[iter] = Number(getStringWidth(tempTextArr[iter]));
			remainder = remainder.substring(index + 1 + String(parseInt(iter) + 1).length); 
			iter++;
		}
		tempTextArr.push(remainder);
		if (tempTextArr.length > 1) { 
			this.style.text = tempTextArr;
			this.innerSections = tempInnerArr;
			if (this.style.parameterWidths == null) { this.style.parameterWidths = new Array(this.innerSections.length).fill(24); } 
		} else {
			this.style.text = this.style.rawText;
			this.innerSections = [];
		}
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

	getPCoord(n) {
		if (Number.isInteger(Number(n)) && n >= 0 && n < this.style.parameterWidths.length) {
			let temp = 16 + this.innerSections[0];
			for (let i=0; i < n && i < this.style.parameterWidths.length && i+1 < this.innerSections.length; i++) {	
				temp += this.style.parameterWidths[i] + this.innerSections[i + 1]; 
			}
			return temp;
		}
		else return 0;
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

		if (this.style.stroke) {
			temp += `" stroke="white `;
		}

		temp += `" fill="` + Palette[PaletteReverse[this.style.color]][0]  + `"/>`;

		if (typeof(this.style.text) == 'string') { 
			temp += `<text fill="#ffffff" font-size="15" style="user-select: none; pointer-events: none; -webkit-user-select: none; -moz-user-select: none;" `
			temp += `x="16" y="` + (14 +(this.style.height)/2)+ `"` + `>` + this.style.text + ` </text>`;
		} else if (typeof(this.style.text) == 'object') {
			let xCoord = 16;
			for (let iter in this.style.text) {
				temp += `<text fill="#ffffff" font-size="15" xml:space="preserve" style="user-select: none; pointer-events: none; -webkit-user-select: none; -moz-user-select: none;" `
				temp += `x="` + xCoord + `" y="` + (14 +(this.style.height)/2)+ `"` + `>` + this.style.text[iter] + ` </text>`;
				//temp += `<line x1="` + xCoord + `" y1="0" x2="` + xCoord + `" y2="100" stroke="black" />`;
				//temp += `<line x1="` + this.getPCoord(iter) + `" y1="0" x2="` + this.getPCoord(iter) + `" y2="100" stroke="red" />`;
				xCoord += ((this.style.parameterWidths[iter] ?? 0) + (this.innerSections[iter] ?? 0));
			}
		}
		temp += `</svg>`;
		return temp;
	}

	destruct() {
		this.container.remove();
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
		return (this.typeMap.has(iType.replace(/^#/, "")));
	}

	getColor(iType) {
		return this.typeMap.get(iType.replace(/^#/, ""))["Color"];
	}
	
	getSize(iType) {
		if (this.typeMap.has(iType.replace(/^#/, ""))) {
			return this.typeMap.get(iType.replace(/^#/, ""))["Size"];
		} else { return undefined; }
	}

	getEdgeShapes(iType) {
		return this.typeMap.get(iType.replace(/^#/, ""))["EdgeShapes"];
	}

	isPlural(iType) {
		return iType[0] == '#';
	}

	typeMatch(t1, t2) {
		if (t1 == t2) { return true; }
		if (t1.replace(/^#/, "") == this.getSize(t2) && this.isPlural(t1)==this.isPlural(t2) ) { return true; }
		if (t2.replace(/^#/, "") == this.getSize(t1) && this.isPlural(t1)==this.isPlural(t2) ) { return true; }
		return false;
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
		this.bChildren = []; //block children
		if (this.inputTypes) {
			this.pChildren = new Array(this.inputTypes.length).fill("Blank"); //parameter children
		} else { this.pChildren = null; }
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
		if (this.typeManager.getSize(this.type) == "Small") { this.mainBlock.style.stroke = true; }
		this.mainBlock.style.edgeShapes = this.typeManager.getEdgeShapes(this.type);
		this.mainBlock.style.rawText = this.text;
		if (this.mainBlock.style.size == "Bracket") {
			this.mainBlock.style.innerHeight = 20;
		}
		this.container.appendChild(this.mainBlock.container);
		this.mainBlock.update();
		this.mainBlock.hitBox.draggable = this.canDrag;
		
		this.generateSubblocks();
	
		this.mainBlock.hitBox.addEventListener("dragstart", async (e) => {
			if (this.canDrag) {
				//console.log("Dragging, ", this.type);
					
				if (!!window.chrome) {
					e.dataTransfer.setDragImage(this.mainBlock.hitBox, 0, 0);
				} else {
					e.dataTransfer.setDragImage(this.mainBlock.svg.firstChild, 0, 0);
				}

				if (this.parent) {
					if (this.mainBlock.style.size != "Small") {
						//console.log("Removing normal/bracket from sequence");
						this.parent.bChildren.splice(this.parent.bChildren.indexOf(this), 1);
						await setTimeout(() => { 
							this.eraseRender();
							this.removeDropSites();
							this.getRoot().update(); 
						}, 1);
						this.container.clipboard = this;
						//this.parent = null;	
					} else if (this.mainBlock.style.size == "Small") {
						//console.log("Removing small from sequence");
						this.container.clipboard = this;
						this.parent.pChildren[this.parent.pChildren.indexOf(this)] = "Blank";
						this.parent.generateSubblocks();
						await setTimeout(() => {
							this.eraseRender();
							this.removeDropSites();
							this.parent.update();
						}, 1);
					}
				}	
				
				e.dataTransfer.setData("application/Block", JSON.stringify({
					Default : this.defaultName,
					ID : this.IDnum
				}));
				setTimeout(() => {
					for (let box of this.dropsiteCollection) {
						if ((box.type != "Parameter" && this.mainBlock.style.size != "Small") || (box.type == "Parameter" && this.mainBlock.style.size == "Small")) { 
							box.style.zIndex = "999"; 
						}
					}
				}, 1);	
			}
		});
		this.mainBlock.hitBox.addEventListener("dragend", (e) => {
			if (this.canDrag) {
				//console.log("Done dragging");
				for (let boxes of this.dropsiteCollection) { boxes.style.zIndex = "-1"; }
			}
		});	
	}

	generateSubblocks() {
		if (this.inputTypes && this.pChildren && this.inputTypes.length > 0) {
			let firstHalf = "";
			let remainder = this.text;
			let index = 0;
			let pShift = 12;
			let maxHeight = 0;
			for (let it in this.pChildren) {
				let sBlock = this.pChildren[it];
				index = remainder.indexOf(`$` + String(parseInt(it) + 1));
				firstHalf = remainder.substring(0, index);
				remainder = remainder.substring(index);
				if (sBlock == "Blank") {
					this.pChildren[it] = new Block();
					sBlock = this.pChildren[it];
					this.mainBlock.style.parameterWidths[it] = 24;
					sBlock.style.color = "White";
					sBlock.style.size = "Small";
					sBlock.style.rawText = " ";
					sBlock.container.style.pointerEvents = 'none';	
				} 
				
				if (sBlock instanceof Block){
					sBlock.style.top = 10;
					sBlock.style.height = 24;
					maxHeight = Math.max(maxHeight, sBlock.style.height);
					sBlock.style.left = this.mainBlock.getPCoord(it);
					if (this.typeManager.contains(this.inputTypes[it])) {
						 sBlock.style.edgeShapes = this.typeManager.getEdgeShapes(this.inputTypes[it]);
					} else {
						sBlock.style.edgeShapes = ["Straight", "Straight", "Straight", "Straight"];
					}
					this.mainBlock.container.appendChild(sBlock.container);
					sBlock.container.style.zIndex = "99"; 
					sBlock.update();
				} else if (sBlock instanceof programBlock){
					//console.log("Updating a subblock which is a program block.");
					sBlock.generateSubblocks();
					sBlock.mainBlock.style.top = this.mainBlock.style.top;
					sBlock.mainBlock.style.left = this.mainBlock.style.left + this.mainBlock.getPCoord(it) - 8;
					this.mainBlock.style.parameterWidths[it] = sBlock.mainBlock.style.width;
					maxHeight = Math.max(maxHeight, sBlock.mainBlock.getTotalHeight());
					sBlock.mainBlock.container.style.zIndex = "99";
					sBlock.update();
				}
				
				pShift += getStringWidth(firstHalf);
				/*index = remainder.indexOf(`$` + String(parseInt(types) + 1));
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
	
				pShift += getStringWidth(firstHalf);*/
			}
		//	this.mainBlock.style.height = Math.max(24, maxHeight + 4);
		}
		this.mainBlock.update(); 
	}
	
	update() {
		//console.log("Updateing " + this.defaultName);
		
		let inner = 0;
		//console.log(this.bChildren, this.bChildren.length);
		this.generateSubblocks();
		if (this.bChildren.length > 0) {
			for (let ch in this.bChildren) {
				let child = this.bChildren[ch];
				if (ch == 0) {
					child.mainBlock.style.top = this.mainBlock.getBottom() - this.mainBlock.style.innerHeight - 10;
				} else {
					child.mainBlock.style.top = this.bChildren[ch-1].mainBlock.getBottom();
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
		if (this.pChildren) {
			for (let sub in this.pChildren) {
				if (this.pChildren[sub] instanceof Block) {
					this.pChildren[sub].svg.innerHTML = "";
				} else if (this.pChildren[sub] instanceof programBlock) {
					this.pChildren[sub].eraseRender();
				} else { continue; }
			}	
		}
		if (this.bChildren) {
			for (let child of this.bChildren) {
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
		this.mainBlock.style.rawText = this.text;
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
			this.dropSites["bracket"] = document.createElement("div");
			this.dropsiteCollection.push(this.dropSites["bracket"]);
			this.dropSites["bracket"].style.outline = "1px solid blue";
			this.dropSites["bracket"].style.position = "absolute";
			this.dropSites["bracket"].style.width = this.mainBlock.style.width + "px";
			this.dropSites["bracket"].style.height = "32px";
			this.dropSites["bracket"].style.left = (this.mainBlock.style.left + 8) + "px";
			this.dropSites["bracket"].style.top = (this.mainBlock.getBottom() - this.mainBlock.style.innerHeight - 20)+ "px";
			this.dropSites["bracket"].style.zIndex = "999";
			this.dropSites["bracket"].type = "Bracket";
			this.container.appendChild(this.dropSites["bracket"]);
			
			this.dropSites["bracket"].addEventListener("dragover", (e) => {
				e.preventDefault();
			});
			this.dropSites["bracket"].addEventListener("drop", (e) => {
				//console.log(e);
				e.preventDefault();
				let defaultName = JSON.parse(e.dataTransfer.getData("application/Block"))["Default"]; 
				let IDhash = JSON.parse(e.dataTransfer.getData("application/Block"))["ID"];
				if (IDhash && this.container.clipboard && this.container.clipboard.IDnum == IDhash) { 
					//console.log("Subtree is being moved"); 
					let blockToMove = this.container.clipboard;
					blockToMove.parent = this;
					this.container.clipboard = null;
					blockToMove.dropsiteCollection = this.dropsiteCollection;
					blockToMove.generateSubblocks();
					blockToMove.regenerateDropSite();
					this.bChildren.unshift(blockToMove);	
				} else {
					let defaultData = this.typeManager.getFunctionData(defaultName);
					if (this.typeManager.getEdgeShapes(defaultData["Type"])[1] == "Puzzle") {
						let newBlock = new programBlock(defaultName, defaultData["Type"], defaultData["Text"], 
						defaultData["Input"], this.mainBlock.style.left + 8, this.mainBlock.getBottom() - this.mainBlock.style.innerHeight - 11, this.typeManager, this.container);
						newBlock.dropsiteCollection = this.dropsiteCollection;
						newBlock.update();
						newBlock.generateSubblocks();
						newBlock.generateDropSites();
						newBlock.parent = this;
						this.bChildren.unshift(newBlock);
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
			this.dropSites["below"].type = "Below";
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
					//console.log("Subtree is being moved"); 
					let blockToMove = this.container.clipboard;
					blockToMove.parent = this.parent;
					this.container.clipboard = null;
					blockToMove.dropsiteCollection = this.dropsiteCollection;
					blockToMove.generateSubblocks();
					blockToMove.regenerateDropSite();
					//console.log(this.parent.bChildren, this.parent.bChildren.indexOf(this));
					this.parent.bChildren.splice(this.parent.bChildren.indexOf(this) + 1, 0, blockToMove);
				} else {
					if (this.typeManager.getEdgeShapes(defaultData["Type"])[1] == "Puzzle") {
						let newBlock = new programBlock(defaultName, defaultData["Type"], defaultData["Text"], 
						defaultData["Input"], this.mainBlock.style.left, this.mainBlock.top, this.typeManager, this.container);
						newBlock.dropsiteCollection = this.dropsiteCollection;
						newBlock.update();
						newBlock.generateDropSites();
						newBlock.parent = this.parent;
						//console.log(this.parent.pChildren, this.parent.pChildren.indexOf(this));
						this.parent.bChildren.splice(this.parent.bChildren.indexOf(this) + 1, 0, newBlock);
					}
				}
				//console.log(this.getRoot());
				this.getRoot().update();
			});
		}
		
		if (this.pChildren && this.pChildren.length > 0) {
			this.generateSubblocks();
			//console.log("Adding dropsites for the subblocks", this.pChildren);
			for (let sub in this.pChildren) {
				let subBlock;
				if (this.pChildren[sub] instanceof Block) {
					subBlock = this.pChildren[sub];
					//console.log(subBlock);
				} else if (this.pChildren[sub] instanceof programBlock) {
					subBlock = this.pChildren[sub].mainBlock;
				} else { continue; }
				this.dropSites[sub] = document.createElement("div");
				this.dropsiteCollection.push(this.dropSites[sub]);
				this.dropSites[sub].style.outline = "1px solid red";
				this.dropSites[sub].style.position = "absolute"
				this.dropSites[sub].style.left = subBlock.hitBox.getBoundingClientRect().left - this.container.getBoundingClientRect().left+ "px";
				this.dropSites[sub].style.top = subBlock.hitBox.getBoundingClientRect().top - this.container.getBoundingClientRect().top + "px";
				this.dropSites[sub].style.width = subBlock.hitBox.getBoundingClientRect().width + "px";
				this.dropSites[sub].style.height = subBlock.hitBox.getBoundingClientRect().height + "px";
				this.dropSites[sub].style.zIndex = "999";
				this.dropSites[sub].type = "Parameter";
				this.container.appendChild(this.dropSites[sub]);
				//console.log(this.dropSites[sub]);

				this.dropSites[sub].addEventListener("dragover", (e) => {
					e.preventDefault();
				});

				this.dropSites[sub].addEventListener("drop", (e) => {
					e.preventDefault();
					let defaultName = JSON.parse(e.dataTransfer.getData("application/Block"))["Default"]; 
					let IDhash = JSON.parse(e.dataTransfer.getData("application/Block"))["ID"];
					let defaultData = this.typeManager.getFunctionData(defaultName);
					//console.log(defaultData["Type"], this.inputTypes[sub]);
					if (this.typeManager.getSize(defaultData["Type"]) == "Small" && this.typeManager.typeMatch(defaultData["Type"], this.inputTypes[sub])) {
						if (IDhash && this.container.clipboard && this.container.clipboard.IDnum == IDhash) { 
							//console.log("Small subtree is being moved to " + sub); 
							this.pChildren[sub].destruct();
							let blockToMove = this.container.clipboard;
							blockToMove.parent = this;
							this.pChildren[sub] = blockToMove;
							this.container.clipboard = null;
							blockToMove.dropsiteCollection = this.dropsiteCollection;
							blockToMove.generateSubblocks();
							blockToMove.regenerateDropSite();
							//console.log(this.parent.children, this.parent.children.indexOf(this));
							//this.parent.bChildren.splice(this.parent.bChildren.indexOf(this) + 1, 0, blockToMove);
						} else {
								//console.log("Small block being added to " + sub);
								//console.log(this.pChildren[sub]);
								this.pChildren[sub].destruct();
								let newBlock = new programBlock(defaultName, defaultData["Type"], defaultData["Text"], 
								defaultData["Input"], this.mainBlock.style.left, this.mainBlock.getBottom(), this.typeManager, this.container);
								newBlock.dropsiteCollection = this.dropsiteCollection;
								newBlock.generateDropSites();
								newBlock.parent = this;
								this.pChildren[sub] = newBlock;
								//console.log(this.parent.children, this.parent.children.indexOf(this));
								//this.parent.bChildren.splice(this.parent.bChildren.indexOf(this) + 1, 0, newBlock);
						}
					}
					//console.log(this.getRoot());
					this.getRoot().update();
				});
			}
		}
	}

	updateDropSites() {
		if (this.dropSites["bracket"]) {
			//console.log("Updating bracket");
			this.dropSites["bracket"].style.top = (this.mainBlock.style.top + this.mainBlock.style.height/2) + "px";
			this.dropSites["bracket"].style.left = (this.mainBlock.style.left + 8) + "px";
			if (this.bChildren[0]) {
				this.dropSites["bracket"].style.removeProperty('height');
				//console.log(this.bChildren[0].mainBlock.hitBox.parentElement.getBoundingClientRect().height);
				this.dropSites["bracket"].style.bottom = (this.bChildren[0].mainBlock.container.parentElement.getBoundingClientRect().height - 
				this.bChildren[0].mainBlock.hitBox.getBoundingClientRect().top + this.bChildren[0].mainBlock.hitBox.getBoundingClientRect().height/2 + 3) + "px";
			}
		}	

		if (this.dropSites["below"]) {
			//console.log("Updating below");
			this.dropSites["below"].style.top = (this.mainBlock.getBottom() - this.mainBlock.style.height/2)+ "px";
		}

		if (this.pChildren && this.pChildren.length > 0) {
			for (let sub in this.pChildren) {
				if (this.dropSites[sub] && this.pChildren[sub]) {
					let subBlock;
					if (this.pChildren[sub] instanceof Block) {
						subBlock = this.pChildren[sub];
					} else if (this.pChildren[sub] instanceof programBlock) {
						subBlock = this.pChildren[sub].mainBlock;
					} else { continue; }
					this.dropSites[sub].style.left = subBlock.hitBox.getBoundingClientRect().left - this.container.getBoundingClientRect().left+ "px";
					this.dropSites[sub].style.top = subBlock.hitBox.getBoundingClientRect().top - this.container.getBoundingClientRect().top + "px";
					this.dropSites[sub].style.width = subBlock.hitBox.getBoundingClientRect().width + "px";
					this.dropSites[sub].style.height = subBlock.hitBox.getBoundingClientRect().height + "px";
				}
			}			
		}
	}

	removeDropSites() {
		if (this.dropSites) {
			for (let site in this.dropSites) {
				this.dropSites[site].remove();
			}
		}
		if (this.bChildren) {
			for (let child of this.bChildren) {
				child.removeDropSites();
			}
		}
		if (this.pChildren) {
			for (let child of this.pChildren) {
				if (child instanceof programBlock) {
					child.removeDropSites();
				}
			}
		}
	}
		
	regenerateDropSite() {
		this.generateDropSites();
		if (this.bChildren) {
			for (let child of this.bChildren) {
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

	destruct() {
		if (this.pChildren) {
			for (let child of this.pChildren) {
				child.remove();
			}
		}
		
		if (this.bChildren) {
			for (let child of this.pChildren) {
				child.remove();
			}		
		}
	
		this.removeDropSites();
		this.mainBlock.remove();
	}
}

const sampleCanvas = document.createElement("canvas");
const sampleCanvasContext = sampleCanvas.getContext('2d');
sampleCanvasContext.font = "15px 'Roboto Mono', monospace";

function getStringWidth(str) {
	const textMeasure = sampleCanvasContext.measureText(str);
	return Number(textMeasure.width);
}
