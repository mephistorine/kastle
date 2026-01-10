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
    selector: "lib-auth-feature-register-page",
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
    templateUrl: "./feature-register-page.component.html",
    styleUrl: "./feature-register-page.component.css",
    providers: [AuthFacade],
})
export class FeatureRegisterPageComponent {
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    form = this.formBuilder.group({
        email: ["", Validators.required],
        password: ["", Validators.required],
        passwordConfirm: ["", Validators.required],
    });

    async register() {
        // TODO: Add loading
        if (this.form.invalid) {
            this.form.updateValueAndValidity();
            return;
        }

        const {email, password, passwordConfirm} = this.form.getRawValue();

        await this.authFacade.register({
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
        });

        await this.router.navigateByUrl("/login");
    }
}
