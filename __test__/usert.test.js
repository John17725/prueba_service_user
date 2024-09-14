const request = require('supertest');
const { validateEmail, validatePassword,
    validateUserDontExistByEmail,
    validateUserDontExistByName } = require('../src/services/userService')
const app = require('../app');


describe('POST /api/v1/users', () => {
    it('Should create a new user with valid data', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "Jesus",
                lastName: "Gonzalez",
                email: "jesusgonzalez@gmail.com",
                password: "Obleasdechocolate28*#"
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User success created');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe('jesusgonzalez@gmail.com');
    });

    it('Should return error with invalid email', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "Eduardo",
                lastName: "Mendoza",
                email: "edmendoza@gmail",
                password: "Obleasdechocolate28*#"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("The email is invalid.");
    });

    it('Should return error empty fields', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Fields are required");
    });

    it('Should return error when email is already used', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "Jorge",
                lastName: "Jimenez",
                email: "jesusgonzalez@gmail.com",
                password: "Obleasdechocolate28*#"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("This user with email already exist.");
    });

    it('Should return error when first name and last name is already used', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "Jesus",
                lastName: "Gonzalez",
                email: "jesusgonzalez@gmail.com",
                password: "Obleasdechocolate28*#"
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("This user with names already exist.");
    });

});

describe('GET /api/v1/users', () => {
    it('Should return user information found', async () => {
        const response = await request(app)
            .get('/api/v1/users/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User found");
        expect(response.body.user.id).toBe(1);
    });

    it('Should return error when information user not found', async () => {
        const response = await request(app)
            .get('/api/v1/users/100');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
})

describe('PUT /api/v1/users/:id', () => {
    let userId;
    beforeAll(async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: 'Giezi Natanael',
                lastName: 'Calixto',
                email: 'gexito@gmail.com',
                password: 'OldPassword123!*#'
            });


        userId = response.body?.user?.id;
    });

    it('Should update user information successfully', async () => {
        const updatedUserData = {
            firstName: 'Azarel',
            lastName: 'Romero',
            email: 'azarelromero@gmail.com',
            password: 'NewPassword123!'
        };

        const response = await request(app)
            .put(`/api/v1/users/${userId}`)
            .send(updatedUserData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.firstName).toBe('Azarel');
        expect(response.body.user.lastName).toBe('Romero');
        expect(response.body.user.email).toBe('azarelromero@gmail.com');
    });

    it('Should return error when updating with invalid data', async () => {
        const invalidData = {
            firstName: '',
            email: 'invalidemail'
        };

        const response = await request(app)
            .put(`/api/v1/users/${userId}`)
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Fields are required');
    });
})

describe('DELETE /api/v1/users/:id', () => {
    let userId;
    beforeAll(async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                firstName: 'Eduardo',
                lastName: 'Saucedo',
                email: 'edmaverick@gmail.com',
                password: 'OldPassword123!*#'
            });


        userId = response.body?.user?.id;
    });

    it('Should delete a user successfully', async () => {
        const response = await request(app)
            .delete(`/api/v1/users/${userId}`);

        expect(response.status).toBe(204);

        const responseSearchUser = await request(app)
            .get('/api/v1/users/' + userId);
        expect(responseSearchUser.status).toBe(404);
        expect(responseSearchUser.body.message).toBe("User not found");
    });
});



describe('Validations when trying to create a user', () => {
    it('Should throw error when email already exists', async () => {
        await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "Jesus",
                lastName: "Gonzalez",
                email: "jesusgonzalez@gmail.com",
                password: "Obleasdechocolate28*#"
            });

        await expect(validateUserDontExistByEmail('jesusgonzalez@gmail.com')).rejects.toThrow('This user with email already exist.');
    });

    it('Should throw error when user first name and last name already exists', async () => {
        await request(app)
            .post('/api/v1/users')
            .send({
                firstName: "Valeria",
                lastName: "Estrada",
                email: "valeriaestrada@gmail.com",
                password: "Obleasdechocolate28*#"
            });

        await expect(validateUserDontExistByName('Valeria', 'Estrada')).rejects.toThrow('This user with names already exist.');
    });

    it('Should return error to invalid password', async () => {
        await expect(() => validatePassword('palosrojos')).toThrow('The password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.');
    });

    it('Should return error to invalid email', async () => {
        await expect(() => validateEmail('jesugonzalez.dev@')).toThrow('The email is invalid.');
    });

});

describe('Validations types input to functions to create user', () => {
    it('Should return error to invalid input password', async () => {
        await expect(() => validatePassword(2133)).toThrow('Not valid value');
    });

    it('Should return error to invalid email', async () => {
        await expect(() => validateEmail('jesugonzalez.dev@')).toThrow('The email is invalid.');
    });

    it('Should return error to invalid input email', async () => {
        await expect(() => validateEmail(21321313)).toThrow('Not valid value');
    });

    it('Should return error to invalid input firstname', async () => {
        await expect(() => validateUserDontExistByName(21321313, 'Estrada')).rejects.toThrow('Not valid value');
    });

    it('Should return error to invalid input last name', async () => {
        await expect(() => validateUserDontExistByName('Jesus', 2132131)).rejects.toThrow('Not valid value');
    });
})

