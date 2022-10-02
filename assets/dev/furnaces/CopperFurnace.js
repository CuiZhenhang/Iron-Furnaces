/// <reference path='../upgrades.js'/>

let copperFurnaceWindow = createFurnaceWindow(
    Translation.translate('Copper Furnace'),
    FurnaceDesc.copper.input,
    FurnaceDesc.copper.output,
    FurnaceDesc.copper.fuel
)

createFurnace({
    nameId: 'ifCopperFurnace',
    name: 'Copper Furnace',
    texture: {
        top: ['if_copper_furnace_side', 0],
        bottom: ['if_copper_furnace_side', 0],
        side: ['if_copper_furnace_side', 0],
        frontOff: ['if_copper_furnace_front_off', 0],
        frontOn: ['if_copper_furnace_front_on', 0]
    },
    blockType: {
        sound: 'stone',
        solid: true,
        lightopacity: 15
    },
    gui: copperFurnaceWindow.gui,
    descriptor: copperFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.copper.succeed,
                fail: FurnaceDesc.copper.fail
            }, FurnaceDesc.copper.burn)
        },
        click(id, count, data, coords, player, extra) {
            switch (id) {
                case ItemID.ifCopperIronUpgrade: {
                    upgradeFurnace(this, BlockID.ifIronFurnace, player)
                    return true
                }
                case ItemID.ifCopperSilverUpgrade: {
                    upgradeFurnace(this, BlockID.ifSilverFurnace, player)
                    return true
                }
            }
        }
    }
})
