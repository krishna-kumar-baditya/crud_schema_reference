// repositories/user.repositories.js

const UserModel = require("../models/user.model");

class UserRepositories {
    // Create user with session support
    async create(data, session) {
        try {
            return await UserModel.create(data, { session });
        } catch (error) {
            console.error(`Error creating user: ${error.message}`);
            throw error;
        }
    }

    // Find all active users
    async findList(session) {
        try {
            const query = { isDeleted: false };
            if (session) {
                return await UserModel.find(query).session(session);
            } else {
                return await UserModel.find(query);
            }
        } catch (error) {
            console.error(`Error fetching user list: ${error.message}`);
            throw error;
        }
    }

    // Edit user by ID with session
    async edit(id, session) {
        try {
            const query = {
                _id: id,
                isDeleted: false,
            };

            if (session) {
                return await UserModel.findOne(query).session(session);
            } else {
                return await UserModel.findOne(query);
            }
        } catch (error) {
            console.error(`Error fetching user for edit: ${error.message}`);
            throw error;
        }
    }

    // Update user by ID with session
    async update(id, data, session) {
        try {
            const options = session ? { session } : {};
            return await UserModel.updateOne({ _id: id }, data, options);
        } catch (error) {
            console.error(`Error updating user: ${error.message}`);
            throw error;
        }
    }

    // Soft delete user
    async delete(id, session) {
        try {
            const update = { isDeleted: true };
            const options = session ? { session } : {};
            return await UserModel.updateOne({ _id: id }, update, options);
        } catch (error) {
            console.error(`Error deleting user: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new UserRepositories();