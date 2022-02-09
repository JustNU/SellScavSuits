"use strict";

class SellScavSuits
{
	static onLoadMod()
	{
		// read files
		const scavSuitCustomization = JsonUtil.deserialize(VFS.readFile(`user/mods/SellScavSuits/db/customization.json`));
		const scavSuitOffers = JsonUtil.deserialize(VFS.readFile(`user/mods/SellScavSuits/db/suitoffers.json`));
		const scavSuitLocale = JsonUtil.deserialize(VFS.readFile(`user/mods/SellScavSuits/db/locale.json`));
		
		// add missing suits
		const customization = JsonUtil.clone(DatabaseServer.tables.templates.customization);
		DatabaseServer.tables.templates.customization = {
			...customization,
			...scavSuitCustomization
		};
		
		// change sides for existing scav customization
		for (const customizationId in DatabaseServer.tables.templates.customization) {
			if (DatabaseServer.tables.templates.customization[customizationId]._props.Side) {
				if (DatabaseServer.tables.templates.customization[customizationId]._props.Side[0] === "Savage") {
					DatabaseServer.tables.templates.customization[customizationId]._props.Side = ["Usec", "Bear", "Savage"];
				}
			}
		}
		
		// check if fence can sell clothing, if not then allow it
		if (DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits) {
			const suits = JsonUtil.clone(DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits);
			DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits = {
				...suits,
				...scavSuitOffers
			}
		} else {
			DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].base.customization_seller = true;
			DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].suits = scavSuitOffers
		}
		
		//locale
		for (const localeID in DatabaseServer.tables.locales.global)
        {
			// change existing locale
			DatabaseServer.tables.locales.global[localeID].templates["5f5f653179db6e3f0e19b762"].Name = "SCAV Drystch Pants";
			DatabaseServer.tables.locales.global[localeID].templates["5f5f64f947344c2e4f6c431e"].Name = "SCAV Rain Boots";
			DatabaseServer.tables.locales.global[localeID].templates["5f5f65180bc58666c37e784a"].Name = "SCAV Browning Wasatch Pants";
			DatabaseServer.tables.locales.global[localeID].templates["5cdea3f87d6c8b647a3769b2"].Name = "Adik Tracksuit Pants";
			DatabaseServer.tables.locales.global[localeID].templates["5e9de109f6164249e54453d2"].Name = "SCAV Motocross Jacket";
			DatabaseServer.tables.locales.global[localeID].templates["5df8e65d86f77412672a1e46"].Name = "SCAV Meteor Jacket";
			DatabaseServer.tables.locales.global[localeID].templates["5e4bb8e686f77406796b7ba2"].Name = "SCAV Russia Jacket";
			DatabaseServer.tables.locales.global[localeID].templates["5df8e79286f7744a122d6836"].Name = "SCAV Sklon Pants";
			DatabaseServer.tables.locales.global[localeID].templates["5fd791b71189a17bcc172f16"].Name = "SCAV Under Armour Jacket";
			DatabaseServer.tables.locales.global[localeID].templates["5fd7910ae3bfcf6cab4c9f55"].Name = "SCAV Rain Parka";
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
			
			// BRING BACK THE CIG SCAV
			DatabaseServer.tables.templates.customization["5d28afe786f774292668618d"]._props.Prefab.path = "assets/content/characters/character/prefabs/wild_head_3.bundle";
        }
		
	}
	
}

module.exports = SellScavSuits;