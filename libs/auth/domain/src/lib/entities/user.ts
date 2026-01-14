import {AuthRecord} from "pocketbase";

export type User = Readonly<AuthRecord & {
    email: string
    emailVisibility: boolean
    verified: boolean
    name: string
    avatar: string
}>;
