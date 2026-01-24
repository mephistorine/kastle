import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FeatureEntryUpsertComponent} from "./feature-entry-upsert.component";

describe("FeatureEntryUpsertComponent", () => {
    let component: FeatureEntryUpsertComponent;
    let fixture: ComponentFixture<FeatureEntryUpsertComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureEntryUpsertComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureEntryUpsertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
