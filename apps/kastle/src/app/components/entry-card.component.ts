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
                <div class="entry-card-attachment-container" [attr.data-count]="attachmentsCount()">
                    @for (attachment of attachments(); track $index) {
                        @if (attachment.isLoading) {
                            <div
                                class="entry-card-attachment"
                                [tuiSkeleton]="true"
                            ></div>
                        } @else {
                            <div class="entry-card-attachment"
                                 [class.show-more]="$last && attachmentsCount() === 'more'">
                                <img
                                    [attr.src]="attachment.url"
                                />

                                <!--@if ($last && attachmentsCount() === "more") {
                                    <span class="extra-attachment-count">+{{ extraAttachmentsCount() }}</span>
                                }-->
                            </div>
                        }
                    }
                </div>
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
                <time [attr.datetime]="createDate()">{{ createDateFormatted() }}</time>

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
        article {
            container-type: inline-size;
        }

        .entry-title {
            margin: 0;
            margin-block-end: 1rem;
        }

        .entry-card-attachment-container {
            block-size: 50cqi;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 25cqi;
            gap: 0.5rem;
        }

        .entry-card-attachment img {
            block-size: 100%;
            inline-size: 100%;
            object-fit: cover;
        }

        .entry-card-attachment-container[data-count="more"],
        .entry-card-attachment-container[data-count="5"] {
            --e-1st-child-column: 1 / span 2;
            --e-1st-child-row: 1 / span 2;
        }

        .entry-card-attachment-container[data-count="4"] {
            --e-1st-child-column: 1 / span 2;
            --e-1st-child-row: 1 / span 2;

            --e-2nd-child-column: 3 / span 2;
            --e-2nd-child-row: 1 / 2;
        }

        .entry-card-attachment-container[data-count="3"] {
            --e-1st-child-column: 1 / span 2;
            --e-1st-child-row: 1 / span 2;

            --e-2nd-child-column: 3 / span 2;
            --e-2nd-child-row: 1 / 2;

            --e-3rd-child-column: 3 / span 2;
            --e-3rd-child-row: 2 / 3;
        }

        .entry-card-attachment-container[data-count="2"] {
            --e-1st-child-column: 1 / span 2;
            --e-1st-child-row: 1 / span 2;

            --e-2nd-child-column: 3 / span 2;
            --e-2nd-child-row: 1 / spam 2;
        }

        .entry-card-attachment-container[data-count="1"] {
            --e-1st-child-column: 1 / span 4;
            --e-1st-child-row: 1 / span 2;
        }

        .entry-card-attachment:nth-child(1) {
            grid-column: var(--e-1st-child-column);
            grid-row: var(--e-1st-child-row);
        }

        .entry-card-attachment:nth-child(2) {
            grid-column: var(--e-2nd-child-column);
            grid-row: var(--e-2nd-child-row);
        }

        .entry-card-attachment:nth-child(3) {
            grid-column: var(--e-3rd-child-column);
            grid-row: var(--e-3rd-child-row);
        }

        .entry-card-attachment:nth-child(4) {
            grid-column: var(--e-4th-child-column);
            grid-row: var(--e-4th-child-row);
        }

        .entry-card-attachment:nth-child(5) {
            grid-column: var(--e-5th-child-column);
            grid-row: var(--e-5th-child-row);
        }

        /*.entry-card-attachment-container:has(:nth-child(4)) .entry-card-attachment:nth-child(2) {
            grid-column: span 2;
        }*/

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

        .entry-card-attachment.show-more {
            position: relative;
        }

        .extra-attachment-count {
            inline-size: 25%;
            block-size: 25%;
            position: absolute;
            inset-inline-end: 0;
            inset-block-end: 0;
            background: #11111173;
            color: var(--tui-text-secondary);
            font: var(--tui-font-heading-5);
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0.5rem;
            user-select: none;
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
            // Show only first 5 photos
            map((entry) => entry.attachmentPaths.slice(0, 5)),
            switchMap((attachmentPaths) =>
                combineLatest(
                    attachmentPaths.map((path) =>
                        from(this.fileLoader.loadFileByPath(path)).pipe(
                            map((url) => {
                                /*const img = new Image();
                                img.onload = () => {
                                    console.log(url, {
                                        width: img.naturalWidth,
                                        height: img.naturalHeight,
                                        ratio: img.naturalWidth / img.naturalHeight
                                    })
                                };
                                img.src = url;*/
                                return {isLoading: false, url};
                            }),
                            startWith({isLoading: true, url: ""}),
                        ),
                    ),
                ),
            ),
        ),
    );

    readonly attachmentsCount = computed(() => this.entry().attachmentPaths.length > 5 ? "more" : this.entry().attachmentPaths.length.toString())

    readonly extraAttachmentsCount = computed(() => this.entry().attachmentPaths.length - 5)

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

    markAsDeleted() {}
}
