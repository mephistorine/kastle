import {TuiRoot} from "@taiga-ui/core";
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {RouterModule} from "@angular/router";
import {WA_WINDOW} from "@ng-web-apis/common";
import {toSignal} from "@angular/core/rxjs-interop";
import {fromEvent, map, startWith} from "rxjs";

@Component({
    imports: [RouterModule, TuiRoot],
    selector: "app-root",
    templateUrl: "./app.html",
    styleUrl: "./app.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
    private readonly window = inject(WA_WINDOW);
    private readonly preferColorSchemeMedia = this.window.matchMedia("(prefers-color-scheme: dark)");

    readonly isDark = toSignal(fromEvent<MediaQueryListEvent>(this.preferColorSchemeMedia, "change").pipe(
        map((event) => event.matches),
        startWith(this.preferColorSchemeMedia.matches)
    ));
}
