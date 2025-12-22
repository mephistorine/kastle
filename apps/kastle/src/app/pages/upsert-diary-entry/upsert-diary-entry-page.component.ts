import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {TuiSubheaderCompactComponent} from "@taiga-ui/layout";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiTextarea} from "@taiga-ui/kit";
import {injectSupabaseClient} from "../../supabase";
import {injectParams} from "ngxtension/inject-params";
import {Router} from "@angular/router";

@Component({
    selector: "app-upsert-diary-entry",
    imports: [
        TuiButton,
        TuiSubheaderCompactComponent,
        TuiTextfield,
        TuiTextarea,
        ReactiveFormsModule,
    ],
    templateUrl: "./upsert-diary-entry-page.component.html",
    styleUrl: "./upsert-diary-entry-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDiaryEntryPage {
    private readonly sbClient = injectSupabaseClient();
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);

    private readonly diaryId = injectParams("diaryId");
    isExtraMenuOpened = false;

    readonly form = this.fb.group({
        title: [""],
        content: ["", Validators.required],
    });

    save() {
        if (this.form.invalid) {
            return;
        }

        const {title, content} = this.form.value;

        this.sbClient.auth.getSession().then(({data}) => {
            const userId = data.session?.user.id;
            return this.sbClient
                .from("entries")
                .insert({
                    title: title!,
                    content: content!,
                    diary_id: this.diaryId(),
                    user_id: userId!
                })
                .then(({error}) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    return this.router.navigate(["diaries", this.diaryId()]);
                });
        });
    }
}
