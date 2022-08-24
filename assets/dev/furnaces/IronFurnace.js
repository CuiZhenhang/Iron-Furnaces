/// <reference path='../upgrades.js'/>

let ironFurnaceWindow = createFurnaceWindow(Translation.translate('Iron Furnace'), 2, 2, 2)

createFurnace({
    nameId: 'ifIronFurnace',
    name: 'Iron Furnace',
    texture: {
        top: ['iron_block', 0],
        bottom: ['iron_block', 0],
        side: ['iron_block', 0],
        frontOff: ['furnace_front_off', 0],
        frontOn: ['furnace_front_on', 0]
    },
    blockType: {
        sound: 'stone'
    },
    gui: ironFurnaceWindow.gui,
    interface: ironFurnaceWindow.interface,
    customPrototype: {
        tick() {
            CustomFurnaces.process(this, 2, 2)
        },
        click(id, count, data, coords, player, extra) {

        }
    }
})
