import {ChangeDetectionStrategy, Component, computed, inject, OnDestroy} from "@angular/core";
import {TuiSubheaderCompactComponent} from "@taiga-ui/layout";
import {TuiAppearance, TuiButton, TuiLink} from "@taiga-ui/core";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {injectSupabaseClient} from "../../supabase";
import {injectParams} from "ngxtension/inject-params";
import {Router, RouterLink} from "@angular/router";
import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {TiptapEditorDirective} from "ngx-tiptap";
import {Placeholder} from "@tiptap/extensions";
import {TuiFiles, TuiInputInline} from "@taiga-ui/kit";

@Component({
    selector: "app-upsert-diary-entry",
    imports: [
        TuiButton,
        TuiSubheaderCompactComponent,
        ReactiveFormsModule,
        TiptapEditorDirective,
        TuiInputInline,
        RouterLink,
        TuiLink,
        TuiFiles,
        TuiAppearance,
    ],
    templateUrl: "./upsert-diary-entry-page.component.html",
    styleUrl: "./upsert-diary-entry-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDiaryEntryPage implements OnDestroy {
    private readonly sbClient = injectSupabaseClient();
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);

    private readonly diaryId = injectParams("diaryId");

    readonly backUrl = computed(() => `/diaries/${this.diaryId()}`);

    editor = new Editor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start writing…",
            }),
        ],
    });

    readonly files = this.fb.control(null);

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
                    user_id: userId!,
                })
                .then(({error}) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    return this.router.navigateByUrl(this.backUrl());
                });
        });
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }
}
