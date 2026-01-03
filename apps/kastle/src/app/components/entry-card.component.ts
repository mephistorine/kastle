import {Component, computed, inject, input} from "@angular/core";
import {Tables} from "../../database.types";
import {TuiCard} from "@taiga-ui/layout";
import {FileLoaderService} from "../file-loader";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {combineLatest, from, map, startWith, switchMap} from "rxjs";
import {TuiFade, TuiSkeleton} from "@taiga-ui/kit";
import {generateHTML} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {DomSanitizer} from "@angular/platform-browser";
import {RouterLink} from "@angular/router";
import {RouterPathBuilder} from "../router-path-builder.service";
import {TuiAppearance, TuiButton, TuiDataList, TuiDropdown} from "@taiga-ui/core";

@Component({
    selector: "app-entry-card",
    imports: [
        TuiCard,
        TuiSkeleton,
        TuiFade,
        RouterLink,
        TuiAppearance,
        TuiDropdown,
        TuiButton,
        TuiDataList,
    ],
    template: `
        <article
            tuiAppearance="floating"
            tuiCardLarge="compact"
        >
            @if (hasAttachments()) {
                <header>
                    <div class="entry-card-attachment-container">
                        @for (attachment of attachments(); track $index) {
                            @if (attachment.isLoading) {
                                <div
                                    class="entry-card-attachment"
                                    [tuiSkeleton]="true"
                                ></div>
                            } @else {
                                <img
                                    class="entry-card-attachment"
                                    [attr.src]="attachment.url"
                                />
                            }
                        }
                    </div>
                </header>
            }
            <a
                class="entry-link"
                [routerLink]="entryLink()"
            >
                @if (entry().title) {
                    <h4 class="entry-title">{{ entry().title }}</h4>
                }
                <div
                    class="entry-content"
                    [innerHTML]="content()"
                ></div>
            </a>

            <footer class="footer">
                <time [datetime]="createDate()">{{ createDateFormatted() }}</time>

                <button
                    appearance="flat-grayscale"
                    iconStart="ellipsis"
                    size="s"
                    tuiDropdownOpen
                    tuiIconButton
                    type="button"
                    [tuiDropdown]="menu"
                >
                    <ng-template #menu>
                        <tui-data-list>
                            <button
                                iconStart="bookmark"
                                new
                                tuiOption
                                type="button"
                                (click)="markAsBookmarked()"
                            >
                                Add Bookmark
                            </button>
                            <button
                                iconStart="trash"
                                new
                                tuiAppearance="flat-destructive"
                                tuiOption
                                type="button"
                                (click)="markAsDeleted()"
                            >
                                Delete
                            </button>
                        </tui-data-list>
                    </ng-template>
                </button>
            </footer>
        </article>
    `,
    styles: `
        .entry-title {
            margin: 0;
            margin-block-end: 1rem;
        }

        .entry-card-attachment-container {
            display: flex;
            gap: 0.5rem;
            overflow-inline: auto;
        }

        .entry-card-attachment {
            block-size: 300px;
            aspect-ratio: 1;
            object-fit: cover;
        }

        .entry-link {
            color: inherit;
            text-decoration: inherit;
        }

        .footer {
            font: var(--tui-font-text-s);
            font-weight: bold;
            color: var(--tui-text-secondary);
            box-shadow: inset 0 1px 0 0 var(--tui-border-normal);
            margin: -1rem;
            margin-block-start: 0;
            padding-inline: 1rem;
            padding-block: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `,
})
export class EntryCardComponent {
    private readonly fileLoader = inject(FileLoaderService);
    private readonly domSanitizer = inject(DomSanitizer);
    private readonly routerPathBuilder = inject(RouterPathBuilder);

    readonly entry = input.required<Tables<"entries"> & {attachmentPaths: string[]}>();

    readonly entryLink = computed(() =>
        this.routerPathBuilder.entryPage(this.entry().diary_id, this.entry().id),
    );

    readonly hasAttachments = computed(() => this.entry().attachmentPaths.length > 0);

    readonly attachments = toSignal(
        toObservable(this.entry).pipe(
            switchMap((entry) =>
                combineLatest(
                    entry.attachmentPaths.map((path) =>
                        from(this.fileLoader.loadFileByPath(path)).pipe(
                            startWith({isLoading: true, url: ""}),
                            map((url) => ({isLoading: false, url})),
                        ),
                    ),
                ),
            ),
        ),
    );

    readonly content = computed(() => {
        return this.domSanitizer.bypassSecurityTrustHtml(
            generateHTML(JSON.parse(this.entry().content), [StarterKit]),
        );
    });

    readonly createDate = computed(() => this.entry().created_at);

    readonly createDateFormatted = computed(() => {
        return new Date(this.entry().created_at).toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    });

    markAsBookmarked() {}

    markAsDeleted() {

    }
}
