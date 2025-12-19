import {TuiRoot} from "@taiga-ui/core";
import {Component, inject} from "@angular/core";
import {RouterModule} from "@angular/router";
import {WA_WINDOW} from "@ng-web-apis/common";

@Component({
    imports: [RouterModule, TuiRoot],
    selector: "app-root",
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {
    readonly isDark = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)').matches
}
