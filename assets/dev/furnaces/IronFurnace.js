/// <reference path='../upgrades.js'/>

let ironFurnaceWindow = createFurnaceWindow(
    Translation.translate('Iron Furnace'),
    FurnaceDesc.iron.input,
    FurnaceDesc.iron.output,
    FurnaceDesc.iron.fuel
)

createFurnace({
    nameId: 'ifIronFurnace',
    name: 'Iron Furnace',
    texture: {
        top: ['if_iron_furnace_side', 0],
        bottom: ['if_iron_furnace_side', 0],
        side: ['if_iron_furnace_side', 0],
        frontOff: ['if_iron_furnace_front_off', 0],
        frontOn: ['if_iron_furnace_front_on', 0]
    },
    blockType: {
        sound: 'stone',
        solid: true,
        lightopacity: 15
    },
    gui: ironFurnaceWindow.gui,
    descriptor: ironFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.iron.succeed,
                fail: FurnaceDesc.iron.fail
            }, FurnaceDesc.iron.burn)
        },
        click(id, count, data, coords, player, extra) {
            switch (id) {
                case ItemID.ifIronGoldUpgrade: {
                    upgradeFurnace(this, BlockID.ifGoldFurnace, player)
                    return true
                }
            }
        }
    }
})
