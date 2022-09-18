/// <reference path='../declarations/core-engine.d.ts'/>
/// <reference path='../declarations/CustomFurnaces.d.ts'/>
/// <reference path='../declarations/VanillaSlots.d.ts'/>
/// <reference path='../declarations/TileRender.d.ts'/>
/// <reference path='./share.js'/>

IMPORT('CustomFurnaces')
IMPORT('StorageInterface')
IMPORT('VanillaSlots')
IMPORT('TileRender')

/**
 * @typedef { {\
 *   input: number, output: number, fuel: number,\
 *   succeed: number, fail: number, burn: number\
 * } } furnaceDescription
 * @param { string } prefix 
 * @returns { furnaceDescription }
 */
function getFurnaceDesc(prefix) {
    /** @type { furnaceDescription } */
    let ret =  {
        input: Number(__config__.getInteger(prefix + '.input')),
        output: Number(__config__.getInteger(prefix + '.output')),
        fuel: Number(__config__.getInteger(prefix + '.fuel')),
        succeed: Number(__config__.getDouble(prefix + '.succeed')),
        fail: Number(__config__.getDouble(prefix + '.fail')),
        burn: Number(__config__.getDouble(prefix + '.burn'))
    }
    if (isNaN(ret.input) || ret.input < 1) ret.input = 1
    if (isNaN(ret.output) || ret.output < 1) ret.output = 1
    if (isNaN(ret.fuel) || ret.fuel < 1) ret.fuel = 1
    if (isNaN(ret.succeed)) ret.succeed = 0
    if (isNaN(ret.fail)) ret.fail = 0
    if (isNaN(ret.burn)) ret.burn = 0
    return ret
}

const FurnaceDesc = {
    copper: getFurnaceDesc('copper'),
    crystal: getFurnaceDesc('crystal'),
    diamond: getFurnaceDesc('diamond'),
    gold: getFurnaceDesc('gold'),
    iron: getFurnaceDesc('iron'),
    obsidian: getFurnaceDesc('obsidian'),
    silver: getFurnaceDesc('silver')
}

/**
 * @param { string } title 
 * @param { Array<[x: number, y: number]> | number } input X(-) Y(-)
 * @param { Array<[x: number, y: number]> | number } output X(+) Y(+)
 * @param { Array<[x: number, y: number]> | number } fuel X(-) Y(+)
 * @param { number = } slotSize 
 * @param { [absoluteX: number, absoluteY: number] = } burn 
 * @returns { {gui: UI.StandardWindow, descriptor: FurnaceDescriptor} }
 */
function createFurnaceWindow(title, input, output, fuel, slotSize, burn) {
    if (!slotSize) slotSize = 70
    if (!burn) burn = [500, 250]
    let slotSizePer60 = slotSize / 60
    let basePos = [burn[0], burn[1]]
    basePos = [
        burn[0] - 80 * slotSizePer60,
        burn[1] - 70 * slotSizePer60
    ]
    if (typeof input === 'number') {
        let size = input
        input = []
        let pos = [basePos[0], basePos[1]]
        for (let index = 0; index < size; index++) {
            input.push([pos[0], pos[1]])
            if ((pos[0] -= slotSize) < 0) {
                pos[0] = basePos[0]
                pos[1] -= slotSize
            }
        }
    } else input.forEach(function (pos) {
        pos[0] = pos[0] * slotSize + basePos[0]
        pos[1] = pos[1] * slotSize + basePos[1]
    })
    basePos = [
        burn[0] + 80 * slotSizePer60,
        burn[1] + slotSize / 2
    ]
    if (typeof output === 'number') {
        let size = output
        output = []
        let pos = [basePos[0], basePos[1]]
        for (let index = 0; index < size; index++) {
            output.push([pos[0], pos[1]])
            if ((pos[0] += slotSize) + slotSize > 1000) {
                pos[0] = basePos[0]
                pos[1] += slotSize
            }
        }
        let deltaY = -(output[size - 1][1] + slotSize - basePos[1]) / 2
        for (let index = 0; index < size; index++) {
            output[index][1] += deltaY
        }
    } else output.forEach(function (pos) {
        pos[0] = pos[0] * slotSize + basePos[0]
        pos[1] = pos[1] * slotSize + basePos[1]
    })
    basePos = [
        burn[0] - 80 * slotSizePer60,
        burn[1] + 70 * slotSizePer60
    ]
    if (typeof fuel === 'number') {
        let size = fuel
        fuel = []
        let pos = [basePos[0], basePos[1]]
        for (let index = 0; index < size; index++) {
            fuel.push([pos[0], pos[1]])
            if ((pos[0] -= slotSize) < 0) {
                pos[0] = basePos[0]
                pos[1] += slotSize
            }
        }
    } else fuel.forEach(function (pos) {
        pos[0] = pos[0] * slotSize + basePos[0]
        pos[1] = pos[1] * slotSize + basePos[1]
    })
    /** @type { UI.DrawingSet } */
    let drawing = [
        {
            type: 'bitmap',
            x: Math.round(burn[0] - 78 * slotSizePer60),
            y: Math.round(burn[1] + 2 * slotSizePer60),
            bitmap: 'if_furnace_fire_0',
            width: Math.round(56 * slotSizePer60),
            height: Math.round(56 * slotSizePer60)
        },
        {
            type: 'bitmap',
            x: Math.round(burn[0] - 3 * slotSizePer60),
            y: Math.round(burn[1] + 6 * slotSizePer60),
            bitmap: 'if_furnace_arrow_0',
            width: Math.round(66 * slotSizePer60),
            height: Math.round(48 * slotSizePer60)
        }
    ]
    /** @type { UI.ElementSet } */
    let elements = {
        'fireScale': {
            type: 'scale',
            x: drawing[0].x,
            y: drawing[0].y,
            bitmap: 'if_furnace_fire_1',
            width: drawing[0].width,
            height: drawing[0].height,
            direction: 1,
            value: 0.5
        },
        'arrowScale': {
            type: 'scale',
            x: drawing[1].x,
            y: drawing[1].y,
            bitmap: 'if_furnace_arrow_1',
            width: drawing[1].width,
            height: drawing[1].height,
            direction: 0,
            value: 0.5
        }
    }
    let minY = 0
    let maxY = burn[1] + slotSize
    input.forEach(function (pos, index) {
        elements['input' + index] = { type: 'slot', x: pos[0], y: pos[1], size: slotSize }
        if (pos[1] < minY) minY = pos[1]
        if (pos[1] + slotSize > maxY) maxY = pos[1] + slotSize
    })
    output.forEach(function (pos, index) {
        elements['output' + index] = { type: 'slot', x: pos[0], y: pos[1], size: slotSize }
        if (pos[1] < minY) minY = pos[1]
        if (pos[1] + slotSize > maxY) maxY = pos[1] + slotSize
    })
    fuel.forEach(function (pos, index) {
        elements['fuel' + index] = { type: 'slot', x: pos[0], y: pos[1], size: slotSize }
        if (pos[1] < minY) minY = pos[1]
        if (pos[1] + slotSize > maxY) maxY = pos[1] + slotSize
    })
    if (minY < 0) {
        for (let i = 0; i < drawing.length; i++) drawing[i].y -= minY
        for (let key in elements) elements[key].y -= minY
        maxY -= minY
    }
    return {
        gui: new UI.StandardWindow({
            standard: {
                header: { text: { text: title } },
                inventory: { standard: true },
                background: { standard: true },
                minHeight: maxY
            },
            drawing: drawing,
            elements: elements
        }),
        descriptor: {
            inputSlot: ['input^0-' + String(input.length - 1)],
            outputSlot: ['output^0-' + String(output.length - 1)],
            fuelSlot: ['fuel^0-' + String(fuel.length - 1)],
            burn: 'fireScale',
            progress: 'arrowScale'
        }
    }
}

