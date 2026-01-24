import {inject, Injectable} from "@angular/core";
import {PocketbaseClient} from "@kstl/shared/domain";
import type {CreateDiaryDto, UpdateDiaryDto} from "../infrastructure/diary.dto";

@Injectable({
    providedIn: "root",
})
export class DiaryFacade {
    // TODO: Move all pocketbase requests to independet data-access service
    private readonly pocketbaseClient = inject(PocketbaseClient);
    private readonly diaryCollection = this.pocketbaseClient.collection("diaries");

    create(createDiaryDto: CreateDiaryDto) {
        return this.diaryCollection.create(createDiaryDto);
    }

    update(updateDiaryDto: UpdateDiaryDto) {
        const {id, ...restPart} = updateDiaryDto
        return this.diaryCollection.update(id, restPart);
    }

    getAll() {
        return this.diaryCollection.getFullList();
    }
}
