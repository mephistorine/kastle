import {createClient, type SupabaseClient} from "@supabase/supabase-js";
import {inject, Injectable} from "@angular/core";
import {WA_LOCAL_STORAGE} from "@ng-web-apis/common";

const KSTL_PROJECT_URL_KEY_NAME = "kstl__projectUrl";
const KSTL_API_KEY_KEY_NAME = "kstl__apiKey";

@Injectable({
    providedIn: "root",
})
export class SupabaseFactory {
    private localStorage = inject(WA_LOCAL_STORAGE);
    private client: SupabaseClient | null = null;

    get isSupabaseConfigured() {
        return this.client !== null;
    }

    constructor() {
        const projectUrl = this.localStorage.getItem(KSTL_PROJECT_URL_KEY_NAME);
        const apiKey = this.localStorage.getItem(KSTL_API_KEY_KEY_NAME);

        if (projectUrl && apiKey) {
            this.makeClient(projectUrl, apiKey);
        }
    }

    getClientOrThrow(): SupabaseClient {
        if (this.client) {
            return this.client;
        }

        throw new Error("SupabaseClient is not ready");
    }

    createClient(projectUrl: string, apiKey: string) {
        this.makeClient(projectUrl, apiKey);
        this.localStorage.setItem(KSTL_PROJECT_URL_KEY_NAME, projectUrl);
        this.localStorage.setItem(KSTL_API_KEY_KEY_NAME, apiKey);
    }

    private makeClient(projectUrl: string, apiKey: string) {
        this.client = createClient(projectUrl, apiKey);
    }
}

export function injectSupabaseClient(): SupabaseClient {
    const supabaseFactory = inject(SupabaseFactory);
    return supabaseFactory.getClientOrThrow();
}
