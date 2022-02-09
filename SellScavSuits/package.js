class Mod
{
    constructor()
    {
		Logger.info("Loading: Sell Scav Suits");
		
		ModLoader.onLoad["SellScavSuits"] = require("./src/SellScavSuits.js").onLoadMod;
    }
}

module.exports.Mod = new Mod();