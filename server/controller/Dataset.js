const fs = require('fs');
const rp = require('request-promise');
const {
    v4: uuidv4
} = require('uuid');
const multer = require('multer');
const unzipper = require("unzipper");
const ffmpeg = require('fluent-ffmpeg');
const Camera = require('../models/Camera');
const Datasets = require('../models/Dataset');
const Relations = require('../models/Relations');
const Algorithms = require('../models/Algorithms');
const requestImageSize = require('request-image-size');

let Dataset = {
    process: (req, callback) => {
        let body = req.body;
        let dName = body.name;
        Datasets.listOne(dName, function(err, rows) {
            if (err) return callback(err);
            if (rows.length === 0) {
                return callback('', 'Dataset Not Exists');
            }
            if (rows[0].type === 'zip') {
                processByVista(dName).then(res => {
                    callback('', res);
                });
            } else {
                callback('', 'Process By Analytics docker');
            }
        });
    },
    createDataset: (req, res) => {
        const body = req.body;
        if (body.name.includes('.mov')) {
            body.name = body.name.replace('.mov', '');
            body.format = '.mov';
        }
        try {
            let directory = process.env.resources2 + 'recordings/' + body.name + '.mp4';
            ffmpeg(body.stream)
                .format('mp4')
                .seekInput('00:00:00')
                .duration(`${body.t}`)
                .saveToFile(directory)
                .on('end', function(stdout, stderr) {
                    let data = {
                        id: body.cam_id,
                        clientId: uuidv4(),
                        name: body.name,
                        path: directory,
                        processed: 'No',
                        class: 'data',
                        type: 'video',
                        uploaded: 'Yes'
                    };
                    Datasets.add(data, function(err, row) {
                        if (err) return res.status(500).json(err);
                        res.status(200).json('Video Extracted Sucessfully.');
                    });
                });
        } catch (e) {
            console.log('error>>>>>>>>>>', e);
            console.log(e.code);
            console.log(e.msg);
        }
    },
    unzipDataset: (req, res) => {

        let stor = multer.diskStorage({ //multers disk storage settings
            filename: function(req, file, cb) {
                var newName = file.originalname.toString()
                cb(null, newName)
                    //file.originalname
            },
            destination: function(req, file, cb) {
                const pathName = file.originalname.toString().replace('.zip', '');
                var lugar = process.env.resources2 + 'datasets/' + pathName;
                if (!fs.existsSync(lugar)) {
                    fs.mkdirSync(lugar);
                }
                cb(null, lugar)
            }
        });

        let upZip = multer({ //multer settings
            storage: stor
        }).single('zip');

        upZip(req, res, function(err) {
            if (err) {
                res.json({
                    error_code: 1,
                    err_desc: err
                });
                return;
            } else {
                const pathName = req.file.originalname.toString().replace('.zip', '');
                pat = process.env.resources2 + 'datasets/' + pathName + '/' + req.file.originalname;
                unZippedPath = process.env.resources2 + 'datasets/' + pathName;
                fs.createReadStream(pat).pipe(unzipper.Extract({
                    path: unZippedPath
                }));
                let data = {
                    id: uuidv4(),
                    clientId: uuidv4(),
                    name: pathName,
                    path: unZippedPath,
                    processed: 'Yes',
                    class: 'data',
                    type: 'zip',
                    uploaded: 'Yes'
                };
                Datasets.add(data, function(err, row) {
                    if (err) return res.status(500).json(err);
                    fs.unlinkSync(pat);
                    res.status(200).json('Uploaded');
                });
            }
        })
    }
}

let getImgSize = (url) => {
    return new Promise((resolve, reject) => {
        const options = {
            url: process.env.vista_server_ip + url,
            strictSSL: false,
            headers: {
                'User-Agent': 'request-image-size'
            }
        };
        requestImageSize(options)
            .then(size =>
                resolve(size)
            )
            .catch(err =>
                reject(err)
            );
    })
}
let processByVista = (name) => {
    let directory = process.env.resources2 + 'datasets/' + name;
    return new Promise((resolve, reject) => {
        try {
            let readDir = fs.readdirSync(directory);
            const promises = readDir.map(imageName => {
                let path = directory + '/' + imageName;
                let options = {
                    'method': 'POST',
                    'url': process.env.vista_server_ip + '/api/v1/sync',
                    'strictSSL': false,
                    'headers': {
                        'Authorization': process.env.authorization
                    },
                    formData: {
                        'upload': {
                            'value': fs.createReadStream(path),
                            'options': {
                                'filename': path,
                                'contentType': null
                            }
                        },
                        'subscriptions': 'Object,themes,food,tags,face,fashion'
                    }
                };
                return rp(options);
            });
            let rm = [];
            let count = 0;
            Promise.all(promises).then(async(data) => {
                for (const element of data) {
                    let itm = JSON.parse(element);
                    itm.id = count;
                    let size = await getImgSize(itm.image);
                    itm.width = size.width;
                    itm.height = size.height;
                    itm.image = process.env.vista_server_ip + itm.image
                    rm.push(itm);
                    ++count;
                };
                resolve(rm);
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    })
}

let table = {
    "Person Detection": "",
    "Clothing": "clothing_gsate",
    "Vehicles Detection": ""
}

let processByAnalytics = (name) => {
    let result = [];
    return new Promise((resolve, reject) => {
        Camera.getByName(name, function(err, cam) {
            if (err) reject(err);
            if (cam.length === 0) resolve('Camera does not exists.')
            Relations.getRels(cam[0].id, function(err, rows) {
                if (rows.length > 0) {
                    rows.forEach(async element => {
                        let data = {
                            table: table[element.algo_name],
                            id: cam.id
                        }
                        await Algorithms.fetchAlgoData(data, function(err, response) {
                            result.push(response);
                        });
                    });

                } else {
                    resolve([]);
                }
            });
        });
    })
}

module.exports = Dataset;