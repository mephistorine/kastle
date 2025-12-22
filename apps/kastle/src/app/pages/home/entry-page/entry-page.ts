import {ChangeDetectionStrategy, Component} from "@angular/core";
import {injectRouteData} from "ngxtension/inject-route-data";
import {TuiButton} from "@taiga-ui/core";
import {TuiSubheaderCompactComponent} from "@taiga-ui/layout";
import {RouterLink} from "@angular/router";

@Component({
    selector: "app-entry-page",
    imports: [TuiButton, TuiSubheaderCompactComponent, RouterLink],
    templateUrl: "./entry-page.html",
    styleUrl: "./entry-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryPage {
    readonly entry = injectRouteData((data) => data["entry"] as any);

    constructor() {
        console.log(this.entry());
    }
}
