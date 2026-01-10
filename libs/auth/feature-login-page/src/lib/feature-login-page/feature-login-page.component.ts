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
import {TuiFieldErrorPipe} from "@taiga-ui/kit";
import {TuiCardLarge, TuiForm, TuiHeader} from "@taiga-ui/layout";

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
    ],
    templateUrl: "./feature-login-page.component.html",
    styleUrl: "./feature-login-page.component.css",
    providers: [AuthFacade],
})
export class FeatureLoginPageComponent {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    readonly form = this.fb.group({
        email: ["", [Validators.required]],
        password: ["", Validators.required],
    });

    async logIn() {
        if (this.form.invalid) {
            this.form.updateValueAndValidity();

            return;
        }

        const {email, password} = this.form.getRawValue();

        await this.authFacade.loginViaPassword(email, password);
        await this.router.navigateByUrl("/");
    }
}
