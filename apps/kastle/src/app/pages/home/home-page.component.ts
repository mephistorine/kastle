import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input, signal,
} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
    TuiAlertService, TuiAppearance,
    TuiButton,
    TuiDataListComponent,
    TuiDialogService,
    TuiDropdown,
    TuiDropdownOpen,
    TuiOptionNew,
    TuiTitle,
} from "@taiga-ui/core";
import {Tables} from "../../../database.types";
import {TuiHeader} from "@taiga-ui/layout";
import {RouterPathBuilder} from "../../router-path-builder.service";
import {DIARY_UPSERT_DIALOG_COMPONENT_POLYMORPHEUS} from "../../components/diary-upsert-dialog.component";
import {TuiAvatar} from "@taiga-ui/kit";
import {EMPTY, switchMap, take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {injectSupabaseClient} from "../../supabase";

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
        TuiAppearance,
        RouterLinkActive,
    ],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    private readonly routerPathBuilder = inject(RouterPathBuilder);
    private readonly tuiDialogService = inject(TuiDialogService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly tuiAlertService = inject(TuiAlertService);
    private readonly supabaseClient = injectSupabaseClient();

    readonly settingsUrl = this.routerPathBuilder.settings();

    readonly activeDiary = signal<number | null>(null);

    readonly diaries = input.required<Tables<"diaries">[]>();

    readonly diaryLinks = computed(() => {
        return [
            {
                id: -1,
                name: "All entries",
                url: this.routerPathBuilder.allEntriesPage(),
                icon: "grid-2x2",
            },
            ...this.diaries().map(({id, name, icon}) => ({
                id: id,
                name: name,
                url: this.routerPathBuilder.diaryEntries(id),
                icon: icon,
            })),
        ];
    });

    openDiaryUpsertDialog(editDiary?: any) {
        this.tuiDialogService
            // FIX: any
            .open<any>(DIARY_UPSERT_DIALOG_COMPONENT_POLYMORPHEUS, {
                data: editDiary ?? null,
            })
            .pipe(
                switchMap((data) =>
                    this.supabaseClient.from("diaries").upsert({
                        ...(editDiary ? {id: editDiary.id} : {}),
                        name: data.name,
                        accent_color: data.accentColor,
                        icon: data.icon,
                    }),
                ),
                switchMap(({error}) => {
                    if (error) {
                        return (
                            this.tuiAlertService
                                // FIX: Dont use error.message as UI error text
                                .open(error.message, {
                                    label: "Creation error",
                                    appearance: "error",
                                })
                        );
                    }

                    return EMPTY;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    setActiveRoute(id: number, isActive: boolean) {
        if (isActive) {
            this.activeDiary.set(id)
        } else {
            if (this.activeDiary() === id) {
                this.activeDiary.set(null);
            }
        }
    }
}
