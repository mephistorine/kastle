import {createInjectionToken} from "ngxtension/create-injection-token";
import type {DBSchema, IDBPDatabase} from "idb";
import {lastValueFrom, Subject} from "rxjs";

interface CacheDBSchema extends DBSchema {
    files: {
        value: {
            path: string
            content: Blob
        },
        key: string
    }
}

export const [injectIndexedDBContainer] = createInjectionToken(() => {
    let idbClient: IDBPDatabase<CacheDBSchema> | null = null;
    const isReady = new Subject<void>();
    return {
        set: (instance: IDBPDatabase<CacheDBSchema>) => {
            idbClient = instance;
            isReady.next();
            isReady.complete();
        },
        get: () => {
            return idbClient
        },
        isReady: lastValueFrom(isReady),
    };
});

export function injectIndexedDbOrThrow() {
    const client = injectIndexedDBContainer().get();

    if (!client) {
        throw new Error("IndexedDB is not connected")
    }

    return client;
}
