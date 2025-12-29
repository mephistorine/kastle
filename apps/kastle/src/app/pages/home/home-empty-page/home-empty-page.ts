import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
    selector: "app-home-empty-page",
    imports: [],
    templateUrl: "./home-empty-page.html",
    styleUrl: "./home-empty-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEmptyPage {}
