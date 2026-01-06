import {Component, computed, inject} from "@angular/core";
import {injectContext, PolymorpheusComponent} from "@taiga-ui/polymorpheus";
import {TuiButton, TuiDialogContext, TuiIcon, TuiTextfield} from "@taiga-ui/core";
import {
    AbstractControl,
    NonNullableFormBuilder,
    ReactiveFormsModule, Validators,
} from "@angular/forms";
import {nanoid} from "nanoid";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, startWith} from "rxjs";
import {colord} from "colord";
import {TuiAutoFocus} from "@taiga-ui/cdk";

@Component({
    selector: "app-diary-upsert-dialog",
    imports: [TuiTextfield, TuiButton, ReactiveFormsModule, TuiIcon, TuiAutoFocus],
    template: `
        <div
            class="icon-container"
            [style]="iconColorStyles()"
        >
            <tui-icon [icon]="formValue().icon" />
        </div>

        <form
            [attr.id]="formId"
            [formGroup]="form"
            (ngSubmit)="save($event)"
        >
            <tui-textfield>
                <label
                    for=""
                    tuiLabel
                >
                    Diary name
                </label>
                <input
                    formControlName="name"
                    tuiAutoFocus
                    tuiTextfield
                    type="text"
                />
            </tui-textfield>

            <div class="color-picker">
                @for (color of predefinedColors; track color) {
                    <button
                        type="button"
                        class="color-picker-btn"
                        [class.active]="formValue().accentColor === color"
                        (click)="pickColor(color)"
                    >
                        <div
                            class="color-circle"
                            [style.--color]="color"
                        ></div>
                    </button>
                }
                <!--
                <input
                    class="color-circle"
                    formControlName="accentColor"
                    type="color"
                    [attr.list]="colorListId"
                />

                <datalist [attr.id]="colorListId">
                    @for (color of predefinedColors; track $index) {
                        <option [attr.value]="color"></option>
                    }
                </datalist>-->
            </div>

            <div>
                @for (icon of icons; track $index) {
                    <button
                        type="button"
                        appearance="flat-grayscale"
                        size="m"
                        tuiIconButton
                        [iconStart]="icon"
                        [tuiAppearanceState]="formValue().icon === icon ? 'hover' : null"
                        (click)="pickIcon(icon)"
                    ></button>
                }
            </div>
        </form>

        <footer>
            <button
                size="m"
                tuiButton
                type="submit"
                [attr.form]="formId"
            >
                {{ isEdit ? "Save" : "Create" }}
            </button>
        </footer>
    `,
    styles: `
        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-block-end: 1rem;
        }

        .icon-container {
            padding: 1rem;
            border-radius: 100%;
            aspect-ratio: 1;
            inline-size: fit-content;
            margin: 3rem auto;
        }

        .icon-container tui-icon {
            font-size: 2rem;
        }

        .color-picker {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .color-circle {
            inline-size: 1.5rem;
            aspect-ratio: 1;
            background-color: var(--color);
            border-radius: 100%;
        }

        .color-picker-btn {
            background: none;
            border: none;
            padding: 0.5rem;
            transition: background 300ms ease-in-out;
            border-radius: var(--tui-radius-m);
        }

        .color-picker-btn:hover,
        .color-picker-btn.active {
            background: var(--tui-background-neutral-1-hover);
        }
    `,
})
export class DiaryUpsertDialogComponent {
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

    readonly colorListId = `${this.dialogContext.id}--${nanoid(10)}`;

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
            return
        }

        this.dialogContext.completeWith(
            this.form.getRawValue()
        )
    }
}

export const DIARY_UPSERT_DIALOG_COMPONENT_POLYMORPHEUS = new PolymorpheusComponent(
    DiaryUpsertDialogComponent,
);

export function createControlRawValueSignal<T, R extends T>(control: AbstractControl<T, R>) {
    return toSignal<R>(
        control.valueChanges.pipe(
            startWith(control.getRawValue()),
            map(() => control.getRawValue())
        ),
        {requireSync: true}
    )
}
