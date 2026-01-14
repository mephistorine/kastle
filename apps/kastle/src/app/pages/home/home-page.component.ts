import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    resource,
} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {User} from "@kstl/auth/domain";
import {FeatureDiaryUpsertDialogComponent} from "@kstl/diary/feature-diary-upsert-dialog";
import {PocketbaseClient} from "@kstl/shared/domain";
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
import {TuiAvatar, TuiBadge, TuiBadgedContent} from "@taiga-ui/kit";
import {TuiHeader} from "@taiga-ui/layout";
import {PolymorpheusComponent} from "@taiga-ui/polymorpheus";
import {DiaryFacade} from "../../../../../../libs/diary/domain/src/lib/application/diary.facade";
import {RouterPathBuilder} from "../../router-path-builder.service";

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
        TuiBadgedContent,
        TuiBadge,
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
    private readonly router = inject(Router);
    private readonly diaryFacade = inject(DiaryFacade);
    private readonly pocketbaseClient = inject(PocketbaseClient);

    readonly diaries = resource({
        loader: () => this.pocketbaseClient.collection("diaries").getFullList<any>(),
        defaultValue: [],
    });

    readonly diaryLinks = computed(() => {
        return [
            {
                id: -1,
                name: "All entries",
                url: this.routerPathBuilder.allEntriesPage(),
                icon: "grid-2x2",
            },
            ...this.diaries.value().map(({id, name, icon}) => ({
                id: id,
                name: name,
                url: this.routerPathBuilder.diaryEntries(id),
                icon: icon.name,
            })),
            {
                id: -2,
                name: "Recently deleted",
                url: this.routerPathBuilder.deletedEntries(),
                icon: "trash",
            },
        ];
    });

    get user() {
        const user = this.pocketbaseClient.authStore.record as User;
        return {
            ...user,
            avatarUrl:
                user.avatar.length <= 0
                    ? this.pocketbaseClient.files.getURL(user, user.avatar, {
                          thumb: "50x50",
                      })
                    : "@tui.user",
        };
    }

    openDiaryUpsertDialog(editDiary?: any) {
        this.tuiDialogService
            .open(new PolymorpheusComponent(FeatureDiaryUpsertDialogComponent), {
                data: editDiary ?? null,
            })
            .subscribe();
        /*this.tuiDialogService
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
            .subscribe();*/
    }

    async logOut() {
        // await this.supabaseClient.auth.signOut();
        await this.router.navigateByUrl(this.routerPathBuilder.login());
    }
}
