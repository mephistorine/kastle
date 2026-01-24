export type Diary = {
    id: string;
    name: string;
    userId: string;
    accentColor: string;
    icon: {
        readonly type: "preset";
        readonly name: string;
    };
    created: Date;
    updated: Date;
};
