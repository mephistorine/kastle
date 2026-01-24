import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Route} from "@angular/router";
import {FeatureLoginPageComponent} from "@kstl/auth/feature-login-page";
import {FeatureRegisterPageComponent} from "@kstl/auth/feature-register-page";
import {FeatureEntryListPageComponent} from "@kstl/entry/feature-entry-list-page";
import {FeatureEntryUpsertComponent} from "@kstl/entry/feature-entry-upsert";
import {FeatureSingleEntryPageComponent} from "@kstl/entry/feature-single-entry-page";
import {PocketbaseClient} from "@kstl/shared/domain";
import {HomeEmptyPage} from "./pages/home/home-empty-page/home-empty-page";
import {HomePageComponent} from "./pages/home/home-page.component";

const isUserAuthed = async () => {
    const pocketbaseClient = inject(PocketbaseClient);
    return pocketbaseClient.authStore.isValid;
};

export const appRoutes: Route[] = [
    {
        path: "diaries",
        component: HomePageComponent,
        // TODO: Add guards
        // canActivate: [isUserAuthed],
        title: "Home",
        children: [
            {
                path: "",
                component: HomeEmptyPage,
            },
            // TODO: add virtual diary for all entries
            /*{
                path: "all"
            },*/
            {
                path: ":diaryId/entries",
                component: FeatureEntryListPageComponent,
                resolve: {
                    diary: async (route: ActivatedRouteSnapshot) => {
                        const pocketbaseClient = inject(PocketbaseClient);
                        const {diaryId} = route.params;
                        return pocketbaseClient.collection("diaries").getOne(diaryId);
                    }
                },
            },
            {
                path: ":diaryId",
                redirectTo: ":diaryId/entries",
            },
            {
                path: ":diaryId/entries/add",
                component: FeatureEntryUpsertComponent,
                resolve: {
                    entry: () => null,
                    entryAttachmentPaths: () => [],
                },
            },
            {
                path: ":diaryId/entries/:entryId",
                component: FeatureSingleEntryPageComponent,
                resolve: {
                    entry: async (route: ActivatedRouteSnapshot) => {
                        const pocketbaseClient = inject(PocketbaseClient);
                        const {entryId} = route.params;

                        return pocketbaseClient.collection("entries").getOne(entryId, {
                            expand: "files",
                        });
                    },
                },
            },
            {
                path: ":diaryId/entries/:entryId/edit",
                component: FeatureEntryUpsertComponent,
                resolve: {
                    entry: async (route: ActivatedRouteSnapshot) => {
                        const pocketbaseClient = inject(PocketbaseClient);
                        const {entryId} = route.params;

                        return pocketbaseClient.collection("entries").getOne(entryId, {
                            expand: "files",
                        });
                    },
                },
            },
        ],
    },
    {
        path: "login",
        component: FeatureLoginPageComponent,
        // canActivate: [appMustBeConfigured, userMustBeUnlogged],
        title: "Login",
    },
    {
        path: "register",
        component: FeatureRegisterPageComponent,
        // canActivate: [appMustBeConfigured, userMustBeUnlogged],
        title: "Registration",
    },
    {
        path: "**",
        redirectTo: "diaries",
    },
];
