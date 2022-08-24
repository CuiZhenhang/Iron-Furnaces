/// <reference path='../declarations/core-engine.d.ts'/>
/// <reference path='../declarations/CustomFurnaces.d.ts'/>
/// <reference path='../declarations/VanillaSlots.d.ts'/>
/// <reference path='../declarations/TileRender.d.ts'/>
/// <reference path='./share.js'/>

IMPORT('CustomFurnaces')
IMPORT('VanillaSlots')
IMPORT('TileRender')

/**
 * @param { string } title 
 * @param { Array<[x: number, y: number]> | number } input O(burn[0], burn[1]-70) X(-60) Y(-60)
 * @param { Array<[x: number, y: number]> | number } output O(burn[0]+160, burn[1]) X(60) Y(60)
 * @param { Array<[x: number, y: number]> | number } fuel O(burn[0], burn[1]+70) X(-60) Y(60)
 * @param { [absoluteX: number, absoluteY: number] = } burn 
 * @returns { {gui: UI.StandardWindow, interface: FurnaceDescriptor} }
 */
function createFurnaceWindow(title, input, output, fuel, burn) {
    const slotPerRow = 7
    if (!burn) burn = [420, 250]
    let minHeight = burn[1] + 70
    if (typeof input === 'number') {
        let size = input
        input = []
        for (let index = 0; index < size; index++) {
            input.push([index % slotPerRow, Math.floor(index / slotPerRow)])
        }
    }
    if (typeof output === 'number') {
        let size = output
        output = []
        let deltaY = -Math.floor((size - 1) / slotPerRow) / 2 // 0.5 - (Math.floor((size - 1) / slotPerRow) + 1) / 2
        for (let index = 0; index < size; index++) {
            output.push([index % slotPerRow, Math.floor(index / slotPerRow) + deltaY])
        }
        minHeight = Math.max(minHeight, (burn[1]) + output[size - 1][1] * 60 + 60)
    }
    if (typeof fuel === 'number') {
        let size = fuel
        fuel = []
        for (let index = 0; index < size; index++) {
            fuel.push([index % slotPerRow, Math.floor(index / slotPerRow)])
        }
        minHeight = Math.max(minHeight, (burn[1] + 70) + fuel[size - 1][1] * 60 + 60)
    }
    let gui = new UI.StandardWindow({
        standard: {
            header: {
                text: {
                    text: title
                }
            },
            inventory: {
                standard: true
            },
            background: {
                standard: true
            },
            minHeight: minHeight
        },
        drawing: [
            {
                type: 'bitmap',
                x: burn[0] + 2,
                y: burn[1] + 2,
                bitmap: 'if_furnace_fire_0',
                width: 56,
                height: 56
            },
            {
                type: 'bitmap',
                x: burn[0] + 77,
                y: burn[1] + 6,
                bitmap: 'if_furnace_arrow_0',
                width: 66,
                height: 48
            }
        ],
        elements: {
            'fireScale': {
                type: 'scale',
                x: burn[0] + 2,
                y: burn[1] + 2,
                bitmap: 'if_furnace_fire_1',
                width: 56,
                height: 56,
                direction: 1,
                value: 0.5
            },
            'arrowScale': {
                type: 'scale',
                x: burn[0] + 77,
                y: burn[1] + 6,
                bitmap: 'if_furnace_arrow_1',
                width: 66,
                height: 48,
                direction: 0,
                value: 0.5
            }
        }
    })
    let mainGui = gui.getWindow('main')
    let elements = mainGui.getContent().elements
    let minY = 0
    let basePos = [burn[0], burn[1]]
    basePos = [burn[0], burn[1] - 70]
    input.forEach(function (pos, index) {
        let x = basePos[0] + (-60) * pos[0]
        let y = basePos[1] + (-60) * pos[1]
        elements['input' + index] = { type: 'slot', x: x, y: y, size: 60 }
        if (y < minY) minY = y
    })
    basePos = [burn[0] + 160, burn[1]]
    output.forEach(function (pos, index) {
        let x = basePos[0] + (60) * pos[0]
        let y = basePos[1] + (60) * pos[1]
        elements['output' + index] = { type: 'slot', x: x, y: y, size: 60 }
        if (y < minY) minY = y
    })
    basePos = [burn[0], burn[1] + 70]
    fuel.forEach(function (pos, index) {
        let x = basePos[0] + (-60) * pos[0]
        let y = basePos[1] + (60) * pos[1]
        elements['fuel' + index] = { type: 'slot', x: x, y: y, size: 60 }
        if (y < minY) minY = y
    })
    if (minY < 0) {
        let drawing = mainGui.getContent().drawing
        for (let i = 0; i < drawing.length; i++) drawing[i].y -= minY
        for (let key in elements) elements[key].y -= minY
        minHeight -= minY
        gui.getContent().standard.minHeight = minHeight
    }
    gui.refreshAll()
    return {
        gui: gui,
        interface: {
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
 * @param { FurnaceDescriptor } param.interface 
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
            },
            unload() {
                BlockRenderer.unmapAtCoords(this.x, this.y, this.z)
            }
        }
    })
    CustomFurnaces.registerTileEntity(id, param.customPrototype)
    CustomFurnaces.createFurnaceInterface(id, param.interface)
    VanillaSlots.registerForTile(id, param.gui)
}