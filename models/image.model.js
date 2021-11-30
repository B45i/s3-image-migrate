const Sequelize = require('sequelize');

module.exports = sequelize => {
    const Images = sequelize.define('images', {
        name: {
            type: Sequelize.STRING,
        },
        url: {
            type: Sequelize.STRING,
        },
        retired: {
            type: Sequelize.BOOLEAN,
        },
        is_migrated: {
            type: Sequelize.BOOLEAN,
        },
        old_url: {
            type: Sequelize.STRING,
        },
    });

    return Images;
};
