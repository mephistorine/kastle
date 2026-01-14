import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FeatureDiaryUpsertDialogComponent} from "./feature-diary-upsert-dialog.component";

describe("FeatureDiaryUpsertDialogComponent", () => {
    let component: FeatureDiaryUpsertDialogComponent;
    let fixture: ComponentFixture<FeatureDiaryUpsertDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureDiaryUpsertDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureDiaryUpsertDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
