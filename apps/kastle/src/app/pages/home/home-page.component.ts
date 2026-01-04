import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";
import {
    TuiButton,
    TuiDataListComponent,
    TuiDialogService,
    TuiDropdown,
    TuiDropdownOpen,
    TuiOptionNew,
    TuiTitle
} from "@taiga-ui/core";
import {Tables} from "../../../database.types";
import {TuiHeader} from "@taiga-ui/layout";
import {RouterPathBuilder} from "../../router-path-builder.service";
import {DIARY_UPSERT_DIALOG_COMPONENT_POLYMORPHEUS} from "../../components/diary-upsert-dialog.component";
import {TuiAvatar} from "@taiga-ui/kit";

@Component({
    selector: "app-home-page",
    imports: [
        ReactiveFormsModule,
        RouterOutlet,
        RouterLink,
        TuiButton,
        TuiHeader,
        TuiTitle,
        TuiAvatar,
        TuiDataListComponent,
        TuiDropdownOpen,
        TuiOptionNew,
        TuiDropdown,
    ],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    private readonly routerPathBuilder = inject(RouterPathBuilder);
    private readonly tuiDialogService = inject(TuiDialogService);

    readonly settingsUrl = this.routerPathBuilder.settings();

    readonly diaries = input.required<Tables<"diaries">[]>();

    readonly diaryLinks = computed(() => {
        return [
            {
                id: "all",
                name: "All entries",
                url: this.routerPathBuilder.allEntriesPage(),
                icon: "grid-2x2",
            },
            ...this.diaries().map(({id, name}) => ({
                id: id,
                name: name,
                url: this.routerPathBuilder.diaryEntries(id),
                icon: "plus",
            })),
        ];
    });

    openDiaryUpsertDialog() {
        this.tuiDialogService
            .open(DIARY_UPSERT_DIALOG_COMPONENT_POLYMORPHEUS)
            .subscribe();
    }
}
