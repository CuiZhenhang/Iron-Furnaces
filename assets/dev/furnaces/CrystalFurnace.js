/// <reference path='../upgrades.js'/>

let crystalFurnaceWindow = createFurnaceWindow(
    Translation.translate('Crystal Furnace'),
    FurnaceDesc.crystal.input,
    FurnaceDesc.crystal.output,
    FurnaceDesc.crystal.fuel
)

createFurnace({
    nameId: 'ifCrystalFurnace',
    name: 'Crystal Furnace',
    texture: {
        top: ['if_crystal_furnace_side', 0],
        bottom: ['if_crystal_furnace_side', 0],
        side: ['if_crystal_furnace_side', 0],
        frontOff: ['if_crystal_furnace_front_off', 0],
        frontOn: ['if_crystal_furnace_front_on', 0]
    },
    blockType: {
        base: VanillaBlockID.glass,
        sound: 'stone',
        renderallfaces: true
    },
    gui: crystalFurnaceWindow.gui,
    descriptor: crystalFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.crystal.succeed,
                fail: FurnaceDesc.crystal.fail
            }, FurnaceDesc.crystal.burn)
        }
    }
})
