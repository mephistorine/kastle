import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HomeEmptyPage} from "./home-empty-page";

describe("HomeEmptyPage", () => {
    let component: HomeEmptyPage;
    let fixture: ComponentFixture<HomeEmptyPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeEmptyPage],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeEmptyPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
