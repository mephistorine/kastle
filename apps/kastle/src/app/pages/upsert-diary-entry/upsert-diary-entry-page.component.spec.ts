import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UpsertDiaryEntryPage} from "./upsert-diary-entry-page.component";

describe("UpsertDiaryEntry", () => {
    let component: UpsertDiaryEntryPage;
    let fixture: ComponentFixture<UpsertDiaryEntryPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UpsertDiaryEntryPage],
        }).compileComponents();

        fixture = TestBed.createComponent(UpsertDiaryEntryPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
