import {CanActivateFn, Route, Router} from "@angular/router";
import {LoginPage} from "./pages/login/login-page";
import {RegisterPage} from "./pages/register/register-page";
import {SetUp} from "./pages/set-up/set-up";
import {HomePage} from "./pages/home/home-page";
import {injectSupabaseClient, SupabaseFactory} from "./supabase";
import {inject} from "@angular/core";

const appMustBeConfigured = () => {
    const supabaseFactory = inject(SupabaseFactory);
    const router = inject(Router)
    if (supabaseFactory.isSupabaseConfigured) {
        return true
    }
    return router.parseUrl("/set-up")
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
        return router.parseUrl("/")
    }

    return true
}

const userMustBeLogged = async () => {
    const router = inject(Router);
    const isAuthed = await isUserAuthed();

    if (isAuthed) {
        return true
    }

    return router.parseUrl("/login")
}

export const appRoutes: Route[] = [
    {
        path: "",
        component: HomePage,
        canActivate: [appMustBeConfigured, userMustBeLogged],
        title: "Home"
    },
    {
        path: "login",
        component: LoginPage,
        canActivate: [appMustBeConfigured, userMustBeUnlogged],
        title: "Login"
    },
    {
        path: "register",
        component: RegisterPage,
        canActivate: [appMustBeConfigured, userMustBeUnlogged],
        title: "Registration"
    },
    {
        path: "set-up",
        component: SetUp,
        canActivate: [

        ],
        title: "Set Up app"
    },
    {
        path: "**",
        redirectTo: ""
    }
];
