/// <reference path='../upgrades.js'/>

let diamondFurnaceWindow = createFurnaceWindow(
    Translation.translate('Diamond Furnace'),
    FurnaceDesc.diamond.input,
    FurnaceDesc.diamond.output,
    FurnaceDesc.diamond.fuel
)

createFurnace({
    nameId: 'ifDiamondFurnace',
    name: 'Diamond Furnace',
    texture: {
        top: ['if_diamond_furnace_side', 0],
        bottom: ['if_diamond_furnace_side', 0],
        side: ['if_diamond_furnace_side', 0],
        frontOff: ['if_diamond_furnace_front_off', 0],
        frontOn: ['if_diamond_furnace_front_on', 0]
    },
    blockType: {
        sound: 'stone',
        solid: true,
        lightopacity: 15
    },
    gui: diamondFurnaceWindow.gui,
    descriptor: diamondFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.diamond.succeed,
                fail: FurnaceDesc.diamond.fail
            }, FurnaceDesc.diamond.burn)
        },
        click(id, count, data, coords, player, extra) {
            switch (id) {
                case ItemID.ifDiamondCrystalUpgrade: {
                    upgradeFurnace(this, BlockID.ifCrystalFurnace, player)
                    return true
                }
                case ItemID.ifDiamondObsidianUpgrade: {
                    upgradeFurnace(this, BlockID.ifObsidianFurnace, player)
                    return true
                }
            }
        }
    }
})
