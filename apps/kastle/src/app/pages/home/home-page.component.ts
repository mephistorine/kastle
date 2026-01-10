import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
    resource,
} from "@angular/core";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
    TuiAlertService,
    TuiAppearance,
    TuiButton,
    TuiDataListComponent,
    TuiDialogService,
    TuiDropdown,
    TuiDropdownOpen,
    TuiOptionNew,
    TuiTitle,
} from "@taiga-ui/core";
import {TuiAvatar, TuiSkeleton} from "@taiga-ui/kit";
import {TuiHeader} from "@taiga-ui/layout";
import {EMPTY, switchMap} from "rxjs";
import {Tables} from "../../../database.types";
import {DIARY_UPSERT_DIALOG_COMPONENT_POLYMORPHEUS} from "../../components/diary-upsert-dialog.component";
import {RouterPathBuilder} from "../../router-path-builder.service";
import {injectSupabaseClient} from "../../supabase";

@Directive({
    selector: "[appAsideItemRouterLinkActiveSync]",
})
export class AsideItemRouterLinkActiveAndButtonSyncDirective {
    private tuiAppearance = inject(TuiAppearance);
    private routerLinkActive = toSignal(inject(RouterLinkActive).isActiveChange);

    constructor() {
        effect(() => {
            this.tuiAppearance.tuiAppearanceState = this.routerLinkActive()
                ? "hover"
                : null;
        });
    }
}

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
        AsideItemRouterLinkActiveAndButtonSyncDirective,
        TuiSkeleton,
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
    private readonly router = inject(Router);

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
            {
                id: -2,
                name: "Recently deleted",
                url: this.routerPathBuilder.deletedEntries(),
                icon: "trash",
            },
        ];
    });

    readonly user = resource({
        loader: async () => {
            const {data, error} = await this.supabaseClient.auth.getUser();

            if (error) {
                throw error;
            }

            return data.user;
        },
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

    async logOut() {
        await this.supabaseClient.auth.signOut();
        await this.router.navigateByUrl(this.routerPathBuilder.login());
    }
}
