export interface IUpdateOptions {
    safe?: boolean
}

export interface IUpdatePackage {
    name: string;
    currentRange: string;
    updatedVersion: string;
}