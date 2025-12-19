import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {
    TuiButton,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
} from "@taiga-ui/core";
import {SupabaseFactory} from "../../supabase";
import {Router} from "@angular/router";

@Component({
    selector: "app-set-up",
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TuiLabel,
        TuiTextfieldComponent,
        TuiTextfieldDirective,
        TuiButton,
    ],
    templateUrl: "./set-up.html",
    styleUrl: "./set-up.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetUp {
    private fb = inject(NonNullableFormBuilder);
    private supabaseFactory = inject(SupabaseFactory);
    private router = inject(Router)

    form = this.fb.group({
        projectUrl: ["", Validators.required],
        apiKey: ["", Validators.required],
    });

    setUp() {
        if (this.form.invalid) {
            return;
        }

        const {projectUrl, apiKey} = this.form.value;

        this.supabaseFactory.createClient(projectUrl!, apiKey!);
        this.router.navigateByUrl("/login")
    }
}
