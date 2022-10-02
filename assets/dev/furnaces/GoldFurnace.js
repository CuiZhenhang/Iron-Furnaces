/// <reference path='../upgrades.js'/>

let goldFurnaceWindow = createFurnaceWindow(
    Translation.translate('Gold Furnace'),
    FurnaceDesc.gold.input,
    FurnaceDesc.gold.output,
    FurnaceDesc.gold.fuel
)

createFurnace({
    nameId: 'ifGoldFurnace',
    name: 'Gold Furnace',
    texture: {
        top: ['if_gold_furnace_side', 0],
        bottom: ['if_gold_furnace_side', 0],
        side: ['if_gold_furnace_side', 0],
        frontOff: ['if_gold_furnace_front_off', 0],
        frontOn: ['if_gold_furnace_front_on', 0]
    },
    blockType: {
        sound: 'stone',
        solid: true,
        lightopacity: 15
    },
    gui: goldFurnaceWindow.gui,
    descriptor: goldFurnaceWindow.descriptor,
    customPrototype: {
        tick() {
            StorageInterface.checkHoppers(this)
            CustomFurnaces.processHighSpeed(this, {
                succeed: FurnaceDesc.gold.succeed,
                fail: FurnaceDesc.gold.fail
            }, FurnaceDesc.gold.burn)
        },
        click(id, count, data, coords, player, extra) {
            switch (id) {
                case ItemID.ifGoldDiamondUpgrade: {
                    upgradeFurnace(this, BlockID.ifDiamondFurnace, player)
                    return true
                }
            }
        }
    }
})
