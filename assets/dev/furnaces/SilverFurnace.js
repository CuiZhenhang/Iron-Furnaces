/// <reference path='../upgrades.js'/>

let silverFurnaceWindow = createFurnaceWindow(
    Translation.translate('Silver Furnace'),
    FurnaceDesc.silver.input,
    FurnaceDesc.silver.output,
    FurnaceDesc.silver.fuel
)

createFurnace({
    nameId: 'ifSilverFurnace',
    name: 'Silver Furnace',
    texture: {
        top: ['if_silver_furnace_side', 0],
        bottom: ['if_silver_furnace_side', 0],
        side: ['if_silver_furnace_side', 0],
        frontOff: ['if_silver_furnace_front_off', 0],
        frontOn: ['if_silver_furnace_front_on', 0]
    },
    blockType: {
        sound: 'stone',
        solid: true,
        lightopacity: 15
    },
    gui: silverFurnaceWindow.gui,
    descriptor: silverFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.silver.succeed,
                fail: FurnaceDesc.silver.fail
            }, FurnaceDesc.silver.burn)
        },
        click(id, count, data, coords, player, extra) {
            switch (id) {
                case ItemID.ifSilverGoldUpgrade: {
                    upgradeFurnace(this, BlockID.ifGoldFurnace, player)
                    return true
                }
            }
        }
    }
})
