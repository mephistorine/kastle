import {Component, computed, inject} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {TuiButton, TuiDialogContext} from "@taiga-ui/core";
import {TuiInputFiles, TuiInputFilesDirective} from "@taiga-ui/kit";
import {injectContext} from "@taiga-ui/polymorpheus";

@Component({
    selector: "app-ui-attach-image-dialog",
    imports: [ReactiveFormsModule, TuiButton, TuiInputFiles, TuiInputFilesDirective],
    templateUrl: "./ui-attach-image-dialog.component.html",
    styleUrl: "./ui-attach-image-dialog.component.css",
})
export class UiAttachImageDialogComponent {
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
