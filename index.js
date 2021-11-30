require('dotenv').config();
const Sequelize = require('sequelize');
const AWS = require('aws-sdk');
const fs = require('fs');
const express = require('express');
const db = require('./models/image.model');
const seedData = require('./seed');

const app = express();

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY,
});

const bucketName = process.env.BUCKET_NAME;

let migrationRunning = false;

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
// sequelize.sync({force: true}).then(() => {
//     console.log('Drop and re-sync db.');
// });

const Images = db(sequelize);

async function migrateImages() {
    migrationRunning = true;
    const results = await Images.findAll({
        where: {
            retired: {
                [Sequelize.Op.eq]: false,
            },
            is_migrated: {
                [Sequelize.Op.eq]: false,
            },
        },
    });

    const uploadPromises = results.map(async ({ dataValues }) => {
        const { name, url, id } = dataValues;

        let fileContent;

        try {
            const data = fs.readFileSync(url);
            fileContent = data;
            console.log(`Read: ${url}`);
        } catch (err) {
            console.error(`Error: ${url}`);
            return;
        }

        let location;
        try {
            const data = await s3
                .upload({
                    Bucket: bucketName,
                    Key: name,
                    Body: fileContent,
                })
                .promise();
            location = data.Location;
        } catch (err) {
            console.log(`${path} failed to upload`);
            return;
        }

        return Images.update(
            {
                url: location,
                is_migrated: true,
                old_url: url,
            },
            { where: { id } }
        );
    });

    const out = await Promise.all(uploadPromises);
    console.log(out);
    migrationRunning = false;
}

app.get('/initMigration', (req, res) => {
    if (migrationRunning) {
        return res.status(400).send('Migration already running');
    }
    migrateImages();
    return res.send('MIgration started');
});

app.get('/getMIgrationStatus', async (req, res) => {
    try {
        const data = await Images.findAll({
            attributes: ['name', 'url', 'is_migrated'],
            where: {
                retired: {
                    [Sequelize.Op.eq]: false,
                },
            },
        });
        res.send(data);   
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
});

app.get('/seedData', (req, res) => {
    // for dev only
    seedData(Images);
    return res.send('Seeding started');
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
