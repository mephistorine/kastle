import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core";
import {TuiButton, TuiLink} from "@taiga-ui/core";
import {RouterLink} from "@angular/router";
import {Tables} from "../../../../database.types";
import {generateHTML} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {DomSanitizer} from "@angular/platform-browser";
import {RouterPathBuilder} from "../../../router-path-builder.service";
import {FileLoaderService} from "../../../file-loader";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {combineLatest, from, map, startWith, switchMap} from "rxjs";
import {TuiHeader} from "@taiga-ui/layout";
import {TuiSkeleton} from "@taiga-ui/kit";

@Component({
    selector: "app-entry-page",
    imports: [TuiButton, RouterLink, TuiHeader, TuiSkeleton, TuiLink],
    templateUrl: "./entry-page.component.html",
    styleUrl: "./entry-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryPageComponent {
    private readonly fileLoader = inject(FileLoaderService);
    private readonly domSanitizer = inject(DomSanitizer);
    private readonly routerPathBuilder = inject(RouterPathBuilder);

    readonly entry = input.required<Tables<"entries"> & {attachmentPaths: string[]}>();

    readonly editUrl = computed(() =>
        this.routerPathBuilder.editEntry(this.entry().diary_id, this.entry().id),
    );

    readonly backUrl = computed(() => {
        return this.routerPathBuilder.diaryEntries(this.entry().diary_id)
    })

    readonly content = computed(() => {
        return this.domSanitizer.bypassSecurityTrustHtml(
            generateHTML(JSON.parse(this.entry().content), [StarterKit]),
        );
    });

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
}
