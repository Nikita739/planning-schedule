import {models} from '../models/models';

export default new class AuthService {
    registration(username: string, email: string, password: string) {
        models.User.create({
            username: "admin",
            email: "nikita@gmail.com",
            password: "123456",
        });
    }
}