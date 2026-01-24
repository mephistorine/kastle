export type CreateDiaryDto = {
    readonly name: string;
    readonly accentColor: string;
    readonly icon: {
        readonly type: "preset"
        readonly name: string
    };
};

export type UpdateDiaryDto = {
    readonly id: string
    readonly name: string;
    readonly accentColor: string;
    readonly icon: {
        readonly type: "preset";
        readonly name: string;
    };
};
