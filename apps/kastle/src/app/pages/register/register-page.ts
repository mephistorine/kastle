import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    TuiAppearance,
    TuiButton, TuiError,
    TuiLabel, TuiLink,
    TuiTextfieldComponent,
    TuiTextfieldDirective, TuiTitle,
} from "@taiga-ui/core";
import {injectSupabaseClient} from "../../supabase";
import {AsyncPipe} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {TuiCardLarge, TuiForm, TuiHeader} from "@taiga-ui/layout";
import {TuiFieldErrorPipe} from "@taiga-ui/kit";

@Component({
    selector: "app-register-page",
    imports: [
        ReactiveFormsModule,
        TuiTextfieldComponent,
        TuiLabel,
        TuiTextfieldDirective,
        TuiButton,
        AsyncPipe,
        RouterLink,
        TuiAppearance,
        TuiCardLarge,
        TuiError,
        TuiFieldErrorPipe,
        TuiForm,
        TuiHeader,
        TuiLink,
        TuiTitle,
    ],
    templateUrl: "./register-page.html",
    styleUrl: "./register-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
    private formBuilder = inject(NonNullableFormBuilder);
    private readonly supabaseClient = injectSupabaseClient();
    private readonly router = inject(Router);

    form = this.formBuilder.group({
        email: ["", Validators.required],
        password: ["", Validators.required],
    });

    register() {
        this.supabaseClient.auth
            .signUp({
                email: this.form.value.email!,
                password: this.form.value.password!,
            })
            .then(({data, error}) => {
                this.router.navigateByUrl("/login")
            });
    }
}
