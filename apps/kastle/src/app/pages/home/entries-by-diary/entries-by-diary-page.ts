import {ChangeDetectionStrategy, Component, input, resource} from "@angular/core";
import {TuiCard, TuiHeader, TuiNavigation} from "@taiga-ui/layout";
import {TuiAppearance, TuiButton, TuiLink, TuiTextfield, TuiTitle} from "@taiga-ui/core";
import {RouterLink} from "@angular/router";
import {injectSupabaseClient} from "../../../supabase";
import {TuiLineClamp, tuiLineClampOptionsProvider} from "@taiga-ui/kit";
import {DatePipe} from "@angular/common";

@Component({
    selector: "app-entries-by-diary-page",
    imports: [
        TuiNavigation,
        TuiButton,
        RouterLink,
        TuiCard,
        TuiAppearance,
        TuiHeader,
        TuiTitle,
        TuiLineClamp,
        TuiLink,
        DatePipe,
        TuiTextfield,
    ],
    templateUrl: "./entries-by-diary-page.html",
    styleUrl: "./entries-by-diary-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiLineClampOptionsProvider({
            showHint: false,
        }),
    ],
})
export class EntriesByDiaryPage {
    private readonly supabaseClient = injectSupabaseClient();

    readonly diaryId = input.required<number>();

    readonly entries = resource({
        params: () => ({diaryId: this.diaryId()}),
        loader: async ({params}) => {
            const session = await this.supabaseClient.auth
                .getSession()
                .then(({data}) => data.session);

            const {data} = await this.supabaseClient
                .from("entries")
                .select()
                .eq("diary_id", params.diaryId)
                .eq("user_id", session!.user.id);
            return data;
        },
        defaultValue: [],
    });
}
