import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit} from "@angular/core";
import {RouterLink} from "@angular/router";
import {Diary, DiaryFacade} from "@kstl/diary/domain";
import {Entry, EntryFacade} from "@kstl/entry/domain";
import {UiEntryCardComponent} from "@kstl/entry/ui-entry-card";
import {TuiButton, TuiTitle} from "@taiga-ui/core";
import {TuiHeader} from "@taiga-ui/layout";
import {injectParams} from "ngxtension/inject-params";

@Component({
    selector: "lib-entry-feature-entry-list-page",
    imports: [RouterLink, TuiButton, TuiHeader, TuiTitle, UiEntryCardComponent],
    templateUrl: "./feature-entry-list-page.component.html",
    styleUrl: "./feature-entry-list-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureEntryListPageComponent implements OnInit {
    private readonly entryFacade = inject(EntryFacade);
    private readonly diaryFacade = inject(DiaryFacade);

    private readonly diaryId = injectParams("diaryId");

    readonly diary = input.required<Diary>();
    readonly entries = computed(() => this.entryFacade.entries());
    readonly isLoading = computed(() => this.entryFacade.isLoading());

    ngOnInit(): void {
        this.entryFacade.loadEntries();
    }
}
