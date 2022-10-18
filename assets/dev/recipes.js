/// <reference path='./upgrades.js'/>

Callback.addCallback('PreLoaded', function () {
    if (__config__.getBool('noRecipeOfUpgrades')) return;
    
    if (ItemID.ingotCopper) {
        Recipes.addShaped({id: ItemID.ifStoneCopperUpgrade, count: 1, data: 0}, [
            'xxx',
            'xax',
            'xxx'
        ], ['x', ItemID.ingotCopper, -1, 'a', VanillaBlockID.cobblestone, -1])
    }

    Recipes.addShaped({id: ItemID.ifStoneIronUpgrade, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaItemID.iron_ingot, -1, 'a', VanillaBlockID.cobblestone, -1])

    if (ItemID.ingotCopper) {
        Recipes.addShaped({id: ItemID.ifCopperIronUpgrade, count: 1, data: 0}, [
            'xgx',
            'gag',
            'xgx'
        ], ['x', VanillaItemID.iron_ingot, -1, 'a', ItemID.ingotCopper, -1, 'g', VanillaBlockID.glass, -1])
    }

    if (ItemID.ingotSilver && ItemID.ingotCopper) {
        Recipes.addShaped({id: ItemID.ifCopperSilverUpgrade, count: 1, data: 0}, [
            'xxx',
            'xax',
            'xxx'
        ], ['x', ItemID.ingotSilver, -1, 'a', ItemID.ingotCopper, -1])
    }

    Recipes.addShaped({id: ItemID.ifIronGoldUpgrade, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaItemID.gold_ingot, -1, 'a', VanillaItemID.iron_ingot, -1])

    if (ItemID.ingotSilver) {
        Recipes.addShaped({id: ItemID.ifSilverGoldUpgrade, count: 1, data: 0}, [
            'xgx',
            'gag',
            'xgx'
        ], ['x', VanillaItemID.gold_ingot, -1, 'a', ItemID.ingotSilver, -1, 'g', VanillaBlockID.glass, -1])
    }

    Recipes.addShaped({id: ItemID.ifGoldDiamondUpgrade, count: 1, data: 0}, [
        'ggg',
        'xax',
        'ggg'
    ], ['x', VanillaItemID.diamond, -1, 'a', VanillaItemID.gold_ingot, -1, 'g', VanillaBlockID.glass, -1])

    Recipes.addShaped({id: ItemID.ifDiamondCrystalUpgrade, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaBlockID.glass, -1, 'a', VanillaBlockID.obsidian, -1])

    Recipes.addShaped({id: ItemID.ifDiamondObsidianUpgrade, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaBlockID.obsidian, -1, 'a', VanillaBlockID.glass, -1])
})

Callback.addCallback('PreLoaded', function () {
    if (ItemID.ingotCopper) {
        Recipes.addShaped({id: BlockID.ifCopperFurnace, count: 1, data: 0}, [
            'xxx',
            'xax',
            'xxx'
        ], ['x', ItemID.ingotCopper, -1, 'a', VanillaBlockID.furnace, -1])
    }

    Recipes.addShaped({id: BlockID.ifIronFurnace, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaItemID.iron_ingot, -1, 'a', VanillaBlockID.furnace, -1])

    Recipes.addShaped({id: BlockID.ifIronFurnace, count: 1, data: 0}, [
        'xgx',
        'gag',
        'xgx'
    ], ['x', VanillaItemID.iron_ingot, -1, 'a', BlockID.ifCopperFurnace, -1, 'g', VanillaBlockID.glass, -1])

    if (ItemID.ingotSilver) {
        Recipes.addShaped({id: BlockID.ifSilverFurnace, count: 1, data: 0}, [
            'xxx',
            'xax',
            'xxx'
        ], ['x', ItemID.ingotSilver, -1, 'a', BlockID.ifCopperFurnace, -1])
    }

    if (ItemID.ingotSilver) {
        Recipes.addShaped({id: BlockID.ifSilverFurnace, count: 1, data: 0}, [
            'xgx',
            'gag',
            'xgx'
        ], ['x', ItemID.ingotSilver, -1, 'a', BlockID.ifIronFurnace, -1, 'g', VanillaBlockID.glass, -1])
    }

    Recipes.addShaped({id: BlockID.ifGoldFurnace, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaItemID.gold_ingot, -1, 'a', BlockID.ifIronFurnace, -1])

    Recipes.addShaped({id: BlockID.ifGoldFurnace, count: 1, data: 0}, [
        'xgx',
        'gag',
        'xgx'
    ], ['x', VanillaItemID.gold_ingot, -1, 'a', BlockID.ifSilverFurnace, -1, 'g', VanillaBlockID.glass, -1])

    Recipes.addShaped({id: BlockID.ifDiamondFurnace, count: 1, data: 0}, [
        'ggg',
        'xax',
        'ggg'
    ], ['x', VanillaItemID.diamond, -1, 'a', BlockID.ifGoldFurnace, -1, 'g', VanillaBlockID.glass, -1])

    Recipes.addShaped({id: BlockID.ifDiamondFurnace, count: 1, data: 0}, [
        'ggg',
        'gag',
        'xxx'
    ], ['x', VanillaItemID.diamond, -1, 'a', BlockID.ifSilverFurnace, -1, 'g', VanillaBlockID.glass, -1])

    Recipes.addShaped({id: BlockID.ifCrystalFurnace, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaBlockID.glass, -1, 'a', BlockID.ifDiamondFurnace, -1])

    Recipes.addShaped({id: BlockID.ifObsidianFurnace, count: 1, data: 0}, [
        'xxx',
        'xax',
        'xxx'
    ], ['x', VanillaBlockID.obsidian, -1, 'a', BlockID.ifDiamondFurnace, -1])
})
