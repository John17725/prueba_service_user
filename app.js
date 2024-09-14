const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', userRoutes);

sequelize.sync({ force: false })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database:', err));

app.listen(3000, () => {
    console.log('Server running in port: 3000');
})

module.exports = app;
