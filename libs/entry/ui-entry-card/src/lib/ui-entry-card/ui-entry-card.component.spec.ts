import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UiEntryCardComponent} from "./ui-entry-card.component";

describe("UiEntryCardComponent", () => {
    let component: UiEntryCardComponent;
    let fixture: ComponentFixture<UiEntryCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiEntryCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UiEntryCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
