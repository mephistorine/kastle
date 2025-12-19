import {CanActivateFn, Route, Router} from "@angular/router";
import {LoginPage} from "./pages/login/login-page";
import {RegisterPage} from "./pages/register/register-page";
import {SetUp} from "./pages/set-up/set-up";
import {HomePage} from "./pages/home/home-page";
import {injectSupabaseClient, SupabaseFactory} from "./supabase";
import {inject} from "@angular/core";

const isAppReadyGuard = () => {
    const supabaseFactory = inject(SupabaseFactory);
    return supabaseFactory.isSupabaseConfigured;
};

const isUserAuthedGuard = async () => {
    const supabaseClient = injectSupabaseClient();
    const {data, error} = await supabaseClient.auth.getSession();

    if (error) {
        return false;
    }

    return data.session !== null;
};

const redirectOfAuthStatusGuard: CanActivateFn = async () => {
    const router = inject(Router);
    const isAuthed = await isUserAuthedGuard();

    if (isAuthed) {
        return router.parseUrl("/");
    }

    return router.parseUrl("/login");
};

export const appRoutes: Route[] = [
    {
        path: "login",
        component: LoginPage,
        canActivate: [isAppReadyGuard, redirectOfAuthStatusGuard],
    },
    {
        path: "register",
        component: RegisterPage,
        canActivate: [isAppReadyGuard, redirectOfAuthStatusGuard],
    },
    {
        path: "set-up",
        component: SetUp,
        canActivate: [
            () => {
                const router = inject(Router);
                const isAppSettedUp = isAppReadyGuard();

                if (isAppSettedUp) {
                    return router.parseUrl("/login");
                }

                return true;
            },
        ],
    },
    {
        path: "",
        component: HomePage,
        canActivate: [isAppReadyGuard, redirectOfAuthStatusGuard],
    },
];
