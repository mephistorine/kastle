export type Entry = {
    readonly id: string;
    readonly created: string;
    readonly updated: string;
    readonly title: string;
    readonly content: string;
    readonly diaryId: string;
    readonly userId: string;
    readonly files: string[];
};
