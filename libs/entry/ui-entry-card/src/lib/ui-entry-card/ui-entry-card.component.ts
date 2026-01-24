import {Component, computed, inject, input} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {RouterLink} from "@angular/router";
import {Entry} from "@kstl/entry/domain";
import {RouterPathBuilder} from "@kstl/shared/util-router";
import {
    TuiAppearance,
    TuiButton,
    TuiDataListComponent, TuiDropdown,
    TuiDropdownOpen,
    TuiOptionNew,
} from "@taiga-ui/core";
import {TuiCardLarge} from "@taiga-ui/layout";
import {generateHTML} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

@Component({
    selector: "app-ui-entry-card",
    imports: [
        TuiAppearance,
        TuiButton,
        TuiCardLarge,
        TuiDataListComponent,
        TuiDropdownOpen,
        TuiOptionNew,
        RouterLink,
        TuiDropdown,
    ],
    templateUrl: "./ui-entry-card.component.html",
    styleUrl: "./ui-entry-card.component.css",
})
export class UiEntryCardComponent {
    private readonly routerPathBuilder = inject(RouterPathBuilder);
    private readonly domSanitizer = inject(DomSanitizer);

    readonly entry = input.required<Entry>();

    readonly entryLink = computed(() =>
        this.routerPathBuilder.entryPage(this.entry().diaryId, this.entry().id),
    );

    readonly content = computed(() => {
        return this.domSanitizer.bypassSecurityTrustHtml(
            generateHTML(JSON.parse(this.entry().content), [StarterKit]),
        );
    });

    readonly createDate = computed(() => this.entry().created);

    readonly createDateFormatted = computed(() => {
        return new Date(this.entry().created).toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    });

    markAsBookmarked() {}

    markAsDeleted() {}
}
