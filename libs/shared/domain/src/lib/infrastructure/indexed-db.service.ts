import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class IndexedDbService {
    private dbName = "kastle-db";
    private dbVersion = 1;
    private db!: IDBDatabase;

    private readyResolve!: () => void;
    public readonly ready: Promise<void> = new Promise<void>(
        (res) => (this.readyResolve = res),
    );

    private initPromise?: Promise<void>;

    // TODO: Add migrations and detailed store creation
    async initOnce(storeNames: string[]): Promise<void> {
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event: any) => {
                const db: IDBDatabase = event.target.result;

                for (const storeName of storeNames) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, {keyPath: "id"});
                    }
                }
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.readyResolve();
                resolve();
            };

            request.onerror = () => reject(request.error);
        });

        return this.initPromise;
    }

    private getStore(storeName: string, mode: IDBTransactionMode) {
        const tx = this.db.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    // Если хочешь прям "железобетон", можно в каждом методе делать: await this.ready

    async put<T>(storeName: string, item: T): Promise<void> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, "readwrite");
            const req = store.put(item);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async get<T>(storeName: string, id: any): Promise<T | null> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, "readonly");
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result ?? null);
            req.onerror = () => reject(req.error);
        });
    }

    async getAll<T>(storeName: string): Promise<T[]> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, "readonly");
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async delete(storeName: string, id: any): Promise<void> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, "readwrite");
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async clearStore(storeName: string): Promise<void> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, "readwrite");
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }
}
