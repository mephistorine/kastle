import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SetUp} from "./set-up";

describe("SetUp", () => {
    let component: SetUp;
    let fixture: ComponentFixture<SetUp>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SetUp],
        }).compileComponents();

        fixture = TestBed.createComponent(SetUp);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
