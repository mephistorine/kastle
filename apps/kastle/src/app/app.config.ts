import {
    ApplicationConfig,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {providePocketbaseClient} from "@kstl/shared/domain";
import {provideEventPlugins} from "@taiga-ui/event-plugins";
import {openDB} from "idb";
import {appRoutes} from "./app.routes";
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
                        unique: true,
                    });
                },
            });

            container.set(db as any);

            return db;
        }),
        providePocketbaseClient(import.meta.env.POCKETBASE_URL),
    ],
};
