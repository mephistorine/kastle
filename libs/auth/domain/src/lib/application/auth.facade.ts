import {inject, Injectable} from "@angular/core";
import {PocketbaseClient} from "@kstl/shared/domain";

export type AuthFacadeRegisterDto = {
    readonly email: string
    readonly password: string
    readonly passwordConfirm: string
}

@Injectable()
export class AuthFacade {
    private readonly pocketbaseClient = inject(PocketbaseClient);

    loginViaPassword(email: string, password: string) {
        // TODO: move to independent data access
        return this.pocketbaseClient
            .collection("users")
            .authWithPassword(email, password);
    }

    register(authFacadeRegisterDto: AuthFacadeRegisterDto) {
        return this.pocketbaseClient
            .collection("users")
            .create({
                email: authFacadeRegisterDto.email,
                password: authFacadeRegisterDto.password,
                passwordConfim: authFacadeRegisterDto.passwordConfirm
            })
    }
}
