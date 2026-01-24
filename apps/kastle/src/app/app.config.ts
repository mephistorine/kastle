import {
    ApplicationConfig, inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {IndexedDbService, providePocketbaseClient} from "@kstl/shared/domain";
import {provideEventPlugins} from "@taiga-ui/event-plugins";
import {appRoutes} from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideEventPlugins(),
        provideAppInitializer(async () => {
            const indexedDbService = inject(IndexedDbService);
            return indexedDbService.initOnce([
                "files"
            ])
        }),
        providePocketbaseClient(import.meta.env.POCKETBASE_URL),
    ],
};
