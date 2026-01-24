import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UiAttachImageDialogComponent} from "./ui-attach-image-dialog.component";

describe("UiAttachImageDialogComponent", () => {
    let component: UiAttachImageDialogComponent;
    let fixture: ComponentFixture<UiAttachImageDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiAttachImageDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UiAttachImageDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
