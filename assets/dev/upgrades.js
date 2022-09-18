/// <reference path='./translation.js'/>

IDRegistry.genItemID('ifStoneCopperUpgrade')
IDRegistry.genItemID('ifStoneIronUpgrade')
IDRegistry.genItemID('ifCopperIronUpgrade')
IDRegistry.genItemID('ifCopperSilverUpgrade')
IDRegistry.genItemID('ifIronGoldUpgrade')
IDRegistry.genItemID('ifSilverGoldUpgrade')
IDRegistry.genItemID('ifGoldDiamondUpgrade')
IDRegistry.genItemID('ifDiamondCrystalUpgrade')
IDRegistry.genItemID('ifDiamondObsidianUpgrade')

Item.createItem('ifStoneCopperUpgrade', 'Stone to Copper Furnace Upgrade', { name: 'if_stone_copper_upgrade' }, { stack: 16 })
Item.createItem('ifStoneIronUpgrade', 'Stone to Iron Furnace Upgrade', { name: 'if_stone_iron_upgrade' }, { stack: 16 })
Item.createItem('ifCopperIronUpgrade', 'Copper to Iron Furnace Upgrade', { name: 'if_copper_iron_upgrade' }, { stack: 16 })
Item.createItem('ifCopperSilverUpgrade', 'Copper to Silver Furnace Upgrade', { name: 'if_copper_silver_upgrade' }, { stack: 16 })
Item.createItem('ifIronGoldUpgrade', 'Iron to Gold Furnace Upgrade', { name: 'if_iron_gold_upgrade' }, { stack: 16 })
Item.createItem('ifSilverGoldUpgrade', 'Silver to Gold Furnace Upgrade', { name: 'if_silver_gold_upgrade' }, { stack: 16 })
Item.createItem('ifGoldDiamondUpgrade', 'Gold to Diamond Furnace Upgrade', { name: 'if_gold_diamond_upgrade' }, { stack: 16 })
Item.createItem('ifDiamondCrystalUpgrade', 'Diamond to Crystal Furnace Upgrade', { name: 'if_diamond_crystal_upgrade' }, { stack: 16 })
Item.createItem('ifDiamondObsidianUpgrade', 'Diamond to Obsidian Furnace Upgrade', { name: 'if_diamond_obsidian_upgrade' }, { stack: 16 })


/**
 * @param { TileEntity } tileEntity 
 * @param { number } furnaceId 
 * @param { number } player 
 */
 function upgradeFurnace (tileEntity, furnaceId, player) {
    let blockData = tileEntity.blockSource.getBlockData(tileEntity.x, tileEntity.y, tileEntity.z)
    tileEntity.blockSource.setBlock(tileEntity.x, tileEntity.y, tileEntity.z, furnaceId, blockData)
    let container = new ItemContainer(tileEntity.container.asLegacyContainer())
    let tileData = CustomFurnaces.getTileEntityData(tileEntity)
    CustomFurnaces.setTileEntityData(tileEntity, { storedXP: 0 }, true)
    for (let name in tileEntity.container.slots) tileEntity.container.clearSlot(name)
    tileEntity.selfDestroy()
    let newTileEntity = TileEntity.addTileEntity(tileEntity.x, tileEntity.y, tileEntity.z, tileEntity.blockSource)
    newTileEntity.container = container
    CustomFurnaces.setTileEntityData(newTileEntity, tileData)
    let item = Entity.getCarriedItem(player)
    Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra)
}

/**
 * @param { Vector } coords 
 * @param { number } furnaceId 
 * @param { number } player 
 */
function upgradeVanillaFurnace (coords, furnaceId, player) {
    let region = BlockSource.getDefaultForActor(player)
    if (!region) return
    let blockId = region.getBlockId(coords.x, coords.y, coords.z)
    if (blockId !== VanillaTileID.furnace && blockId !== VanillaTileID.lit_furnace) return
    let container = new ItemContainer()
    let furnace = region.getBlockEntity(coords.x, coords.y, coords.z)
    if (!furnace) return
    // NBT
    let NBT = furnace.getCompoundTag()
    let tileData = {
        isActive: blockId === VanillaTileID.lit_furnace,
        burning: NBT.getShort('BurnTime'),
        burningMax: NBT.getShort('CookTime'),
        progress: NBT.getShort('BurnDuration'),
        storedXP: NBT.getInt('StoredXPInt')
    }
    // slot
    let slot = {
        input: furnace.getSlot(0),
        fuel: furnace.getSlot(1),
        output: furnace.getSlot(2)
    }
    container.setSlot('input0', slot.input.id, slot.input.count, slot.input.data, slot.input.extra)
    container.setSlot('fuel0', slot.fuel.id, slot.fuel.count, slot.fuel.data, slot.fuel.extra)
    container.setSlot('output0', slot.output.id, slot.output.count, slot.output.data, slot.output.extra)
    for (let i = 0; i < 3; i++) furnace.setSlot(i, 0, 0, 0)
    // replace
    let rotation = region.getBlockData(coords.x, coords.y, coords.z)
    region.setBlock(coords.x, coords.y, coords.z, furnaceId, rotation)
    let tileEntity = TileEntity.addTileEntity(coords.x, coords.y, coords.z, region)
    tileEntity.container = container
    CustomFurnaces.setTileEntityData(tileEntity, tileData)
    let item = Entity.getCarriedItem(player)
    Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra)
}

Callback.addCallback('ItemUse', function (coords, item, block, isExternal, player) {
    if (block.id !== VanillaTileID.furnace && block.id !== VanillaTileID.lit_furnace) return
    switch (item.id) {
        case ItemID.ifStoneCopperUpgrade: {
            upgradeVanillaFurnace(coords, BlockID.ifCopperFurnace, player)
            break
        }
        case ItemID.ifStoneIronUpgrade: {
            upgradeVanillaFurnace(coords, BlockID.ifIronFurnace, player)
            break
        }
    }
})
