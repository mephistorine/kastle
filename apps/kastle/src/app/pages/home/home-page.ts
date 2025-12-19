import {ChangeDetectionStrategy, Component} from "@angular/core";
import {TuiLink} from "@taiga-ui/core";
import {RouterLink} from "@angular/router";

@Component({
    selector: "app-home-page",
    imports: [TuiLink, RouterLink],
    templateUrl: "./home-page.html",
    styleUrl: "./home-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
