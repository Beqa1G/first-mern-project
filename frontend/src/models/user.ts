import { link } from "./link";

export interface User {
    email: string,
    username: string,
}


export interface userObject {
    user: User,
    links: link[]
}