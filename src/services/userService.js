const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const validatePassword = (password) => {
    if (typeof password !== 'string') {
        throw new Error("Not valid value");
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("The password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.");
    }
};

const validateEmail = (email) => {
    if (typeof email !== 'string') {
        throw new Error("Not valid value");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("The email is invalid.");
    }
}

const validateUserDontExistByName = async (firstName, lastName) => {
    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
        throw new Error("Not valid value");
    }
    const user = await User.findOne({ where: { firstName: firstName, lastName: lastName } })
    if (user) {
        throw new Error("This user with names already exist.");
    }
}

const validateUserDontExistByEmail = async (email) => {
    if (typeof email !== 'string') {
        throw new Error("Not valid value");
    }
    validateEmail(email)
    const user = await User.findOne({ where: { email: email } })
    if (user) {
        throw new Error("This user with email already exist.");
    }
}

const createUser = async (userData) => {
    const { firstName, lastName, email, password } = userData;
    if (firstName === '' || lastName === '' || email === '' || password === '') {
        throw new Error('Fields are required');
    }
    await validateUserDontExistByName(firstName, lastName)
    await validateUserDontExistByEmail(email)
    validateEmail(email)
    validatePassword(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    return user;
};

const updateUser = async (id, data) => {
    if (data.firstName === '' || data.lastName === '' || data.email === '' || data.password === '') {
        throw new Error('Fields are required');
    }
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    const duplicateName = await User.findOne({
        where: { firstName: data.firstName, lastName: data.lastName, id: { [Op.ne]: id } }
    });
    if (duplicateName) throw new Error('User with same name exists');

    if (data.password) {
        validatePassword(data.password);
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }
    validateEmail(data.email)
    Object.assign(user, data);
    await user.save();
    return user;
};

const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    await user.destroy();
};

const getUserById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    return user;
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    validateEmail,
    validatePassword,
    validateUserDontExistByName,
    validateUserDontExistByEmail
};
