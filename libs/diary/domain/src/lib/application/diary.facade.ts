import {inject, Injectable, resource, signal} from "@angular/core";
import {PocketbaseClient} from "@kstl/shared/domain";
import {rxState} from "@rx-angular/state";

@Injectable({
    providedIn: "root",
})
export class DiaryFacade {
    private readonly pocketbaseClient = inject(PocketbaseClient);
    private readonly state = rxState(() => {});
    private readonly diariesResourceParams = signal<any>(undefined);

    readonly diariesResource = resource({
        params: () => this.diariesResourceParams(),
        loader: async () => {
            const result = await this.pocketbaseClient.collection("diaries").getFullList();
            return result
        },
        defaultValue: undefined
    })
}
