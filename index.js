require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('./models/image.model');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

// dont use in prod
sequelize.sync().then(() => {
    console.log('Drop and re-sync db.');
});

const Images = db(sequelize);

const getAllImages = async () => {
    const data = await Images.findAll();
};

getAllImages();
