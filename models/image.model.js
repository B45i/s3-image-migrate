const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Images = sequelize.define('images', {
        name: {
            type: Sequelize.STRING,
        },
        url: {
            type: Sequelize.STRING,
        }
    });

    return Images;
};
