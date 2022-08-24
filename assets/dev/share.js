/// <reference path='./recipes.js'/>

ModAPI.registerAPI('IronFurnacesAPI', {
    version: (function getModVersion () {
        let json = FileTools.ReadJSON(__dir__ + 'mod.info')
        if (typeof json !== 'object') return 'unknow'
        return String(json.version || 'unknow')
    })(),
    createFurnaceWindow: createFurnaceWindow,
    createFurnace: createFurnace,
    upgradeFurnace: upgradeFurnace,
    upgradeVanillaFurnace: upgradeVanillaFurnace,
    requireGlobal: function (cmd) { return eval(cmd) }
})
Logger.Log('The API of Iron Furnaces is named IronFurnacesAPI.', 'API')
