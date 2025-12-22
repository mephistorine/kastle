import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EntriesByDiaryPage} from "./entries-by-diary-page";

describe("EntriesByDiaryPage", () => {
    let component: EntriesByDiaryPage;
    let fixture: ComponentFixture<EntriesByDiaryPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EntriesByDiaryPage],
        }).compileComponents();

        fixture = TestBed.createComponent(EntriesByDiaryPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
