const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

class UserService {
    static async createAccount(body) {
        const userExist = await User.findUser(body.email);

        if(userExist) throw new Error('Account with the email already exist');

        return await User.create(body);
    }

    static async getAllUsers() {

        return await User.find();
    }

    static async getUser(id) {
        const user = await User.findUserById(id)

        if(!user) throw new Error('Account not found');

        return user;
    }

    static async updateUser(id, body) {
        const allowedUpdate = ['firstName', 'lastName', 'email', 'address', 'phoneNumber'];
        const isValid = Object.keys(body).every(key => allowedUpdate.includes(key));
        const isExist = await User.findUserById(id);

        if(!isExist) throw new Error('Account not found');

        if(!isValid)throw new Error('Invalid field provided for update.');

        return await User.updateUser(id, body);
    }

    static async updateAccountPassword(id, body) {
        const { currentPassword, newPassword } = body;

        const isExist = await User.findUserById(id);

        if(!isExist) throw new Error('Account not found');

        const isMatch = bcrypt.compare(currentPassword, isExist.password);
        
        if(!isMatch) throw new Error('Invalid current password');

        const password = await bcrypt.hash(user.password, 8)

        await User.updateUser(id, { password });

        return;
    }

    static async deleteAccount(id) {
        const isExist = await User.findUserById(id);

        if(!isExist) throw new Error('Account not found');

        return await User.deleteUser(id)
    }

}

module.exports = UserService;