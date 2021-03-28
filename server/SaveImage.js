const {
    v4: uuidv4
} = require('uuid');
const fs = require('fs');
const request = require('request');
const Datasets = require('./models/Dataset');

saveImg();

function saveHttpImage(uri, filePath, directory, i, callback) {
    try {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filePath)).on('close', function () {
                callback();
            });
        });
    } catch (err) {
        throw err;
    }
};

async function saveImg() {
    let name = process.argv[2];
    let images = JSON.parse(process.argv[3]);
    let directory = process.env.resources2 + 'datasets/' + name;
    let i = 0;
    try {
        for(let element of images) {
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            let filePath = directory + '/' + 'image' + ++i + '.jpg';
            await saveHttpImage(element.contentUrl, filePath, directory, i, function () {});
        };
        let data = {
            id: uuidv4(),
            clientId: uuidv4(),
            name: name,
            path: directory,
            processed: 'Yes',
            class: 'data',
            type: 'zip',
            uploaded: 'Yes'
        };
        Datasets.add(data, function (err, row) {
            if (err) throw err;
            console.log(`${name} dataset cretaed successfully!`);
            process.exitCode;
        });
    } catch (err) {
        console.log('SaveImage.js, saveImg() , Error saving Image : ', err);
        process.exitCode;
    }
}