const axios = require('axios');
const fs = require('fs');

const data = [
    {
        name: 'intelligent-steel-table',
        url: 'https://source.unsplash.com/640x480/?product/50256',
        retired: false,
    },
    {
        name: 'incredible-concrete-ball',
        url: 'https://source.unsplash.com/640x480/?product/3270',
        retired: true,
    },
    {
        name: 'gorgeous-frozen-gloves',
        url: 'https://source.unsplash.com/640x480/?product/16197',
        retired: false,
    },
    {
        name: 'rustic-cotton-towels',
        url: 'https://source.unsplash.com/640x480/?product/66838',
        retired: true,
    },
    {
        name: 'practical-cotton-keyboard',
        url: 'https://source.unsplash.com/640x480/?product/31996',
        retired: false,
    },
    {
        name: 'tasty-soft-towels',
        url: 'https://source.unsplash.com/640x480/?product/54251',
        retired: false,
    },
    {
        name: 'incredible-fresh-table',
        url: 'https://source.unsplash.com/640x480/?product/81482',
        retired: false,
    },
    {
        name: 'intelligent-rubber-mouse',
        url: 'https://source.unsplash.com/640x480/?product/49809',
        retired: true,
    },
    {
        name: 'licensed-soft-computer',
        url: 'https://source.unsplash.com/640x480/?product/73033',
        retired: true,
    },
    {
        name: 'handmade-wooden-shirt',
        url: 'https://source.unsplash.com/640x480/?product/43494',
        retired: true,
    },
    {
        name: 'licensed-frozen-sausages',
        url: 'https://source.unsplash.com/640x480/?product/76924',
        retired: true,
    },
    {
        name: 'tasty-metal-car',
        url: 'https://source.unsplash.com/640x480/?product/37673',
        retired: true,
    },
    {
        name: 'fantastic-granite-gloves',
        url: 'https://source.unsplash.com/640x480/?product/58798',
        retired: false,
    },
    {
        name: 'tasty-metal-chair',
        url: 'https://source.unsplash.com/640x480/?product/72251',
        retired: false,
    },
    {
        name: 'handmade-wooden-bike',
        url: 'https://source.unsplash.com/640x480/?product/40090',
        retired: true,
    },
    {
        name: 'ergonomic-metal-shirt',
        url: 'https://source.unsplash.com/640x480/?product/60081',
        retired: false,
    },
    {
        name: 'gorgeous-fresh-bike',
        url: 'https://source.unsplash.com/640x480/?product/89423',
        retired: false,
    },
    {
        name: 'rustic-soft-table',
        url: 'https://source.unsplash.com/640x480/?product/34348',
        retired: false,
    },
    {
        name: 'sleek-rubber-bike',
        url: 'https://source.unsplash.com/640x480/?product/53381',
        retired: false,
    },
    {
        name: 'intelligent-metal-table',
        url: 'https://source.unsplash.com/640x480/?product/93343',
        retired: false,
    },
    {
        name: 'gorgeous-soft-chicken',
        url: 'https://source.unsplash.com/640x480/?product/36538',
        retired: false,
    },
    {
        name: 'small-frozen-shoes',
        url: 'https://source.unsplash.com/640x480/?product/72366',
        retired: false,
    },
    {
        name: 'small-steel-sausages',
        url: 'https://source.unsplash.com/640x480/?product/36925',
        retired: false,
    },
    {
        name: 'incredible-plastic-salad',
        url: 'https://source.unsplash.com/640x480/?product/44157',
        retired: false,
    },
    {
        name: 'small-granite-soap',
        url: 'https://source.unsplash.com/640x480/?product/74572',
        retired: true,
    },
];

const imageDir = 'public/images/';

const seedData = Images => {
    const arr = data.map(({ name, url, retired }) => {
        const imgPath = `${imageDir}${name}.jpg`;

        axios(url, { responseType: 'stream' }).then(response => {
            response.data.pipe(fs.createWriteStream(imgPath));
        });

        Images.create({
            name,
            url: imgPath,
            retired,
        });
    });
    Promise.all(arr);
};

module.exports = seedData;
