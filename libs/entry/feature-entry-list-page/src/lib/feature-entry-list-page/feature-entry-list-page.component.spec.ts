import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FeatureEntryListPageComponent} from "./feature-entry-list-page.component";

describe("FeatureEntryListPageComponent", () => {
    let component: FeatureEntryListPageComponent;
    let fixture: ComponentFixture<FeatureEntryListPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureEntryListPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureEntryListPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
