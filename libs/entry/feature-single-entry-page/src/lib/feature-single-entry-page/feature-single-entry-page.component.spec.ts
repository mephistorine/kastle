import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FeatureSingleEntryPageComponent} from "./feature-single-entry-page.component";

describe("FeatureSingleEntryPageComponent", () => {
    let component: FeatureSingleEntryPageComponent;
    let fixture: ComponentFixture<FeatureSingleEntryPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureSingleEntryPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureSingleEntryPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
