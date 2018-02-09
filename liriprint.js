'use strict'



module.exports = class LiriPrint {
	constructor() {

	}

	go(itemData, keyData) {
		let output =  Object.keys(keyData).map(key => keyData[key] + ": " + itemData[key]).join("\n");
		return (output);
	}
}


