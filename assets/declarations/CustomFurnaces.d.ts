/// <reference path='./core-engine.d.ts'/>
/// <reference path='../declarations/StorageInterface.d.ts'/>

interface FurnaceDescriptor {
    inputSlot: Array<string>;
    outputSlot: Array<string>;
    fuelSlot?: Array<string>;
    burn: string;
    progress: string;
}

interface FurnaceTileEntityData {
    isActive?: boolean;
    burning?: number;
    burningMax?: number;
    progress?: number;
    storedXP?: number;
}

interface ExtraFurnaceTileEntityPrototype {
    client?: {
        renderModel?: (isActive: boolean) => void;
    }
}

declare namespace CustomFurnaces {
    readonly var eps: number;
    readonly var cacheSize: number;
    readonly var fullProgress: number;
    readonly var averageXP: number;
    readonly var slotData: {
        input: SlotData,
        output: SlotData,
        fuel: SlotData
    };
    readonly var tileEntityPrototype: TileEntity.TileEntityPrototype;
    export var data: {
        [furnaceId: number]: FurnaceDescriptor;
    };
    export function getFurnaceData(furnaceId: number): FurnaceDescriptor;
    export function createFurnaceInterface(furnaceId: number, descriptor: FurnaceDescriptor, storageDescriptor?: StorageDescriptor): StorageDescriptor;
    export function registerTileEntity(furnaceId: number, customPrototype: TileEntity.TileEntityPrototype & ExtraFurnaceTileEntityPrototype): void
    export function getRecipeResult(tileEntity: TileEntity, id: number, data: number): ItemInstance;
    export function getBurnDuration(tileEntity: TileEntity, id: number, data: number): number
    export function process(tileEntity: TileEntity, progress: number | {succeed: number, fail: number}, burn?: number): number;
    export function processHighSpeed(tileEntity: TileEntity, progress: number | {succeed: number, fail: number}, burn?: number): number;
    export function decreaseBurning(tileEntity: TileEntity, value?: number): number;
    export function updateProgress(tileEntity: TileEntity, value: number): void;
    export function getTileEntityData(tileEntity: TileEntity): FurnaceTileEntityData
    export function setTileEntityData(tileEntity: TileEntity, data: FurnaceTileEntityData, noUpdate?: boolean): void
    export function resolveName(name: string): Array<string>;
    export function unionObject<T = object, T2 = object>(target: T, obj: T2): T & T2;
}
