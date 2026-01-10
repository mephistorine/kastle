import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FeatureRegisterPageComponent} from "./feature-register-page.component";

describe("FeatureRegisterPageComponent", () => {
    let component: FeatureRegisterPageComponent;
    let fixture: ComponentFixture<FeatureRegisterPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureRegisterPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureRegisterPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
