import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {TuiAppearance, TuiButton, TuiError, TuiLabel, TuiLink, TuiTextfieldComponent, TuiTextfieldDirective, TuiTitle} from "@taiga-ui/core";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiFieldErrorPipe} from "@taiga-ui/kit";
import {AsyncPipe} from "@angular/common";
import {TuiCardLarge, TuiForm, TuiHeader} from "@taiga-ui/layout";
import {injectSupabaseClient} from "../../supabase";
import {Router, RouterLink} from "@angular/router";

@Component({
    selector: "app-login-page",
    imports: [
        TuiButton,
        ReactiveFormsModule,
        TuiFieldErrorPipe,
        AsyncPipe,
        TuiError,
        TuiTextfieldDirective,
        TuiLabel,
        TuiTextfieldComponent,
        TuiTitle,
        TuiForm,
        TuiCardLarge,
        TuiAppearance,
        TuiHeader,
        TuiLink,
        RouterLink,
    ],
    templateUrl: "./login-page.html",
    styleUrl: "./login-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly supabaseClient = injectSupabaseClient();
    private readonly router = inject(Router);

    readonly form = this.fb.group({
        email: ["", [Validators.required]],
        password: ["", Validators.required],
    });

    logIn() {
        if (this.form.invalid) {
            return;
        }

        let {email, password} = this.form.value;

        this.supabaseClient.auth
            .signInWithPassword({
                email: email!,
                password: password!,
            })
            .then(() => {
                this.router.navigateByUrl("/")
            });
    }
}
