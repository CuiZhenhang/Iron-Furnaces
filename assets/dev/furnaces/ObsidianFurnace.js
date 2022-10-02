/// <reference path='../upgrades.js'/>

let obsidianFurnaceWindow = createFurnaceWindow(
    Translation.translate('Obsidian Furnace'),
    FurnaceDesc.obsidian.input,
    FurnaceDesc.obsidian.output,
    FurnaceDesc.obsidian.fuel
)

createFurnace({
    nameId: 'ifObsidianFurnace',
    name: 'Obsidian Furnace',
    texture: {
        top: ['if_obsidian_furnace_side', 0],
        bottom: ['if_obsidian_furnace_side', 0],
        side: ['if_obsidian_furnace_side', 0],
        frontOff: ['if_obsidian_furnace_front_off', 0],
        frontOn: ['if_obsidian_furnace_front_on', 0]
    },
    blockType: {
        base: VanillaBlockID.obsidian,
        destroytime: 3,
        explosionres: 1200,
        sound: 'stone',
        solid: true,
        lightopacity: 15
    },
    gui: obsidianFurnaceWindow.gui,
    descriptor: obsidianFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.obsidian.succeed,
                fail: FurnaceDesc.obsidian.fail
            }, FurnaceDesc.obsidian.burn)
        }
    }
})
