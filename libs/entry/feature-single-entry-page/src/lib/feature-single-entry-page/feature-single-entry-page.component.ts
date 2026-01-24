import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {RouterLink} from "@angular/router";
import {Entry} from "@kstl/entry/domain";
import {RouterPathBuilder} from "@kstl/shared/util-router";
import {TuiButton, TuiLink} from "@taiga-ui/core";
import {generateHTML} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

@Component({
    selector: "lib-entry-feature-single-entry-page",
    imports: [TuiButton, TuiLink, RouterLink],
    templateUrl: "./feature-single-entry-page.component.html",
    styleUrl: "./feature-single-entry-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSingleEntryPageComponent {
    private readonly routerPathBuilder = inject(RouterPathBuilder);
    private readonly domSanitizer = inject(DomSanitizer);

    readonly entry = input.required<Entry>();

    readonly editUrl = computed(() =>
        this.routerPathBuilder.editEntry(this.entry().diaryId, this.entry().id),
    );

    readonly backUrl = computed(() => {
        return this.routerPathBuilder.diaryEntries(this.entry().diaryId);
    });

    readonly content = computed(() => {
        return this.domSanitizer.bypassSecurityTrustHtml(
            generateHTML(JSON.parse(this.entry().content), [StarterKit]),
        );
    });
}