/**
 * @param { Object } param 
 * @param { string } param.nameId 
 * @param { string } param.name 
 * @param { {top: [string, number], bottom: [string, number], side: [string, number], frontOff: [string, number], frontOn: [string, number]} } param.texture 
 * @param { string | Block.SpecialType } param.blockType 
 * @param { UI.StandardWindow } param.gui 
 * @param { FurnaceDescriptor } param.descriptor 
 * @param { TileEntity.TileEntityPrototype } param.customPrototype 
 */
function createFurnace(param) {
    IDRegistry.genBlockID(param.nameId)
    Block.createBlockWithRotation(param.nameId, [{
        name: param.name,
        texture: [
            param.texture.top,
            param.texture.bottom,
            param.texture.side,
            param.texture.frontOff,
            param.texture.side,
            param.texture.side
        ],
        inCreative: true
    }], param.blockType)

    let id = BlockID[param.nameId]
    ToolAPI.registerBlockMaterial(id, 'stone', 1, true)
    Block.setDestroyLevel(id, 1, true)

    TileRenderer.setStandardModelWithRotation(id, 2, [
        param.texture.top,
        param.texture.bottom,
        param.texture.side,
        param.texture.frontOff,
        param.texture.side,
        param.texture.side
    ])
    TileRenderer.registerModelWithRotation(id, 2, [
        param.texture.top,
        param.texture.bottom,
        param.texture.side,
        param.texture.frontOn,
        param.texture.side,
        param.texture.side
    ])
    TileRenderer.setRotationFunction(id)

    CustomFurnaces.unionObject(param.customPrototype, {
        useNetworkItemContainer: true,
        init() {
            let block = this.blockSource.getBlock(this.x, this.y, this.z)
            this.networkData.putInt('blockId', block.id)
            this.networkData.putInt('blockData', block.data)
            this.networkData.sendChanges()
        },
        getScreenName(player, coords) {
            return 'main'
        },
        getScreenByName(screenName) {
            return param.gui
        },
        client: {
            renderModel(isActive) {
                if (isActive) {
                    let blockId = Network.serverToLocalId(this.networkData.getInt('blockId'))
                    let blockData = this.networkData.getInt('blockData')
                    TileRenderer.mapAtCoords(this.x, this.y, this.z, blockId, blockData)
                } else {
                    BlockRenderer.unmapAtCoords(this.x, this.y, this.z)
                }
            }
        }
    })
    CustomFurnaces.registerTileEntity(id, param.customPrototype)
    let storageDescriptor = CustomFurnaces.createFurnaceInterface(id, param.descriptor)
    StorageInterface.createInterface(id, storageDescriptor)
    VanillaSlots.registerForTile(id, param.gui)
}
