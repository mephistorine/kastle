import {ChangeDetectionStrategy, Component, input} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";
import {TuiLink} from "@taiga-ui/core";
import {Tables} from "../../../database.types";

@Component({
    selector: "app-home-page",
    imports: [ReactiveFormsModule, RouterOutlet, RouterLink, TuiLink],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    readonly diaries = input.required<Tables<"diaries">[]>();
}
