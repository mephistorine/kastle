import {
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    linkedSignal,
    OnInit,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UiAttachImageDialogComponent} from "@kstl/entry/ui-attach-image-dialog";
import {FileCacheService, PocketbaseClient} from "@kstl/shared/domain";
import {injectUniqStringGenerator} from "@kstl/shared/util-uniq-string";
import {TuiButton, TuiDialogService, TuiGroup, TuiLink} from "@taiga-ui/core";
import {TuiInputInline} from "@taiga-ui/kit";
import {PolymorpheusComponent} from "@taiga-ui/polymorpheus";
import {Editor} from "@tiptap/core";
import {Placeholder} from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import {isEqual} from "es-toolkit";
import {TiptapEditorDirective} from "ngx-tiptap";
import {debounceTime, distinctUntilChanged, mergeMap, switchMap, take} from "rxjs";

@Component({
    selector: "lib-entry-feature-entry-upsert",
    imports: [
        FormsModule,
        TiptapEditorDirective,
        TuiButton,
        TuiGroup,
        TuiInputInline,
        TuiLink,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: "./feature-entry-upsert.component.html",
    styleUrl: "./feature-entry-upsert.component.css",
})
export class FeatureEntryUpsertComponent implements OnInit {
    private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);
    private readonly pocketbaseClient = inject(PocketbaseClient);
    private readonly destroyRef = inject(DestroyRef);
    private readonly tuiDialogService = inject(TuiDialogService);
    private readonly router = inject(Router);
    private readonly fileCacheService = inject(FileCacheService);
    private readonly generateUniqString = injectUniqStringGenerator();
    private readonly entryCollection = this.pocketbaseClient.collection("entries");

    readonly diaryId = input.required<number>();
    readonly entry = input.required<any>();
    readonly entryId = linkedSignal(() => this.entry()?.id ?? null);
    readonly backUrl = computed(() => `/diaries/${this.diaryId()}/entries`);
    readonly fileIds = linkedSignal(() => this.entry().files as string[]);

    // readonly files =

    /*readonly attachments = toSignal(
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
    );*/

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

        await this.entryCollection.update(this.entryId()!, {
            title: formVal.title,
            content: JSON.stringify(formVal.content),
        });
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
            .open<File[]>(new PolymorpheusComponent(UiAttachImageDialogComponent))
            .pipe(
                take(1),
                mergeMap((files) => {
                    return files.map(async (file) => {
                        const fileId = await this.uploadImage(file);
                        this.fileIds.update((v) => v.concat(fileId));
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

        const result = await this.pocketbaseClient.collection("entries").create({
            title: formVal.title,
            content: JSON.stringify(formVal.content),
            diaryId: this.diaryId()!,
        });

        this.entryId.set(result.id);
    }

    private async uploadImage(file: File) {
        const id = this.generateUniqString();

        await Promise.all([
            this.pocketbaseClient.collection("files").create({
                id,
                file,
            }),
            this.fileCacheService.cacheFile(id, file),
        ]);

        return id;
    }
}
