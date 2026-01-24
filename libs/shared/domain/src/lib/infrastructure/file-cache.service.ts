import {inject, Injectable} from "@angular/core";
import {IndexedDbService} from "@kstl/shared/domain";

type FileRow = {
    readonly id: string;
    readonly file: Blob;
};

@Injectable({providedIn: "root"})
export class FileCacheService {
    private readonly indexedDbService = inject(IndexedDbService);

    async cacheFile(id: string, blob: Blob) {
        await this.indexedDbService.put<FileRow>("files", {
            id: id,
            file: blob,
        });
    }

    async getFile(id: string): Promise<Blob | null> {
        return this.indexedDbService.get<FileRow>("files", id).then((r) => r?.file ?? null);
    }
}
