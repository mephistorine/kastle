import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class RouterPathBuilder {
    diaryEntries(diaryId: number) {
        return `/diaries/${diaryId.toString()}/entries`;
    }

    addEntry(diaryId: number) {
        return `${this.diaryEntries(diaryId)}/add`;
    }

    entryPage(diaryId: number, entryId: number) {
        return `${this.diaryEntries(diaryId)}/${entryId}`;
    }

    editEntry(diaryId: number, entryId: number) {
        return `${this.diaryEntries(diaryId)}/${entryId}/edit`;
    }
}
