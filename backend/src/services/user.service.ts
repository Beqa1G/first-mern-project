import UserModel, { UserInput } from "../models/user.model";


export async function registerUser(input : UserInput) {
    return UserModel.create(input)
}