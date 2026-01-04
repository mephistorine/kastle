import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    linkedSignal,
    OnInit,
} from "@angular/core";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {TiptapEditorDirective} from "ngx-tiptap";
import {TuiInputInline, TuiSkeleton} from "@taiga-ui/kit";
import {Router, RouterLink} from "@angular/router";
import {TuiButton, TuiDialogService, TuiLink} from "@taiga-ui/core";
import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extensions";
import {injectSupabaseClient} from "../../supabase";
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {
    combineLatest,
    debounceTime,
    defer,
    distinctUntilChanged,
    from,
    map,
    mergeMap,
    startWith,
    switchMap,
    take,
} from "rxjs";
import {Tables} from "../../../database.types";
import {nanoid} from "nanoid";
import {IMAGE_ATTACH_DIALOG_COMPONENT_POLYMORPHEUS} from "../../components/image-attach-dialog.component";
import {injectIndexedDbOrThrow} from "../../local-db";
import {FileLoaderService} from "../../file-loader";
import {isEqual} from "es-toolkit";

@Component({
    selector: "app-upsert-diary-entry",
    imports: [
        ReactiveFormsModule,
        TiptapEditorDirective,
        TuiInputInline,
        RouterLink,
        TuiLink,
        TuiButton,
        TuiSkeleton,
    ],
    templateUrl: "./upsert-diary-entry-page.component.html",
    styleUrl: "./upsert-diary-entry-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDiaryEntryPageComponent implements OnInit {
    private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);
    private readonly supabaseClient = injectSupabaseClient();
    private readonly destroyRef = inject(DestroyRef);
    private readonly tuiDialogService = inject(TuiDialogService);
    private readonly cache = injectIndexedDbOrThrow();
    private readonly fileLoader = inject(FileLoaderService);
    private readonly router = inject(Router);

    readonly diaryId = input.required<number>();
    readonly entry = input.required<Tables<"entries"> | null>();
    readonly entryAttachmentPathsData = input.required<string[]>({
        alias: "entryAttachmentPaths",
    });
    private readonly diaryEntriesTable = this.supabaseClient.from("entries");
    private readonly diaryEntryAttachmentsTable =
        this.supabaseClient.from("entry_attachments");
    readonly entryId = linkedSignal(() => this.entry()?.id ?? null);
    readonly entryAttachmentPaths = linkedSignal(() => this.entryAttachmentPathsData());

    readonly backUrl = computed(() => `/diaries/${this.diaryId()}/entries`);

    readonly attachments = toSignal(
        defer(() =>
            toObservable(this.entryAttachmentPaths).pipe(
                switchMap((paths) =>
                    combineLatest(
                        paths.map((path) =>
                            from(this.fileLoader.loadFileByPath(path)).pipe(
                                startWith({isLoading: true, url: ""}),
                                map((url) => ({isLoading: false, url})),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );

    readonly form = this.nonNullableFormBuilder.group({
        title: "",
        content: {type: "doc", content: []},
    });

    readonly editor = new Editor({
        extensions: [
            StarterKit.configure({
                dropcursor: false,
            }),
            Placeholder.configure({
                placeholder: "Start writing…",
            }),
        ],
    });

    constructor() {}

    ngOnInit(): void {
        const startData = this.entry();
        if (startData) {
            this.form.patchValue({
                title: startData.title,
                content: JSON.parse(startData.content),
            });
        }

        this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(isEqual),
                switchMap(() => this.saveEntry()),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    async saveEntry() {
        if (this.form.invalid) {
            return;
        }

        if (this.entryId() === null) {
            await this.createEntry();
        }

        const formVal = this.form.getRawValue();

        const {error} = await this.diaryEntriesTable
            .update({
                title: formVal.title,
                content: JSON.stringify(formVal.content)
            })
            .eq("id", this.entryId()!);

        if (error) {
            throw error;
        }
    }

    async saveEntryAndGoBack() {
        await this.saveEntry();
        await this.router.navigateByUrl(this.backUrl());
    }

    async attachImages() {
        if (this.entryId() === null) {
            await this.createEntry();
        }

        this.tuiDialogService
            .open<File[]>(IMAGE_ATTACH_DIALOG_COMPONENT_POLYMORPHEUS)
            .pipe(
                take(1),
                mergeMap((files) => {
                    return files.map(async (file) => {
                        const filePath = await this.uploadImage(file);
                        this.entryAttachmentPaths.update((prev) => prev.concat(filePath));
                        return this.diaryEntryAttachmentsTable.insert({
                            entry_id: this.entryId()!,
                            attachment_path: filePath,
                        });
                    });
                }, 10),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private async createEntry() {
        if (this.form.invalid) {
            throw new Error("Form is invalid");
        }

        const formVal = this.form.getRawValue();

        const {data: entry, error} = await this.diaryEntriesTable
            .insert({
                title: formVal.title,
                content: JSON.stringify(formVal.content),
                diary_id: this.diaryId()!,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        this.entryId.set(entry.id);
    }

    private async uploadImage(file: File) {
        const user = await this.supabaseClient.auth
            .getSession()
            .then(({data}) => data.session?.user ?? null);

        if (!user) {
            return Promise.reject(new Error("User is not authenticated"));
        }

        const id = nanoid(10);
        const [, extension] = file.name.split(".");
        const filePath = `${id}.${extension}`;

        const tx = this.cache.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        try {
            await Promise.all([
                store.add({
                    path: filePath,
                    content: file,
                }),
                this.supabaseClient.storage
                    .from("entries_attachments")
                    .upload(`${user.id}/${filePath}`, file),
            ]);
        } catch (e) {
            tx.abort();
        }

        return filePath;
    }
}
