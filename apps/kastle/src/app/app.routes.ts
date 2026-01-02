import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Route, Router} from "@angular/router";
import {EntriesByDiaryPage} from "./pages/home/entries-by-diary/entries-by-diary-page";
import {EntryPage} from "./pages/home/entry-page/entry-page";
import {HomeEmptyPage} from "./pages/home/home-empty-page/home-empty-page";
import {HomePage} from "./pages/home/home-page";
import {LoginPage} from "./pages/login/login-page";
import {RegisterPage} from "./pages/register/register-page";
import {SetUp} from "./pages/set-up/set-up";
import {injectSupabaseClient, SupabaseFactory} from "./supabase";
import {UpsertDiaryEntryPageComponent} from "./pages/upsert-diary-entry/upsert-diary-entry-page.component";

const appMustBeConfigured = () => {
    const supabaseFactory = inject(SupabaseFactory);
    const router = inject(Router);
    if (supabaseFactory.isSupabaseConfigured) {
        return true;
    }
    return router.parseUrl("/set-up");
};

const isUserAuthed = async () => {
    const supabaseClient = injectSupabaseClient();
    const {data, error} = await supabaseClient.auth.getSession();

    if (error) {
        return false;
    }

    return data.session !== null;
};

const userMustBeUnlogged = async () => {
    const router = inject(Router);
    const isAuthed = await isUserAuthed();

    if (isAuthed) {
        return router.parseUrl("/");
    }

    return true;
};

const userMustBeLogged = async () => {
    const router = inject(Router);
    const isAuthed = await isUserAuthed();

    if (isAuthed) {
        return true;
    }

    return router.parseUrl("/login");
};

export const appRoutes: Route[] = [
    {
        path: "diaries",
        component: HomePage,
        canActivate: [appMustBeConfigured, userMustBeLogged],
        title: "Home",
        children: [
            {
                path: "",
                component: HomeEmptyPage,
            },
            // TODO: add virtual all entries diary
            /*{
                path: "all"
            },*/
            {
                path: ":diaryId/entries",
                component: EntriesByDiaryPage,
            },
            {
                path: ":diaryId",
                redirectTo: ":diaryId/entries",
            },
            {
                path: ":diaryId/entries/add",
                component: UpsertDiaryEntryPageComponent,
                data: {
                    entry: () => null,
                    entryAttachmentIds: () => null,
                },
            },
            {
                path: ":diaryId/entries/:entryId",
                component: EntryPage,
                resolve: {
                    entry: async (route: ActivatedRouteSnapshot) => {
                        const {diaryId, entryId} = route.params;
                        const supabaseClient = injectSupabaseClient();
                        const session = await supabaseClient.auth
                            .getSession()
                            .then((s) => s.data.session);

                        return supabaseClient
                            .from("entries")
                            .select()
                            .eq("id", entryId)
                            .eq("diary_id", diaryId)
                            .eq("user_id", session!.user.id)
                            .single()
                            .then((s) => s.data);
                    },
                },
            },
            {
                path: ":diaryId/entries/:entryId/edit",
                component: UpsertDiaryEntryPageComponent,
                resolve: {
                    entry: async (route: ActivatedRouteSnapshot) => {
                        const {diaryId, entryId} = route.params;
                        const supabaseClient = injectSupabaseClient();
                        return supabaseClient
                            .from("entries")
                            .select()
                            .eq("id", entryId)
                            .eq("diary_id", diaryId)
                            .single()
                            .then(({data}) => data);
                    },
                    entryAttachmentPaths: async (route: ActivatedRouteSnapshot) => {
                        const {entryId} = route.params;
                        const supabaseClient = injectSupabaseClient();
                        return supabaseClient
                            .from("entry_attachments")
                            .select("attachment_path")
                            .eq("entry_id", entryId)
                            .then((s) => s.data?.map((e) => e.attachment_path) ?? null);
                    },
                },
            },
        ],
    },
    {
        path: "login",
        component: LoginPage,
        canActivate: [appMustBeConfigured, userMustBeUnlogged],
        title: "Login",
    },
    {
        path: "register",
        component: RegisterPage,
        canActivate: [appMustBeConfigured, userMustBeUnlogged],
        title: "Registration",
    },
    {
        path: "set-up",
        component: SetUp,
        canActivate: [],
        title: "Set Up app",
    },
    {
        path: "**",
        redirectTo: "diaries",
    },
];
