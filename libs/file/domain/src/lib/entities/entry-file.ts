export type EntryFile = {
    readonly id: string;
    readonly created: Date;
    readonly updated: Date;
    // NOTE: File name with extention
    // TODO: When encryption is added, there will be no extention
    readonly file: string;
};
