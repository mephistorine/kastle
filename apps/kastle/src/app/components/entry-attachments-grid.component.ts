import {Component, input} from "@angular/core";

@Component({
    selector: "app-entry-attachments-grid",
    template: `
        @for (attachment of attachments(); track $index) {

        }
    `
})
export class EntryAttachmentsGridComponent {
    readonly attachments = input<any[]>([])
}
