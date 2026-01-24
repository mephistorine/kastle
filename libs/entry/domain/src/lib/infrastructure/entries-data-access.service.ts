import {inject, Injectable} from "@angular/core";
import {PocketbaseClient} from "@kstl/shared/domain";

type EntryGetDto = {
    readonly id: string;
    readonly created: string;
    readonly updated: string;
    readonly title: string;
    readonly content: string;
    readonly diaryId: string;
    readonly userId: string;
    readonly files: string[];
};

@Injectable({
    providedIn: "root",
})
export class EntriesDataAccessService {
    private static fields = [
        "id",
        "title",
        "content",
        "diaryId",
        "userId",
        "files",
        "created",
        "updated",
    ].join(",");

    private readonly pocketbaseClient = inject(PocketbaseClient);

    getAllEntries() {
        return this.pocketbaseClient.collection("entries").getFullList<EntryGetDto>({
            fields: EntriesDataAccessService.fields,
        });
    }
}
