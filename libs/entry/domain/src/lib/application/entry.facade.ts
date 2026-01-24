import {inject, Injectable} from "@angular/core";
import {rxState} from "@rx-angular/state";
import {Entry} from "../entities/entry";
import {
    EntriesDataAccessService
} from "../infrastructure/entries-data-access.service";

type EntryFacadeState = {
    isLoading: boolean
    error: any
    entries: Entry[]
}

@Injectable({
    providedIn: "root",
})
export class EntryFacade {
    private readonly entriesDataAccessService = inject(EntriesDataAccessService);
    private readonly state = rxState<EntryFacadeState>(({set}) => {
        set({
            isLoading: false,
            error: null,
            entries: [],
        });
    });

    readonly isLoading = this.state.signal("isLoading");
    readonly entries = this.state.signal("entries");

    async loadEntries() {
        this.state.set({isLoading: true});

        try {
            const result = await this.entriesDataAccessService.getAllEntries();
            this.state.set({entries: result});
        } catch (error: unknown) {
            this.state.set({error: error});
        } finally {
            this.state.set({isLoading: false});
        }
    }
}
