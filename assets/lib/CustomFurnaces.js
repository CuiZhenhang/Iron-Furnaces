/// <reference path='../declarations/core-engine.d.ts'/>
/// <reference path='../declarations/StorageInterface.d.ts'/>
/// <reference path='../declarations/CustomFurnaces.d.ts'/>

LIBRARY({
    name: 'CustomFurnaces',
    version: 1,
    api: 'CoreEngine',
    shared: true
})

IMPORT('StorageInterface')

/** @type { CustomFurnaces } */
let CustomFurnaces = {
    eps: 1e-6,
    cacheSize: 32,
    fullProgress: 200,
    averageXP: 0.3,
    slotData: {
        input: {
            input: true,
            side: 'up'
        },
        output: {
            output: true
        },
        fuel: {
            input: true,
            output: true,
            isValid (item, side, tileEntity) {
                if (side === 1 /* up */) return false
                return CustomFurnaces.getBurnDuration(tileEntity, item.id, item.data) > 0
            },
            canOutput (item, side, tileEntity) {
                return CustomFurnaces.getBurnDuration(tileEntity, item.id, item.data) <= 0
            }
        }
    },
    tileEntityPrototype: {
        useNetworkItemContainer: true,
        defaultValues: {
            __isActive: false,
            __burning: 0,
            __burningMax: 0,
            __progress: 0,
            __storedXP: 0
        },
        __cache: {
            recipe: { size: 0 },
            fuel: { size: 0 },
            inputIndex: -1,
            outputIndex: -1,
            data: null
        },
        __invalidateData () {
            this.networkData.putBoolean('__active', this.data.__isActive)
            this.networkData.sendChanges()
            this.container.setScale(this.__cache.data.burn, this.data.__burningMax ? this.data.burning / this.data.__burningMax : 0)
            this.container.setScale(this.__cache.data.progress, this.data.__progress / CustomFurnaces.fullProgress)
        },
        __dropXP () {
            if (this.data.__storedXP > 0) {
                this.blockSource.spawnExpOrbs(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.__storedXP)
                this.data.__storedXP = 0
            }
        },
        init () {
            this.__cache.data = CustomFurnaces.getFurnaceData(this.blockID)
            if (!this.__cache.data) return
            let that = this
            this.__cache.data.fuelSlot && this.__cache.data.fuelSlot.forEach(function (name) {
                that.container.setSlotAddTransferPolicy(name, function (container, str, id, count, data, extra, time) {
                    return CustomFurnaces.getBurnDuration(that, id, data) > 0 ? count : 0
                })
            })
            this.__cache.data.outputSlot.forEach(function (name) {
                that.container.setSlotAddTransferPolicy(name, function (container, str, id, count, data, extra, time) {
                    return 0
                })
                that.container.setSlotGetTransferPolicy(name, function (container, str, id, count, data, extra, time) {
                    if (that.data.__storedXP > 0) that.__dropXP()
                    return count
                })
            })
            this.__invalidateData()
        },
        tick () {
            StorageInterface.checkHoppers(this)
            /** @type { FurnaceDescriptor } */
            let furnaceData = this.__cache.data
            /** @type { ItemContainer } */
            let container = this.container
            if (this.__cache.inputIndex >= 0) {
                let slot = container.getSlot(furnaceData.inputSlot[this.__cache.inputIndex])
                if (!slot || slot.id === 0) this.__cache.inputIndex = -1
            }
            if (this.__cache.inputIndex < 0) {
                for (let index = 0; index < furnaceData.inputSlot.length; index++) {
                    let slot = container.getSlot(furnaceData.inputSlot[index])
                    if (!slot || slot.id === 0) continue
                    if (!CustomFurnaces.getRecipeResult(this, slot.id, slot.data)) continue
                    this.__cache.inputIndex = index
                    break
                }
            }
            if (this.__cache.outputIndex >= 0) {
                let slot = container.getSlot(furnaceData.outputSlot[this.__cache.outputIndex])
                if (!slot || slot.id !== 0) this.__cache.outputIndex = -1
            }
            if (this.__cache.outputIndex < 0) {
                for (let index = 0; index < furnaceData.outputSlot.length; index++) {
                    let slot = container.getSlot(furnaceData.outputSlot[index])
                    if (!slot || slot.id !== 0) continue
                    this.__cache.outputIndex = index
                    break
                }
            }
        },
        destroyBlock (coords, player) {
            if (this.data.__storedXP > 0) this.__dropXP()
        },
        client: {
            load () {
                let that = this
                this.networkData.addOnDataChangedListener(function (networkData, isExternalChange) {
                    if (typeof that.renderModel === 'function') {
                        that.renderModel(Boolean(networkData.getBoolean('__active')))
                    }
                })
                if (typeof this.renderModel === 'function') {
                    this.renderModel(Boolean(this.networkData.getBoolean('__active')))
                }
            }
        }
    },
    data: {},
    getFurnaceData (furnaceId) {
        return this.data[furnaceId]
    },
    createFurnaceInterface (furnaceId, descriptor, storageDescriptor) {
        if (!storageDescriptor) storageDescriptor = {}
        if (!storageDescriptor.slots) storageDescriptor.slots = {}
        if (!this.data[furnaceId]) {
            this.data[furnaceId] = {
                inputSlot: [],
                outputSlot: [],
                fuelSlot: [],
                burn: descriptor.burn,
                progress: descriptor.progress
            }
        }
        let that = this
        let furnaceData = this.data[furnaceId]
        let storageSlot = storageDescriptor.slots
        descriptor.inputSlot.forEach(function (name) {
            let arr = that.resolveName(name)
            for (let i = 0; i < arr.length; i++) {
                furnaceData.inputSlot.push(arr[i])
                if (typeof storageSlot[arr[i]] === 'undefined') {
                    storageSlot[arr[i]] = that.slotData.input
                }
            }
        })
        descriptor.outputSlot.forEach(function (name) {
            let arr = that.resolveName(name)
            for (let i = 0; i < arr.length; i++) {
                furnaceData.outputSlot.push(arr[i])
                if (typeof storageSlot[arr[i]] === 'undefined') {
                    storageSlot[arr[i]] = that.slotData.output
                }
            }
        })
        descriptor.fuelSlot && descriptor.fuelSlot.forEach(function (name) {
            let arr = that.resolveName(name)
            for (let i = 0; i < arr.length; i++) {
                furnaceData.fuelSlot.push(arr[i])
                if (typeof storageSlot[arr[i]] === 'undefined') {
                    storageSlot[arr[i]] = that.slotData.fuel
                }
            }
        })
        StorageInterface.createInterface(furnaceId, storageDescriptor)
    },
    registerTileEntity (furnaceId, customPrototype) {
        this.unionObject(customPrototype, this.tileEntityPrototype)
        TileEntity.registerPrototype(furnaceId, customPrototype)
    },
    getRecipeResult (tileEntity, id, data) {
        if (id === 0) return null
        if (!tileEntity || !tileEntity.__cache || typeof tileEntity.__cache.recipe !== 'object') {
            let result = Recipes.getFurnaceRecipeResult(id, data)
            if (!result) result = Recipes.getFurnaceRecipeResult(id, -1)
            return result
        }
        /** @type { {size: number, [key: `${number}:${number}`]: ItemInstance} } */
        let cache = tileEntity.__cache.recipe
        if (typeof cache[id + ':' + data] !== 'undefined') return cache[id + ':' + data]
        let result = Recipes.getFurnaceRecipeResult(id, data)
        if (!result) result = Recipes.getFurnaceRecipeResult(id, -1)
        cache[id + ':' + data] = result
        if (++cache.size > this.cacheSize) cache = tileEntity.__cache.recipe = { size: 0 }
        return result
    },
    getBurnDuration (tileEntity, id, data) {
        if (id === 0) return 0
        if (!tileEntity || !tileEntity.__cache || typeof tileEntity.__cache.fuel !== 'object') {
            let result = Recipes.getFuelBurnDuration(id, data)
            if (result <= 0) result = Recipes.getFuelBurnDuration(id, -1)
            return result
        }
        /** @type { {size: number, [key: `${number}:${number}`]: number} } */
        let cache = tileEntity.__cache.fuel
        if (typeof cache[id + ':' + data] !== 'undefined') return cache[id + ':' + data]
        let result = Recipes.getFuelBurnDuration(id, data)
        if (result <= 0) result = Recipes.getFuelBurnDuration(id, -1)
        cache[id + ':' + data] = result
        if (++cache.size > this.cacheSize) cache = tileEntity.__cache.fuel = { size: 0 }
        return result
    },
    process (tileEntity, progress, burn) {
        if (typeof burn === 'undefined') burn = 1
        if (typeof progress === 'number') progress = { succeed: progress, fail: -2 * progress }
        if (progress.succeed < 0) progress.succeed = 0
        if (progress.fail > 0) progress.fail = 0
        let slotSucc = false
        if (tileEntity.__cache.inputIndex >= 0) {
            if (tileEntity.__cache.outputIndex >= 0) slotSucc = true
            else {
                /** @type { FurnaceDescriptor } */
                let furnaceData = tileEntity.__cache.data
                /** @type { {[key: `${number}:${number}`]: Array<Nullable<ItemExtraData>>} } */
                let resultObj = {}
                /** @type { ItemContainer } */
                let container = tileEntity.container
                for (let index = 0; index < furnaceData.inputSlot.length; index++) {
                    let slot = container.getSlot(furnaceData.inputSlot[index])
                    if (!slot || slot.id === 0) continue
                    let result = this.getRecipeResult(tileEntity, slot.id, slot.data)
                    let key = result.id + ':' + Math.max(result.data, 0)
                    if (!resultObj[key]) resultObj[key] = []
                    if (!result.extra || result.extra.isEmpty()) {
                         if (resultObj[key].indexOf(null) >= 0) continue
                         resultObj[key].push(null)
                    } else resultObj[key].push(result.extra)
                }
                for (let index = 0; index < furnaceData.outputSlot.length; index++) {
                    let slot = container.getSlot(furnaceData.outputSlot[index])
                    if (!slot) continue
                    if (slot.id === 0) {
                        slotSucc = true
                        break
                    }
                    if (slot.count >= Item.getMaxStack(slot.id)) continue
                    let arr = resultObj[slot.id + ':' + slot.data]
                    if (!arr) continue
                    if (slot.extra && !slot.extra.isEmpty()) {
                        if (arr.some(function (extra) { return slot.extra.equals(extra) })) {
                            slotSucc = true
                            break
                        }
                    } else {
                        if (arr.indexOf(null) >= 0) {
                            slotSucc = true
                            break
                        }
                    }
                }
            }
        }
        let ret = 0
        if (slotSucc) {
            let burned = this.decreaseBurning(tileEntity, burn)
            ret = Math.min(burn ? burned / burn : 1, 1)
            tileEntity.data.__isActive = ret > 0
            if (ret > 0) this.updateProgress(tileEntity, progress.succeed * ret)
            else if (tileEntity.data.__progress > 0) this.updateProgress(tileEntity, progress.fail)
        } else {
            if (tileEntity.data.__burning > 0) tileEntity.data.__isActive = this.decreaseBurning(tileEntity, Math.min(burn, tileEntity.data.__burning)) > 0
            else tileEntity.data.__isActive = false
            if (tileEntity.data.__progress > 0) this.updateProgress(tileEntity, progress.fail)
        }
        if (tileEntity.data.__isActive !== Boolean(tileEntity.networkData.getBoolean('__active'))) {
            tileEntity.networkData.putBoolean('__active', tileEntity.data.__isActive)
            tileEntity.networkData.sendChanges()
        }
        tileEntity.container.sendChanges()
        return ret
    },
    decreaseBurning (tileEntity, value) {
        if (typeof value === 'undefined' || value < 0) value = 1
        let tileData = tileEntity.data
        /** @type { FurnaceDescriptor } */
        let furnaceData = tileEntity.__cache.data
        let newBurning = tileData.__burning - value
        if (newBurning < 0) {
            if (furnaceData.fuelSlot) {
                /** @type { ItemContainer } */
                let container = tileEntity.container
                for (let index = 0; index < furnaceData.fuelSlot.length; index++) {
                    let slot = container.getSlot(furnaceData.fuelSlot[index])
                    if (!slot || slot.id === 0) continue
                    let burnDuration = this.getBurnDuration(tileEntity, slot.id, slot.data)
                    if (burnDuration <= 0) continue
                    tileData.__burningMax = burnDuration
                    if (LiquidRegistry.getEmptyItem(slot.id, slot.data)) {
                        let emptyItem = LiquidRegistry.getEmptyItem(slot.id, slot.data)
                        newBurning += burnDuration * slot.count
                        slot.setSlot(emptyItem.id, slot.count, emptyItem.data, slot.extra)
                        slot.validate()
                    } else {
                        if (newBurning + burnDuration >= 0) {
                            newBurning += burnDuration
                            slot.setSlot(slot.id, slot.count - 1, slot.data, slot.extra)
                            slot.validate()
                        } else if (newBurning + burnDuration * slot.count <= 0) {
                            newBurning += burnDuration * slot.count
                            slot.clear()
                        } else {
                            let count = Math.ceil(-newBurning / burnDuration)
                            newBurning += burnDuration * count
                            slot.setSlot(slot.id, slot.count - count, slot.data, slot.extra)
                            slot.validate()
                        }
                    }
                    if (newBurning >= 0) break
                }
            }
            if (newBurning < 0) {
                value = tileData.__burning
                newBurning = 0
            }
        }
        tileData.__burning = newBurning
        if (newBurning <= 0) tileData.__burningMax = 0
        tileEntity.container.setScale(furnaceData.burn, tileData.__burningMax ? newBurning / tileData.__burningMax : 0)
        return Number(value)
    },
    updateProgress (tileEntity, value) {
        let tileData = tileEntity.data
        /** @type { FurnaceDescriptor } */
        let furnaceData = tileEntity.__cache.data
        let newProgress = tileData.__progress + value
        if (newProgress < 0) newProgress = 0
        else if (newProgress + this.eps >= this.fullProgress) {
            /** @type { ItemContainer } */
            let container = tileEntity.container
            let times = Math.floor((newProgress + this.eps) / this.fullProgress + this.eps)
            newProgress -= this.fullProgress * times
            if (newProgress < 0) newProgress = 0
            for (let inputIndex = 0; inputIndex < furnaceData.inputSlot.length; inputIndex++) {
                if (times <= 0) break
                let inputSlot = container.getSlot(furnaceData.inputSlot[inputIndex])
                if (!inputSlot || inputSlot.id === 0) continue
                let inputCount = inputSlot.count
                let result = this.getRecipeResult(tileEntity, inputSlot.id, inputSlot.data)
                if (!result) continue
                let resultData = Math.max(result.data, 0), count = result.count, maxStack = Item.getMaxStack(result.id)
                for (let outputIndex = 0; outputIndex < furnaceData.outputSlot.length; outputIndex++) {
                    let outputSlot = container.getSlot(furnaceData.outputSlot[outputIndex])
                    if (!outputSlot) return
                    if (outputSlot.id !== 0 && (outputSlot.id !== result.id || outputSlot.data !== resultData || outputSlot.count >= maxStack)) continue
                    if (outputSlot.extra && !outputSlot.extra.isEmpty() && !outputSlot.extra.equals(result.extra)) continue
                    let newSlotCount = (outputSlot.id === 0 ? 0 : outputSlot.count) + count
                    if (newSlotCount > maxStack) newSlotCount = maxStack
                    count -= newSlotCount - outputSlot.count
                    outputSlot.setSlot(result.id, newSlotCount, resultData, result.extra || null)
                    if (count <= 0) {
                        --times
                        inputSlot.setSlot(inputSlot.id, --inputCount, inputSlot.data, inputSlot.extra)
                        let xp = this.averageXP
                        tileData.__storedXP += Math.floor(xp)
                        if (Math.random() < xp % 1) tileData.__storedXP++
                        if (inputCount <= 0) break
                        if (times <= 0) break
                        --outputIndex
                    }
                }
                if (0 < count && count < result.count) {
                    --times
                    tileEntity.blockSource.spawnDroppedItem(tileEntity.x + 0.5, tileEntity.y + 1, tileEntity.z + 0.5, result.id, count, resultData, result.extra)
                }
            }
            container.validateAll()
        }
        tileData.__progress = newProgress
        tileEntity.container.setScale(furnaceData.progress, newProgress / this.fullProgress)
    },
    getTileEntityData (tileEntity) {
        let tileData = tileEntity.data
        return {
            isActive: tileData.__isActive,
            burning: tileData.__burning,
            burningMax: tileData.__burningMax,
            progress: tileData.__progress,
            storedXP: tileData.__storedXP
        }
    },
    setTileEntityData (tileEntity, data, noUpdate) {
        let tileData = tileEntity.data
        if (typeof data.isActive !== 'undefined') tileData.__isActive = data.isActive
        if (typeof data.burning !== 'undefined') tileData.__burning = data.burning
        if (typeof data.burningMax !== 'undefined') tileData.__burningMax = data.burningMax
        if (typeof data.progress !== 'undefined') tileData.__progress = data.progress
        if (typeof data.storedXP !== 'undefined') tileData.__storedXP = data.storedXP
        if (!noUpdate) tileEntity.__invalidateData()
    },
    resolveName (name) {
        if (!name.includes('^')) return [name]
        let str = name.split('^')
        let index = str[1].split('-')
        let range = [Math.ceil(Number(index[0])), Math.floor(Number(index[1]))]
        if (isNaN(range[0]) || isNaN(range[1])) return []
        let ret = []
        if (range[0] <= range[1]) {
            for (let i = range[0]; i <= range[1]; i++) {
                ret.push(str[0] + i)
            }
        } else {
            for (let i = range[0]; i >= range[1]; i--) {
                ret.push(str[0] + i)
            }
        }
        return ret
    },
    unionObject (target, obj) {
        for (let key in obj) {
            switch (typeof obj[key]) {
                case 'object': {
                    if (!obj[key]) break
                    if (typeof target[key] !== 'object' || !target[key]) target[key] = {}
                    this.unionObject(target[key], obj[key])
                    break
                }
                case 'function': {
                    if (typeof target[key] === 'function') {
                        let func1 = target[key]
                        let func0 = obj[key]
                        target[key] = function () {
                            let ret0 = func0.apply(this, arguments)
                            let ret1 = func1.apply(this, arguments)
                            if (typeof ret1 === 'undefined') return ret0
                            return ret1
                        }
                    } else target[key] = obj[key]
                    break
                }
                default: {
                    if (typeof target[key] === 'undefined') {
                        target[key] = obj[key]
                    }
                    break
                }
            }
        }
        return target
    }
}

if (getMCPEVersion().array[1] >= 16) {
    Callback.addCallback('PostLoaded', function () {
        let oldFuelLava = Recipes.getFuelBurnDuration(VanillaItemID.bucket, 10)
        let fuelLava = Recipes.getFuelBurnDuration(VanillaItemID.lava_bucket, 0)
        if (fuelLava <= 0 && oldFuelLava > 0) Recipes.addFurnaceFuel(VanillaItemID.lava_bucket, 0, oldFuelLava)
    }, 0)
}

EXPORT('CustomFurnaces', CustomFurnaces)