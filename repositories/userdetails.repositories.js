// repositories/userdetails.repositories.js

const UserDetailsModel = require("../models/user_details.model");

class UserDetailsRepositories {
    // Create user details with optional session
    async create(data, session) {
        try {
            return await UserDetailsModel.create(data, { session });
        } catch (error) {
            console.error(`Error creating user details: ${error.message}`);
            throw error;
        }
    }

    // Get all active user details
    async findList(session) {
        try {
            const query = { isDeleted: false };
            if (session) {
                return await UserDetailsModel.find(query).session(session);
            } else {
                return await UserDetailsModel.find(query);
            }
        } catch (error) {
            console.error(`Error fetching user details list: ${error.message}`);
            throw error;
        }
    }

    // Find user details by ID
    async edit(id, session) {
        try {
            const query = {
                userId: id,
                isDeleted: false,
            };

            if (session) {
                return await UserDetailsModel.findOne(query).session(session);
            } else {
                return await UserDetailsModel.findOne(query);
            }
        } catch (error) {
            console.error(`Error fetching user details for edit: ${error.message}`);
            throw error;
        }
    }

    // Update user details by ID
    async update(id, data, session) {
        try {
            const options = session ? { session } : {};
            return await UserDetailsModel.updateOne({ userId: id }, data, options);
        } catch (error) {
            console.error(`Error updating user details: ${error.message}`);
            throw error;
        }
    }

    // Soft delete user details
    async delete(id, session) {
        try {
            const options = session ? { session } : {};
            return await UserDetailsModel.updateOne(
                { userId: id },
                { isDeleted: true },
                options
            );
        } catch (error) {
            console.error(`Error deleting user details: ${error.message}`);
            throw error;
        }
    }

    // Optional: Find by userId (useful for joins)
    // async findByUserId(userId, session) {
    //     try {
    //         const query = {
    //             userId,
    //             isDeleted: false,
    //         };

    //         if (session) {
    //             return await UserDetailsModel.findOne(query).session(session);
    //         } else {
    //             return await UserDetailsModel.findOne(query);
    //         }
    //     } catch (error) {
    //         console.error(`Error finding user details by userId: ${error.message}`);
    //         throw error;
    //     }
    // }
}

module.exports = new UserDetailsRepositories();