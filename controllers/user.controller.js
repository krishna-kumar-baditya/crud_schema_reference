const UserRepositories = require("../repositories/user.repositories");
const UserDetailsRepositories = require("../repositories/userdetails.repositories");
const UserModel = require("../models/user.model");
const mongoose = require("mongoose");

class UserController {
    async showCreate(req, res) {
        try {
            res.render("index");
        } catch (error) {
            console.log(`error at showCreate due to : ${error.message}`);
        }
    }

    async insert(req, res) {
        let session;

        try {
            const { firstName, lastName, email, address, bloodGroup } = req.body;

            // Validate all required fields before starting session
            if (!firstName || !lastName || !email || !address || !bloodGroup) {
                req.flash("error", "All fields are required");
                return res.redirect("/");
            }

            session = await mongoose.startSession();
            session.startTransaction();

            // Check email uniqueness
            const existingUser = await UserModel.findOne({ email, isDeleted: false }).session(session);
            if (existingUser) {
                req.flash("error", "Email already exists");
                return res.redirect("/");
            }

            // Insert User
            const userData = await UserRepositories.create([{ firstName, lastName, email }], session);

            // Insert UserDetails
            const userDetailsData = await UserDetailsRepositories.create(
                [{
                    userId: userData[0]._id,
                    address,
                    bloodGroup
                }],
                session
            );

            await session.commitTransaction();
            req.flash("success", "User created successfully");
            return res.redirect("/list");

        } catch (error) {
            if (session) await session.abortTransaction();
            console.error(`Error creating user: ${error.message}`);
            req.flash("error", "Something went wrong");
            return res.redirect("/");
        } finally {
            if (session) await session.endSession();
        }
    }

    async list(req, res) {
        try {
            let allUsers = await UserRepositories.findList();
            let allDetails = await UserDetailsRepositories.findList();

            const userDetailsMap = {};
            allDetails.forEach(detail => {
                userDetailsMap[detail.userId.toString()] = detail;
            });

            const userList = allUsers.map(user => {
                const details = userDetailsMap[user._id.toString()] || {};
                return {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    address: details.address || "NA",
                    bloodGroup: details.bloodGroup || "NA"
                };
            });
            console.log(userList);
            
            res.render("list", { userList });
        } catch (error) {
            console.log(`error at list due to : ${error.message}`);
            req.flash("error", "Could not load user list");
            return res.redirect("/");
        }
    }

    async edit(req, res) {
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            const { id } = req.params;
            console.log("id ",id);
            

            // Get user
            const userData = await UserRepositories.edit(id, session);
            console.log("userData ",userData);
            
            if (!userData) {
                req.flash("error", "User not found");
                return res.redirect("/list");
            }
            
            // Get user details
            const userDetails = await UserDetailsRepositories.edit(id, session);
            console.log("userDetails ",userDetails);
            if (!userDetails) {
                req.flash("error", "User details not found");
                return res.redirect("/list");
            }

            // Merge data
            const mergedData = {
                ...userData.toObject(),
                address: userDetails.address,
                bloodGroup: userDetails.bloodGroup
            };

            await session.commitTransaction();
            res.render("edit", { userData: mergedData });

        } catch (error) {
            await session.abortTransaction();
            console.error(`Error fetching user: ${error.message}`);
            req.flash("error", "Something went wrong");
            return res.redirect("/list");
        } finally {
            session?.endSession();
        }
    }

    async update(req, res) {
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            const { firstName, lastName, email, address, bloodGroup } = req.body;
            const { id } = req.params;

            // Validate all fields
            if (!firstName || !lastName || !email || !address || !bloodGroup) {
                req.flash("error", "All fields are required");
                return res.redirect(`/edit/${id}`);
            }

            // Check email uniqueness
            const isEmailExists = await UserModel.findOne({
                email,
                isDeleted: false,
                _id: { $ne: id }
            }).session(session);

            if (isEmailExists) {
                req.flash("error", "Email already exists");
                return res.redirect(`/edit/${id}`);
            }

            // Get current user and details
            const currentUser = await UserRepositories.edit(id, session);
            const currentUserDetails = await UserDetailsRepositories.edit(id, session);

            if (!currentUser || !currentUserDetails) {
                req.flash("error", "User or details not found");
                return res.redirect("/list");
            }

            // Check if anything has changed
            const userChanged =
                currentUser.firstName !== firstName ||
                currentUser.lastName !== lastName ||
                currentUser.email !== email;

            const detailsChanged =
                currentUserDetails.address !== address ||
                currentUserDetails.bloodGroup !== bloodGroup;

            if (!userChanged && !detailsChanged) {
                req.flash("error", "No changes detected");
                return res.redirect(`/edit/${id}`);
            }

            // Update user
            // if (userChanged) {
                await UserRepositories.update(id, { firstName, lastName, email }, session);
            // }

            // Update user details
            // if (detailsChanged) {
                await UserDetailsRepositories.update(id, { address, bloodGroup }, session);
            // }

            await session.commitTransaction();
            req.flash("success", "Data updated successfully");
            return res.redirect(`/edit/${id}`);

        } catch (error) {
            await session.abortTransaction();
            console.error(`Error updating user: ${error.message}`);
            req.flash("error", "Something went wrong");
            return res.redirect(`/edit/${id}`);
        } finally {
            session?.endSession();
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedData = await UserRepositories.delete(id);
            const deletedetailsdData = await UserDetailsRepositories.delete(id);
            if (deletedData) {
                req.flash("success", "User deleted successfully");
                return res.redirect("/list");
            }
        } catch (error) {
            console.log(`error at delete due to : ${error.message}`);
            req.flash("error", "Failed to delete user");
            return res.redirect("/list");
        }
    }
}

module.exports = new UserController();