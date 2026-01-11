import {AsyncPipe} from "@angular/common";
import {Component, inject} from "@angular/core";
import {
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthFacade} from "@kstl/auth/domain";
import {createControlRawValueSignal} from "@kstl/shared/util-forms";
import {RouterPathBuilder} from "@kstl/shared/util-router";
import {
    TuiAppearance,
    TuiButton,
    TuiError,
    TuiLabel,
    TuiLink,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTitle,
} from "@taiga-ui/core";
import {TuiFieldErrorPipe, TuiRadioList} from "@taiga-ui/kit";
import {TuiCardLarge, TuiForm, TuiHeader} from "@taiga-ui/layout";

const enum ServerType {
    SelfHosted = "selfHosted",
    Default = "default",
}

@Component({
    selector: "lib-auth-feature-login-page",
    imports: [
        AsyncPipe,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        TuiAppearance,
        TuiButton,
        TuiCardLarge,
        TuiError,
        TuiFieldErrorPipe,
        TuiForm,
        TuiHeader,
        TuiLabel,
        TuiLink,
        TuiTextfieldComponent,
        TuiTextfieldDirective,
        TuiTitle,
        TuiRadioList,
    ],
    templateUrl: "./feature-login-page.component.html",
    styleUrl: "./feature-login-page.component.css",
    providers: [AuthFacade],
})
export class FeatureLoginPageComponent {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);
    private readonly routerPathBuilder = inject(RouterPathBuilder);

    readonly registerUrl = this.routerPathBuilder.register();

    readonly form = this.fb.group({
        email: ["", [Validators.required]],
        password: ["", Validators.required],
    });

    readonly serverTypes: readonly ServerType[] = [
        ServerType.Default,
        ServerType.SelfHosted,
    ];

    readonly serverType = this.fb.control<ServerType>(ServerType.Default);

    readonly serverTypeValue = createControlRawValueSignal(this.serverType);

    readonly selfhostedServerUrl = this.fb.control("", {
        validators: [Validators.required, Validators.minLength(1)],
        asyncValidators: [
            async (control) => {
                if (control.value === null) {
                    return null;
                }

                const url = control.value;
                const isHealphy = await this.authFacade.checkApiHealth(url);

                if (isHealphy) {
                    return null;
                }

                return {
                    selfHostedServerIsNotHealphy: url,
                };
            },
        ],
        updateOn: "blur",
    });

    async logIn() {
        if (this.form.invalid) {
            this.form.updateValueAndValidity();

            return;
        }

        // TODO: Add loading and validity state form form
        /*if (this.serverType.value === "selfHosted" && this.selfhostedServerUrl.invalid) {
            return;
        }*/

        const {email, password} = this.form.getRawValue();

        await this.authFacade.loginViaPassword(email, password);
        await this.router.navigateByUrl(
            this.routerPathBuilder.main()
        );
    }
}
