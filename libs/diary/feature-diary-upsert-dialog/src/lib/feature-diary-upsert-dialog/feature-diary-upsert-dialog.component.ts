import {Component, computed, inject} from "@angular/core";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {createControlRawValueSignal} from "@kstl/shared/util-forms";
import {TuiAutoFocus} from "@taiga-ui/cdk";
import {
    TuiButton,
    TuiDialogContext,
    TuiIcon,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
} from "@taiga-ui/core";
import {injectContext} from "@taiga-ui/polymorpheus";
import {colord} from "colord";
import {nanoid} from "nanoid";

@Component({
    selector: "lib-diary-feature-diary-upsert-dialog",
    imports: [
        ReactiveFormsModule,
        TuiAutoFocus,
        TuiButton,
        TuiIcon,
        TuiLabel,
        TuiTextfieldComponent,
        TuiTextfieldDirective,
    ],
    templateUrl: "./feature-diary-upsert-dialog.component.html",
    styleUrl: "./feature-diary-upsert-dialog.component.css",
})
export class FeatureDiaryUpsertDialogComponent {
    // FIX: any
    private readonly dialogContext = injectContext<TuiDialogContext<any>>();
    private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);

    // TODO: Move to DI
    readonly predefinedColors: readonly string[] = [
        "#ef4444",
        "#f97316",
        "#f59e0b",
        "#84cc16",
        "#14b8a6",
        "#06b6d4",
        "#3b82f6",
        "#6366f1",
        "#a855f7",
        "#d946ef",
        "#f43f5e",
        "#64748b",
    ];

    readonly formId = `${this.dialogContext.id}--${nanoid(10)}`;

    readonly form = this.nonNullableFormBuilder.group({
        name: ["", Validators.minLength(1)],
        accentColor: this.predefinedColors[0],
        icon: "baby",
    });

    readonly formValue = createControlRawValueSignal(this.form);

    // TODO: Move to DI
    readonly icons: readonly string[] = [
        "activity",
        "baby",
        "eye",
        "bell",
        "hat-glasses",
        "venus-and-mars",
        "moon",
        "sun",
        "bird",
        "fish",
        "arrow-big-up",
        "arrows-up-from-line",
        "graduation-cap",
        "hospital",
        "house",
        "chart-line",
        "antenna",
        "tv",
        "monitor",
        "zap",
        "loader-pinwheel",
        "pen-tool",
        "cylinder",
        "pencil",
        "braces",
        "brain-circuit",
        "bug",
        "server",
        "camera",
        "gamepad",
    ];

    readonly isEdit = Boolean(this.dialogContext.data);

    readonly iconColorStyles = computed(() => {
        return {
            // TODO: Use CSS builtin functions for alpha
            backgroundColor: colord(this.formValue().accentColor)
                .alpha(0.2)
                .toRgbString(),
            color: this.formValue().accentColor,
        };
    });

    constructor() {
        if (this.isEdit) {
            this.form.patchValue(this.dialogContext.data!);
        }
    }

    pickIcon(name: string) {
        this.form.patchValue({icon: name});
    }

    pickColor(color: string) {
        this.form.patchValue({accentColor: color});
    }

    save(event: SubmitEvent) {
        event.preventDefault();

        if (this.form.invalid) {
            return;
        }

        this.dialogContext.completeWith(this.form.getRawValue());
    }
}
