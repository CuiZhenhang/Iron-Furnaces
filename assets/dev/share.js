/// <reference path='./other.js'/>

ModAPI.registerAPI('IronFurnacesAPI', {
    version: __mod__.getVersion(),
    createFurnaceWindow: createFurnaceWindow,
    createFurnace: createFurnace,
    upgradeFurnace: upgradeFurnace,
    upgradeVanillaFurnace: upgradeVanillaFurnace,
    requireGlobal: function (cmd) { return eval(cmd) }
})
Logger.Log('The API of Iron Furnaces is named IronFurnacesAPI.', 'API')
