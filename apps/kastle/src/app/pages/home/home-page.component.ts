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
import {DiaryFacade} from "@kstl/diary/domain";
import {FeatureDiaryUpsertDialogComponent} from "@kstl/diary/feature-diary-upsert-dialog";
import {PocketbaseClient} from "@kstl/shared/domain";
import {RouterPathBuilder} from "@kstl/shared/util-router";
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
import {lastValueFrom} from "rxjs";

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
        loader: () => this.diaryFacade.getAll(),
        defaultValue: [],
    });

    readonly diaryLinks = computed(() => {
        return [
            {
                id: "all",
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
                id: "recently-deleted",
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
                user.avatar.length > 0
                    ? this.pocketbaseClient.files.getURL(user, user.avatar, {
                          thumb: "50x50",
                      })
                    : "@tui.user",
        };
    }

    async openDiaryUpsertDialog(editDiary?: any) {
        const result = await lastValueFrom(
            // FIX: any
            this.tuiDialogService.open<any>(
                new PolymorpheusComponent(FeatureDiaryUpsertDialogComponent),
                {
                    data: editDiary ?? null,
                },
            ),
        );

        // TODO: Add error catching
        if (editDiary) {
            await this.diaryFacade.update(result);
            return;
        }

        await this.diaryFacade.create(result);
    }

    async logOut() {
        // await this.supabaseClient.auth.signOut();
        await this.router.navigateByUrl(this.routerPathBuilder.login());
    }
}
