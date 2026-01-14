import {makeEnvironmentProviders} from "@angular/core";
import Client from "pocketbase";

export class PocketbaseClient extends Client {
}

export function providePocketbaseClient(url: string) {
    return makeEnvironmentProviders([
        {
            provide: PocketbaseClient,
            useFactory: () => {
                return new PocketbaseClient(url);
            }
        }
    ])
}
