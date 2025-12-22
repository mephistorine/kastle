import {ChangeDetectionStrategy, Component, inject, OnInit, resource} from "@angular/core";
import {injectSupabaseClient} from "../../supabase";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {TuiAsideComponent, TuiNavigation} from "@taiga-ui/layout";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
    selector: "app-home-page",
    imports: [
        ReactiveFormsModule,
        TuiAsideComponent,
        TuiNavigation,
        RouterOutlet,
        RouterLink,
    ],
    templateUrl: "./home-page.html",
    styleUrl: "./home-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly supabaseClient = injectSupabaseClient();

    readonly diaries = resource<any[], void>({
        loader: () =>
            this.supabaseClient
                .from("diaries")
                .select()
                .then(({data}) => data as any[]),
        defaultValue: [],
    });

    selectedDiary = this.fb.control("");

    ngOnInit(): void {}
}
