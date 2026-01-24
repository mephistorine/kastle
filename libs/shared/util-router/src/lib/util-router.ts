import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class RouterPathBuilder {
    diaryEntries(diaryId: string) {
        return `/diaries/${diaryId.toString()}/entries`;
    }

    allEntriesPage() {
        return `/diaries/all/entries`;
    }

    deletedEntries() {
        return `/diaries/trash/entries`;
    }

    addEntry(diaryId: string) {
        return `${this.diaryEntries(diaryId)}/add`;
    }

    entryPage(diaryId: string, entryId: string) {
        return `${this.diaryEntries(diaryId)}/${entryId}`;
    }

    editEntry(diaryId: string, entryId: string) {
        return `${this.diaryEntries(diaryId)}/${entryId}/edit`;
    }

    login() {
        return "/login";
    }

    register() {
        return "/register"
    }

    main() {
        return "/diaries";
    }
}
