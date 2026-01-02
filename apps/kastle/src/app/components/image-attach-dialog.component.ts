import {ChangeDetectionStrategy, Component, computed, inject} from "@angular/core";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {TuiFiles} from "@taiga-ui/kit";
import {injectContext, PolymorpheusComponent} from "@taiga-ui/polymorpheus";
import {toSignal} from "@angular/core/rxjs-interop";
import {TuiButton, TuiDialogContext} from "@taiga-ui/core";

@Component({
    selector: "app-file-attach-dialog",
    imports: [TuiFiles, ReactiveFormsModule, TuiButton],
    template: `
        <label tuiInputFiles>
            <input
                tuiInputFiles
                [accept]="acceptedMimeTypes.join(',')"
                [formControl]="filesControl"
                [multiple]="true"
            />
        </label>

        <div class="image-preview-container">
            @for (file of previewFiles(); track file.fileName) {
                <img
                    alt=""
                    class="image-preview"
                    [attr.src]="file.url"
                />
            }
        </div>

        <button
            size="m"
            tuiButton
            type="button"
            (click)="attachImages()"
        >
            Attach
        </button>
    `,
    styles: `
        :host {
            display: block;
        }

        .image-preview-container {
            margin-block-start: 1rem;
            display: flex;
            gap: 1rem;
            overflow-inline: auto;
        }

        .image-preview {
            inline-size: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageAttachDialogComponent {
    private readonly fb = inject(NonNullableFormBuilder);

    readonly context = injectContext<TuiDialogContext<File[], void>>();

    readonly acceptedMimeTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/avif",
        "image/gif",
        "video/mp4",
        "video/mpeg",
        "video/webm",
    ];

    readonly filesControl = this.fb.control<File[]>([]);

    readonly files = toSignal(this.filesControl.valueChanges, {initialValue: []});

    readonly previewFiles = computed(() => {
        return this.files().map((file) => {
            return {
                fileName: file.name,
                url: URL.createObjectURL(file),
            };
        });
    });

    attachImages() {
        if (this.files().length <= 0) {
            return;
        }

        this.context.completeWith(this.files());
    }
}

export const IMAGE_ATTACH_DIALOG_COMPONENT_POLYMORPHEUS = new PolymorpheusComponent(
    ImageAttachDialogComponent,
);
