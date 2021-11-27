require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('./models/image.model');
const axios = require('axios');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY,
});

const bucketName = process.env.BUCKET_NAME;

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
// sequelize.sync().then(() => {
//     console.log('Drop and re-sync db.');
// });

const Images = db(sequelize);

async function migrateImages() {
    const results = await Images.findAll();

    const uploadPromises = results.map(async ({ dataValues }) => {
        const { name, url } = dataValues;

        console.log(`Downloading ${name}`);
        const response = await axios(url, { responseType: 'arraybuffer' });

        const data = await s3
            .putObject({
                Bucket: bucketName,
                Key: name,
                Body: response.data,
            })
            .promise();
        console.log(`${name} Migrated to S3`);
    });

    Promise.all(uploadPromises);
}

migrateImages();
