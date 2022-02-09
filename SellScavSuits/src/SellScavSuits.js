"use strict";

class SellScavSuits
{
	static onLoadMod()
	{
		const config = require("../config/config.json");
		var suitesList = [];
		var skipThoseSuites = ["wild_Killa_body"]
		
        for (var top in DatabaseServer.tables.globals.config.Customization.SavageBody) {
			// skip clothing
			if (SellScavSuits.skipScavClothing(top, skipThoseSuites) === true) {
				continue;
			}
			
            var newSuite = 
            {
                _id: top + "_suite",
                _name: top,
                _parent: "5cd944ca1388ce03a44dc2a4",
                _type: "Item",
                _props: {
                    Name: top,
                    ShortName: top,
                    Description: top,
                    Side: ["Usec","Bear","Savage"],
                    AvailableAsDefault: false,
                    Body: DatabaseServer.tables.globals.config.Customization.SavageBody[top].body,
                    Hands: DatabaseServer.tables.globals.config.Customization.SavageBody[top].hands                   
                }
            };
			
            suitesList.push(newSuite);
        }

        for (var lower in DatabaseServer.tables.globals.config.Customization.SavageFeet) {
			// skip clothing
			if (SellScavSuits.skipScavClothing(top, skipThoseSuites) === true) {
				continue;
			}
			
            var newSuite = 
            {
                _id: lower + "_suite",
                _name: lower,
                _parent: "5cd944d01388ce000a659df9",
                _type: "Item",
                _props: {
                    Name: lower,
                    ShortName: lower,
                    Description: lower,
                    Side: ["Usec","Bear","Savage"],
                    AvailableAsDefault: false,
                    Feet: DatabaseServer.tables.globals.config.Customization.SavageFeet[lower].feet
                }
            };

            suitesList.push(newSuite);
        }

        // add suits to customization/fence
		let fenceOffers = [];
        for (var suit in suitesList) {
            let newTraderOffer = 
            {
                _id: suitesList[suit]._name+"_Offer",
                tid: "579dc571d53a0658a154fbec",
                suiteId: suitesList[suit]._id,
                isActive: true,
                requirements: {
                    loyaltyLevel: 0,
                    profileLevel: 0,
                    standing: 0,
                    skillRequirements: [],
                    questRequirements: [],
                    itemRequirements: []
                }
            };

            fenceOffers.push(newTraderOffer) ;

            //add custom suit in templates.customization        
            DatabaseServer.tables.templates.customization[suitesList[suit]._id] = suitesList[suit];
        }
		
        // check if fence can sell clothing, if not then allow it
		if (DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits) {
			const suits = JsonUtil.clone(DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits);
			DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits = {
				...suits,
				...fenceOffers
			};
		} else {
			DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].base.customization_seller = true;
			DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits = fenceOffers
		}
		
		//locale
		const scavSuitLocale = JsonUtil.deserialize(VFS.readFile(`user/mods/SellScavSuits/db/locale.json`));
		for (const localeID in DatabaseServer.tables.locales.global)
        {
			// change existing locale
			DatabaseServer.tables.locales.global[localeID].customization["5fc615710b735e7b024c76ed"].Name = "Sanitar";
			
			// add suit locale
			const localeTemplates = JsonUtil.clone(DatabaseServer.tables.locales.global[localeID].templates);
			DatabaseServer.tables.locales.global[localeID].templates = {
			...localeTemplates,
			...scavSuitLocale.templates
			};
			
			// add head & voices locale
			const localeCustomization = JsonUtil.clone(DatabaseServer.tables.locales.global[localeID].customization);
			DatabaseServer.tables.locales.global[localeID].customization = {
			...localeCustomization,
			...scavSuitLocale.customization
			};
        }
		
		// BRING BACK THE CIG SCAV
		DatabaseServer.tables.templates.customization["5d28afe786f774292668618d"]._props.Prefab.path = "assets/content/characters/character/prefabs/wild_head_3.bundle";
		
		// config options
		for (const customizationItem in DatabaseServer.tables.templates.customization) {
			if (config.AddScavVoices) {
				if (DatabaseServer.tables.templates.customization[customizationItem]._parent === "5cc085e214c02e000c6bea67" && DatabaseServer.tables.templates.customization[customizationItem]._props.Side[0] === "Savage") {
					DatabaseServer.tables.templates.customization[customizationItem]._props.Side = ["Usec","Bear","Savage"];
				}
			};
			
			if (config.AddScavHeads) {
				if (DatabaseServer.tables.templates.customization[customizationItem]._parent === "5fc100cf95572123ae738483" && DatabaseServer.tables.templates.customization[customizationItem]._props.Side[0] === "Savage") {
					DatabaseServer.tables.templates.customization[customizationItem]._props.Side = ["Usec","Bear","Savage"];
				}
			};
		}
	}
	
	static skipScavClothing(globalsClothing, skipList)
	{
		// skip some clothes
		for (const skipClothingIndex in skipList) {
			const skipClothing = skipList[skipClothingIndex]
			
			if (globalsClothing === skipClothing) {
				return true;
			}
		}
	}
	
}

module.exports = SellScavSuits;