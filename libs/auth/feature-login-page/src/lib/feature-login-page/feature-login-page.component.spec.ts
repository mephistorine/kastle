import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FeatureLoginPageComponent} from "./feature-login-page.component";

describe("FeatureLoginPageComponent", () => {
    let component: FeatureLoginPageComponent;
    let fixture: ComponentFixture<FeatureLoginPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureLoginPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureLoginPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
