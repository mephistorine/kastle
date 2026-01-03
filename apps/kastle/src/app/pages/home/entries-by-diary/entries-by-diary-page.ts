import {ChangeDetectionStrategy, Component, input} from "@angular/core";
import {TuiHeader} from "@taiga-ui/layout";
import {TuiButton, TuiTitle} from "@taiga-ui/core";
import {RouterLink} from "@angular/router";
import {tuiLineClampOptionsProvider} from "@taiga-ui/kit";
import {Tables} from "../../../../database.types";
import {EntryCardComponent} from "../../../components/entry-card.component";

@Component({
    selector: "app-entries-by-diary-page",
    imports: [TuiButton, RouterLink, TuiHeader, TuiTitle, EntryCardComponent],
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
    readonly diary = input.required<Tables<"diaries">>();
    readonly entries = input.required<any[]>();
}
