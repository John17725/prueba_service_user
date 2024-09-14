const { createUser, updateUser, deleteUser, getUserById } = require('../services/userService');

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = await createUser({
            firstName,
            lastName,
            email,
            password
        });

        res.status(201).json({
            message: 'User success created',
            user
        });
    } catch (error) {
        res.status(400).json({
            message: error?.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).json({ message: 'User found', user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
