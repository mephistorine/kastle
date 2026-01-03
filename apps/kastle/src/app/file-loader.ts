import {Injectable} from "@angular/core";
import {injectSupabaseClient} from "./supabase";
import {injectIndexedDbOrThrow} from "./local-db";

@Injectable({providedIn: "root"})
export class FileLoaderService {
    private readonly supabaseClient = injectSupabaseClient();
    private readonly cache = injectIndexedDbOrThrow();

    async loadFileByPath(filePath: string) {
        const fileRecord = await this.cache.get("files", filePath);

        if (fileRecord) {
            return URL.createObjectURL(fileRecord.content);
        }

        const user = await this.supabaseClient.auth
            .getSession()
            .then(({data}) => data.session?.user ?? null);

        if (!user) {
            throw new Error("User is not authenticated");
        }

        const {data, error} = await this.supabaseClient.storage
            .from("entries_attachments")
            .download(`/${user!.id}/${filePath}`);

        if (error) {
            throw error;
        }

        await this.cache.add("files", {
            path: filePath,
            content: data,
        });

        return URL.createObjectURL(data);
    }
}
