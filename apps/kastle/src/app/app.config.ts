import {provideEventPlugins} from "@taiga-ui/event-plugins";
import {
    ApplicationConfig, provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {appRoutes} from "./app.routes";
import {type IDBPDatabase, openDB} from "idb";
import {injectSupabaseClient} from "./supabase";
import {injectIndexedDBContainer} from "./local-db";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideEventPlugins(),
        provideAppInitializer(async () => {
            const container = injectIndexedDBContainer();

            const db = await openDB("kastle", 1, {
                upgrade: (db) => {
                    const filesObjectStorage = db.createObjectStore("files", {
                        keyPath: "path",
                    });

                    filesObjectStorage.createIndex("path", "path", {
                        unique: true
                    })
                },
            })

            container.set(db as any);

            return db;
        })
    ],
};
