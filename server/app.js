const express = require('express');
const app = express();
const request = require('request');
const https = require('https');
const rp = require('request-promise');
const fs = require('fs');
const Faces = require('./routes/Faces');
const Faces2 = require('./routes/Faces2');
const Faces3 = require('./routes/Faces3');
const Images = require('./routes/Images');
const Users = require('./routes/Users');
const Cameras = require('./routes/Cameras');
const hm = require('./routes/Heatmap');
const schedule = require('./routes/Schedule');
const Algorithm = require('./routes/Algorithms');
const Datasets = require('./routes/Dataset');
const Video = require('./routes/Video');
const Relations = require('./routes/Relations');
const Rel = require('./routes/Rel');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cp = require('child_process');
const morgan = require('morgan');
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config({
    path: './config.env'
});
const unzipper = require("unzipper");
const sizeOf = require('image-size');
//var ffmpeg = require('ffmpeg');
const moveFile = require('move-file');
const gracefulExit = require('express-graceful-exit');
const ExifImage = require('exif').ExifImage;
const ffmpeg = require('fluent-ffmpeg');
const command = ffmpeg();
const Stream = require('node-rtsp-stream');
const sharp = require('sharp');
const Annotation = require('./routes/Annotation');

app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    limit: '50mb'
}));
/* app.use(express.bodyParser({limit: '50mb'})); */
/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000
})); */
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan('Method: :method:url // Url: :remote-addr // Status::status // User-agent: :user-agent // Date: :date[web]'));


app.use(morgan('Date: :date[web] // Url: :remote-addr // Method: :method:url // Status::status // User-agent: :user-agent', {
    stream: fs.createWriteStream('./access.log', {
        flags: 'a'
    })
}));

const ports = [{
        "in": 8081,
        "out": 8082,
        "used": 0
    },
    {
        "in": 8083,
        "out": 8084,
        "used": 0
    },
    {
        "in": 8085,
        "out": 8086,
        "used": 0
    },
    {
        "in": 8087,
        "out": 8088,
        "used": 0
    },
    {
        "in": 8089,
        "out": 8090,
        "used": 0
    }
]


app.use('/api/face', Faces);
app.use('/api/count', Faces2);
app.use('/api/emotion', Faces3);
app.use('/api/images', Images);
app.use('/api/users', Users);
app.use('/api/cameras', Cameras);
app.use('/api/hm', hm);
app.use('/api/schedule', schedule);
app.use('/api/algorithm', Algorithm);
app.use('/api/datasets', Datasets);
app.use('/api/video', Video);
app.use('/api/relations', Relations);
app.use('/api/rel', Rel);
app.use('/api/annotations', Annotation);

/** Serving from the same express Server
No cors required */

const options = {
    quality: 85
}

var frPicPath;
var streams = [];

process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise)
    console.log(' The error was: ', error)
})

process.on('uncaughtException', function(err, promise) {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise)
    console.log(' The error was: ', err)
})

app.use(express.static('../client'));
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        frPicPath = file.originalname.toString().split('_');
        if (!fs.existsSync(process.env.resources + frPicPath[0])) {
            fs.mkdirSync(process.env.resources + frPicPath[0]);
        }
        cb(null, process.env.resources + frPicPath[0])
    },
    filename: function(req, file, cb) {
        var newName = file.originalname.toString().split('_');
        cb(null, newName[1])
            //file.originalname
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/upload/', function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        try {
            new ExifImage({
                image: process.env.resources + frPicPath[0] + '/' + frPicPath[1]
            }, function(error, exifData) {
                if (error) {
                    console.log('Error: ' + error.message);
                    res.json('no tiene exif')
                } else
                if (exifData.image.Orientation == 6) {
                    const form = frPicPath[1].split('.')
                    cp.exec('ffmpeg -y -i ' + process.env.resources + frPicPath[0] + '/' + form[0] + '.' + form[1] + ' -vf transpose=1 ' + process.env.resources + frPicPath[0] + '/' + form[0] + '_1.' + form[1], function(err, data) {
                        console.log('err: ', err)
                        console.log('data: ', data);
                        fs.unlink(process.env.resources + frPicPath[0] + '/' + form[0] + '.' + form[1], (err) => {
                            if (err) res.send(err);
                            res.json({
                                message: 'Successfully deleted'
                            })
                            console.log('success');
                        })
                    })
                } else {
                    res.json('success')
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
            res.json('no tiene exif')
        }

    })
});

app.get('/api/v1/operation/:id', function(req, res) {
    let id = req.params.id + '\r\n';
    request.get(`${process.env.vista_server_ip}/api/v1/operation/${id}`, function(err, response) {
        if (err) return res.error(err.message);
        return res.json(response.body);
    });
});

// Some api requires the socket as it needs to wait for a reply
/* app.get('/api/send/', function(req, res, err){
         cp.exec('../multicamera/TRAIN.sh', function(err,data){
             console.log('err: ',err)
             console.log('data: ',data);  
             res.send("success") 
         })
 });*/

app.get('/api/turnOn/', function(req, res, err) {
    cp.exec('node algo_server/app.js', function(err, data) {
        if (err) {
            console.log(err)
        }
        if (data) {
            console.log(data)
        }
    })
    res.send("turning on")
});

app.get('/api/send/', function(req, res, err) {
    var spawn = require('child_process').spawn;
    const trigger = spawn('python3', ["offline_trigger.py", "-t"]);
    trigger.stdout.on('data', (data) => { // calling the stdout.on function with res.send as callback function
        res.send(data) //data will be training_complete and it is synchronous meaning application will have to wait for msg to be sent
    })
});

let saveImg = function(uri, filePath, callback) {
    try {
        let options = {
            'url': uri,
            'strictSSL': false,
        }
        request.head(options, function(err, res, body) {
            request(options).pipe(fs.createWriteStream(filePath)).on('close', function() {
                callback();
            });
        });
    } catch (err) {
        console.log('Error>>>>>>>>>', err);
    }
};

app.post('/api/general/object/detection', function(req, res) {
    let data = req.body;
    let image = data.img;
    let details = data.details;
    console.log('details >>>>>>>>>>>>>>>>>>>>>>', image);
    let xx = image.split('/')[5];
    let yy = xx.split('.')[1];
    let zz = xx.split('_');
    zz = xx.split('-');
    zz.splice(zz.length-1, 1);
    let imgName = zz.join('_') + '.' + yy;
    let dir = './objdet/darknet/data/' + imgName;
    console.log('dir>>>>>>>>', dir);
    saveImg(image, dir, function(err, data) {
        cp.exec(`cd ./objdet/darknet && ./darknet detector test cfg/combine9k.data cfg/objdet.cfg ../general-objdet-weights/objdet.weights data/${imgName}`, function(err, data) {
            if (err) {
                console.log('Error : ', err);
                res.json(err);
            } else {
                console.log('type of data>>>>>>>>', typeof(data));
                console.log('data>>>>>>>>>>>>>>', data);
                let result = [];
                let single = [];
                
                console.log('data splitted >>>>>>>>>>>', data.split('\n'));
                data.split('\n').forEach(ele => {
                    if(ele.includes('Predicted in') || ele == '') {
                        console.log('element >>>>>>>>>>>>', ele);
                    } else {
                        let itm = ele.trim().split(" ");
                        console.log('single image ? ', data.singleImage);
                        if(data.singleImage) {
                            console.log('in if');
                            let obj1 = {
                                'x': itm[0],
                                'y': itm[1]
                            }
                            single.push(obj1);
                            let obj2 = {
                                'x': itm[2],
                                'y': itm[3]
                            }
                            single.push(obj2);
                            let obj3 = {
                                'label': ''
                            }
                            single.push(obj3);
                            let obj4 = {
                                'general_detection': 'Yes'
                            }
                            single.push(obj4);
                            result.push(single);
                            single = [];
                        } else {
                            console.log('in else');
                            let obj1 = {
                                'x': itm[0] * details.width / details.res_width,
                                'y': itm[1] * details.height / details.res_height
                            }
                            single.push(obj1);
                            let obj2 = {
                                'x': itm[2] * details.width / details.res_width,
                                'y': itm[3] * details.height / details.res_height
                            }
                            single.push(obj2);
                            let obj3 = {
                                'label': ''
                            }
                            single.push(obj3);
                            let obj4 = {
                                'general_detection': 'Yes'
                            }
                            single.push(obj4);
                            result.push(single);
                            single = [];
                        }   
                    }
                });
                res.json(result);
            }
        });
    });
    /* let str = `92 169 273 384
                        175 37 269 168`; */
/*     let result = [];
    let single = [];
    if(data.singleImage) {
        let obj1 = {
            'x': 92,
            'y': 169
        }
        single.push(obj1);
        let obj2 = {
            'x': 273,
            'y': 384
        }
        single.push(obj2);
        let obj3 = {
            'label': 'jug'
        }
        single.push(obj3);
        let obj4 = {
            'general_detection': 'Yes'
        }
        single.push(obj4);
        result.push(single);
        single = [];
        let obj5 = {
            'x': 175,
            'y': 37
        }
        single.push(obj5);
        let obj6 = {
            'x': 269,
            'y': 168
        }
        single.push(obj6);
        let obj7 = {
            'label': 'jug'
        }
        single.push(obj7);
        let obj8 = {
            'general_detection': 'Yes'
        }
        single.push(obj8);  
    
        result.push(single);
    } else {
        let obj1 = {
            'x': 92 * details.width / details.res_width,
            'y': 169 * details.height / details.res_height
        }
        single.push(obj1);
        let obj2 = {
            'x': 273 * details.width / details.res_width,
            'y': 384 * details.height / details.res_height
        }
        single.push(obj2);
        let obj3 = {
            'label': 'jug'
        }
        single.push(obj3);
        let obj4 = {
            'general_detection': 'Yes'
        }
        single.push(obj4);
        result.push(single);
        single = [];
        let obj5 = {
            'x': 175 * details.width / details.res_width,
            'y': 37 * details.height / details.res_height
        }
        single.push(obj5);
        let obj6 = {
            'x': 269 * details.width / details.res_width,
            'y': 168 * details.height / details.res_height
        }
        single.push(obj6);
        let obj7 = {
            'label': 'jug'
        }
        single.push(obj7);
        let obj8 = {
            'general_detection': 'Yes'
        }
        single.push(obj8);
    
        result.push(single);
    }
    res.json(result); */
    /* cp.exec(`cd ./objdet/darknet && ./darknet detector test cfg/combine9k.data cfg/objdet.cfg ../general-objdet-weights/objdet.weights data/${imageName}`, function(err, data) {
        if (err) {
            console.log('Error : ', err);
            res.json(err);
        } else {
            console.log('type of data>>>>>>>>', typeof(data));
            console.log('data>>>>>>>>>>>>>>', data);
            let result = {
                
            }
            res.json(data);
        }
    }); */
});


app.get('/api/stopfr/', function(req, res, err) {
    cp.exec('bash stop.sh ' + process.env.passServer, function(err, data) {
        console.log('err: ', err)
        console.log('data: ', data);
        res.send("success")
    })
});

app.get('/api/cameraImages/:camera_id', function(req, res, err) {
    const camID = req.params.camera_id;
    if (camID == 'all') {
        cp.exec('python heatmap.py --ip ' + process.env.host + '--user ' + process.env.user + ' --pwd ' + process.env.password, function(err, data) {
            console.log('error: ', err);
            console.log('data: ', data);
            res.send('Executed!')
        })
    } else {
        cp.exec('python heatmap.py --host ' + process.env.host + ' --ip ' + process.env.my_ip + ' --user ' + process.env.user + ' --pwd ' + process.env.password + ' --db ' + process.env.database + ' --path ' + process.env.resources2 + ' --cameraid ' + camID, function(err, data) {
            console.log('error: ', err);
            console.log('data: ', data);
            res.send('Ex')
        })
    }
});


const documents = {};
io.sockets.setMaxListeners(3);
io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
    };

    socket.on("getDoc", docId => {
        safeJoin(docId);
        socket.emit("document", documents[docId]);
    });

    socket.on("delDoc", docId => {
        for (doc in documents) {
            if (doc == docId) {
                delete documents[doc];
                io.emit("documents", Object.keys(documents));
            }
        }
    });

    io.on('connection', function(socket) {
        console.log('a user connected');
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });

    socket.on("wenaMax", message => {
        console.log(message);
    }, function(res) {
        res('chupadla')
    });

    socket.on("addDoc", doc => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
    });

    io.emit("documents", Object.keys(documents));
});


app.delete('/api/delete/:user_id/:imageName', (req, res, err) => {
    fs.unlink(process.env.resources + req.params.user_id + '/' + req.params.imageName, (err) => {
        if (err) res.send(err);
        res.json({
            message: 'Successfully deleted'
        })
        console.log('deleted');
    })
})

app.delete('/api/deleteSome/:user_id/', (req, res, err) => {
    const pics = req.body;
    for (let i = 0; i < pics.length; i++) {
        fs.unlink(process.env.resources + req.params.user_id + '/' + pics[i], (err) => {
            if (err) res.send(err);
        })
    }
    res.json({
        message: 'Successfully deleted some pictures'
    })
})

app.delete('/api/delAll/:user_id', (req, res, err) => {
    if (fs.existsSync(process.env.resources + req.params.user_id)) {
        fs.rmdir(process.env.resources + req.params.user_id, {
            recursive: true
        }, (err) => {
            if (err) {
                res.send(err)
            } else {
                res.json({
                    message: 'Successfully deleted folder'
                })
            }
        })
    } else {
        res.json('It never existed')
    }
})

app.use(express.static('../client'));
/* var stor = multer.diskStorage({ //multers disk storage settings
    filename: function (req, file, cb) {
        var newName = file.originalname.toString()
        cb(null, newName)
        //file.originalname
    },
    destination: function (req, file, cb) {
        const pathName = file.originalname.toString().replace('.zip', '');
        var lugar = process.env.resources2 + 'datasets/temp-' + pathName;
        if (!fs.existsSync(lugar)) {
            fs.mkdirSync(lugar);
        }
        cb(null, lugar)
    }
}); */

/* let resizeImages = (unTempZippedPath, unZippedPath) => {
    return new Promise((resolve, reject) => {
        let dir = fs.readdirSync(unTempZippedPath);
        console.log('dir>>>>>>>>>>>>>>', dir);
        dir.forEach(ele => {
            path = unTempZippedPath + '/' + ele;
            console.log('path>>>>>>>>>>>>>', path);
            resizePath = unZippedPath + '/' + ele;
            console.log('resizePath>>>>>>>>>>>>>', resizePath);
            sharp(path).resize(365, 205).toFile(resizePath, function (err) {
                if (err) {
                    console.log('Error : ', err);
                    //res.status(500).json({success:false, message: err.message});
                }
            });
        });
        resolve();
    }, 3000);
} */

/* var upZip = multer({ //multer settings
    storage: stor
}).single('zip'); */
/** API path that will upload the files */
/* app.post('/api/upZip/', function (req, res, next) {
    upZip(req, res, function (err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        } else {
            const pathName = req.file.originalname.toString().replace('.zip', '');
            pat = process.env.resources2 + 'datasets/temp-' + pathName + '/' + req.file.originalname;
            unTempZippedPath = process.env.resources2 + 'datasets/temp-' + pathName;
            unZippedPath = process.env.resources2 + 'datasets/' + pathName;
            fs.createReadStream(pat).pipe(unzipper.Extract({
                path: unTempZippedPath
            }));


            fs.unlinkSync(pat);
            setTimeout(async () => {
                if (!fs.existsSync(unZippedPath)) {
                    fs.mkdirSync(unZippedPath);
                }
                console.log('unTempZippedPath>>>>>>>>>>>>>>', unTempZippedPath);
                await resizeImages(unTempZippedPath, unZippedPath);
                setTimeout(() => {
                    let tempDir = fs.readdirSync(unTempZippedPath);
                    tempDir.forEach(file => {
                        fs.unlinkSync(unTempZippedPath + '/' + file);
                    });
                    fs.rmdirSync(unTempZippedPath);
                }, 2000);
                
                //fs.unlinkSync(pat)
                fs.unlink(pat, function() {
                    console.log('unZippedPath>>>>>>>>>>>>>>', unZippedPath);
                    let dir = fs.readdirSync(unZippedPath);
                    console.log('dir>>>>>>>>>>>>>>', dir)
                })
            }, 3000);
           //fs.unlinkSync(unTempZippedPath);
            res.json('Uploaded');
        }
    });
}) */


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('photo');

app.post('/api/upload/pic', function(req, res, next) {
    let path = '';
    let resizePath = '';
    upload(req, res, function(err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        // No error occured.
        path = req.file.path;
        let datetimestamp = Date.now();
        resizePath = `./uploads/photo-${datetimestamp}.jpg`;
        sharp(path).resize(710, 480).toFile(resizePath, function(err) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            } else {
                processImage(resizePath, path, res);
            }
        });
        //return res.send("Upload Completed for " + path);
    });
});

var processImage = (imgPath, path, res) => {
    try {
        var options = {
            'method': 'POST',
            'url': process.env.vista_server_ip + '/api/v1/sync',
            'strictSSL': false,
            'headers': {
                'Authorization': 'Basic cGVydW1hbDpHTVRDNHBlcnVtYWwx'
            },
            formData: {
                'upload': {
                    'value': fs.createReadStream(imgPath),
                    'options': {
                        'filename': imgPath,
                        'contentType': null
                    }
                },
                'subscriptions': 'Object,themes,food,tags,face,fashion'
            }
        };
        request(options, function(error, response) {
            if (error) {
                console.log('error.............', error);
                return res.status(500).json(error.message);
            }
            fs.unlinkSync(path);
            return res.json(response.body);
        });
    } catch (err) {
        res.send(err);
    }
}

app.get('/api/search/:keyword', async function(req, res) {
    let result = [];
    let count = 150;
    let offset = 0;
    let totalMatches = 0;
    let keyword = req.params.keyword;
    try {
        let resp = await searchImages(keyword, count, offset);
        console.log('Total Estimated Matches>>>>>>>>>>>>>>>>', resp.totalEstimatedMatches);
        result.push(resp.value);
        totalMatches = resp.totalEstimatedMatches;
        for (let i = count; i < totalMatches; i) {
            offset = count + offset;
            if (offset > totalMatches) {
                break;
            }
            //console.log('offset>>>>>>>>>>>>>>>>', offset);
            resp = await searchImages(keyword, count, offset);
            result.push(resp.value);
            i = offset;
        }
        let resu = [].concat(...result);
        res.status(200).json(resu);
    } catch (err) {
        console.log('error>>>>>>>>>>>>.', err);
        res.status(500).json(err.message);
    }
})

function searchImages(keyword, count, offset) {
    let result = [];
    return new Promise(async(resolve, reject) => {
        try {
            let request_params = {
                method: 'GET',
                hostname: process.env.binghost,
                path: process.env.bingPath + '?q=' + encodeURIComponent(keyword) + `&count=${count}&offset=${offset}`,
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.subscriptionKey,
                }
            };
            let response_handler = function(response) {
                let body = '';
                response.on('data', function(d) {
                    body += d;
                });
                response.on('end', function() {
                    result = JSON.parse(body);
                    // console.log(offset , '>>>>>>>>>>>>>>>>>>>', result);
                    resolve(result);
                });
            };
            let req = await https.request(request_params, response_handler);
            req.end();
        } catch (err) {
            reject();
        }
    })
}

/* app.post('/api/images/batch/async/', function (req, res) {
    let data = req.body;
    let directory = process.env.resources2 + 'datasets/' + data.name;
    try {
        let readDir = fs.readdirSync(directory);
        const promises = readDir.map(imageName => {
            let datetimestamp = Date.now();
            let resizePath = directory + '/' + imageName.split('.')[0] + '-resize';
            sharp(`${directory}/${imageName}`).resize(365, 205).toFile(resizePath, function (err) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err.message
                    });
                } else {

                }
            })
            let options = {
                'method': 'POST',
                'url': process.env.vista_server_ip + '/api/v1/sync',
                'strictSSL': false,
                'headers': {
                    'Authorization': 'Basic cGVydW1hbDpHTVRDNHBlcnVtYWwx'
                },
                formData: {
                    'upload': {
                        'value': fs.createReadStream(resizePath),
                        'options': {
                            'filename': resizePath,
                            'contentType': null
                        }
                    },
                    'subscriptions': 'Object,themes,food,tags,face,fashion'
                }
            };
            return rp(options);
        });
        Promise.all(promises).then((data) => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).send(err.message);
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}) */

/* app.post('/api/datasets/image/search/create/', function(req, res) {
    let data = req.body;
    let images = data.images;
    let directory = process.env.resources2 + 'datasets/' + data.name;
    try {
        images.forEach(async(element, i) => {
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            let filePath = directory + '/' + 'image' + i + '.jpg';
            await save(element.contentUrl, filePath, directory, i, function() {
                console.log('Done!')
            });
        });
        res.status(200).json({
            success: true,
            message: 'Dataset created Sucessfully'
        });
    } catch (err) {
        res.status(500).json(err);
    }
})  */

/*     app.get('/api/getFolders/:which', function (req, res) {
        let arreglo = [];
        if (req.params.which == 'data') {
            var end = 'datasets'
            if (!fs.existsSync(process.env.resources2 + end)) {
                fs.mkdirSync(process.env.resources2 + end);
            }
        } else if (req.params.which == 'class') {
            var end = 'classifications'
            if (!fs.existsSync(process.env.resources2 + end)) {
                fs.mkdirSync(process.env.resources2 + end);
            }
        }
        const newStuff = process.env.resources2 + end;
        const files = fs.readdirSync(newStuff);
        for (let i = 0; i < files.length; i++) {
            const fileName = newStuff + '/' + files[i];
            const idk = files[i];
            const file = fs.statSync(fileName);
            if (file.isDirectory()) {
                arreglo.push({
                    'name': idk
                })
            }
        }
        res.json(arreglo)
    }) */

app.get('/api/classify/:path/:name/:yn', function(req, res) {
    var where_this_it = process.env.resources2 + 'classifications/' + req.params.path;
    if (JSON.stringify(req.params.path).includes('_true')) {
        where_this_it = where_this_it.replace('_true', '');
    } else if (JSON.stringify(req.params.path).includes('_false')) {
        where_this_it = where_this_it.replace('_false', '');
    }
    if (!fs.existsSync(where_this_it + '_' + req.params.yn)) {
        fs.mkdirSync(where_this_it + '_' + req.params.yn);
    }
    if (req.params.path.includes('_true')) {
        moveFile(where_this_it + '_true/' + req.params.name, where_this_it + '_' + req.params.yn + '/' + req.params.name)
        res.json('moved')
    } else if (req.params.path.includes('_false')) {
        moveFile(where_this_it + '_false/' + req.params.name, where_this_it + '_' + req.params.yn + '/' + req.params.name)
        res.json('moved')
    } else {
        moveFile(where_this_it + '/' + req.params.name, where_this_it + '_' + req.params.yn + '/' + req.params.name)
        res.json('moved')
    }
});

function getStream(camera_name, rtsp_in, port, id, tries) {
    if (tries == undefined) {
        tries = 0
    }
    return new Promise((resolve, reject) => {
        if (tries >= 3) {
            return reject()
        }
        console.log('Proando stream', port, tries, camera_name, rtsp_in)
        const stream = new Stream({
            name: 'camera_name',
            streamUrl: rtsp_in,
            height: 480,
            width: 640,
            wsPort: port,
            fps: 15,
            ffmpegOptions: {
                // options ffmpeg flags
                '-stats': '', // an option with no neccessary value uses a blank string
                '-r': 30, // options with required values specify the value after the key
                '-s': '640x480'
            }
        });

        stream.on('exitWithError', error => {
            strem.stop();
            reject(error)
        })

        let sent = false

        stream.on('camdata', data => {
            if (sent) return

            streams.push({
                stream: stream,
                id: id,
                port: port
            })
            resolve({
                stream: stream,
                port: port
            })
            sent = true
        })

        stream.on('connection', () => {
            console.log('=====================================================================')
        })
    })
}

app.post('/api/StartWsStreaming/', function(req, res) {
    let body = req.body;
    let port = 9999;
    port = port - streams.length;
    stream = getStream(body.camera_name, body.rtsp_in, port, body.id)
        .then(stream => {
            res.status(200).send({
                success: true,
                my_ip: process.env.my_ip,
                port: stream.port,
                stream
            })
        })
        .catch(err => {
            if (stream && stream.stop) stream.stop();
            console.log('error............', err);
            res.status(500).send({
                success: false,
                message: err
            })
        })
})

app.post('/api/StopWsStreaming/', function(req, res) {
    stopCam = (req, res) => {
        const data = req.body;
        for (let i = 0; i < streams.length; i++) {
            if (streams[i].id == data.id) {
                streams[i].str.stop()
                streams.splice(i, 1)
                    //continue;
            }
        }
        res.status(200).send({
            success: true,
            message: 'Stopped'
        })
    }
})

async function f(where) {
    streamWebCam = cp.exec('bash rtsp_webcam.sh', function(err, data) {
        console.log('err: ', err)
        console.log('data: ', data);

    });
    pidWeb = streamWebCam.pid + 1;

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    ffmpeg_child = cp.exec('ffmpeg -i ' + rtsp + ' -f mpegts -codec:v mpeg1video -b:v 800k -r 25 http://localhost:' + where + '/yoursecret', function(err, data) {
        console.log('err: ', err)
        console.log('data: ', data);
    })
    console.log('yapo')
    FFMPEG_PID = ffmpeg_child.pid + 1;
}


let FFMPEG_PID = 0;
var pidWeb = 0;
app.get('/api/FeedWsStreaming/:port/:rtsp', function(req, res) {
    rtsp = req.params.rtsp.split(' ').join('/');
    let listen = req.params.port;
    ffmpeg_child = cp.exec('ffmpeg -i ' + rtsp + ' -f mpegts -codec:v mpeg1video -b:v 800k -r 25 http://localhost:' + listen + '/yoursecret', function(err, data) {
        console.log('err: ', err)
        console.log('data: ', data);
    })
    FFMPEG_PID = ffmpeg_child.pid + 1;
    res.json(FFMPEG_PID)
});

app.get('/api/getPorts', function(req, res) {
    res.json(ports)
})


app.get('/api/StartWsStreaming/', function(req, res) {
    let listen, portUsed, num;
    for (let a = 0; a < ports.length; a++) {
        if (ports[a].used == 0) {
            listen = ports[a].in;
            ports[a].used = 1;
            portUsed = ports[a].out;
            a = ports.length;
            ws_child = cp.exec('node websocket-relay.js yoursecret ' + listen + ' ' + portUsed, function(err, data) {
                console.log('err: ', err)
                console.log('data: ', data);
            })
            num = ws_child.pid + 1;
            res.json({
                "pid": num,
                "portL": listen,
                "portW": portUsed
            })
        } else if (ports[a].used == 1 && a == ports.length - 1) {
            res.json('ports full')
        }
    }
});

app.get('/api/KillWsStreaming/:pid/:port/:server', function(req, res) {
    if (req.params.server == 'true') {
        for (let a = 0; a < ports.length; a++) {
            if (req.params.port == ports[a].out) {
                ports[a].used = 0;
            }
        }
    }
    if (process.platform == "win32") {
        cp.exec('taskkill /PID ' + req.params.pid + ' /F', function(err, data) {
            console.log('err: ', err)
            console.log('data: ', data);
        })
        res.json('FFMPEG killed ' + req.params.pid)
    } else {
        cp.exec('kill ' + req.params.pid, function(err, data) {
            console.log('err: ', err)
            console.log('data: ', data);
        })
        if (pidWeb != 0) {
            cp.exec('kill ' + pidWeb, function(err, data) {
                console.log('err: ', err)
                console.log('data: ', data);
            })
        }
        res.json('FFMPEG killed ' + req.params.pid)
    }
});

app.get('/api/readAnn/:path', function(req, res) {
    const nameAnn = req.params.path.split(' ');
    if (nameAnn[1].includes('.jpg')) {
        nameAnn[1] = nameAnn[1].replace('.jpg', '');
    } else if (nameAnn[1].includes('.png')) {
        nameAnn[1] = nameAnn[1].replace('.png', '');
    } else if (nameAnn[1].includes('.JPG')) {
        nameAnn[1] = nameAnn[1].replace('.JPG', '');
    } else if (nameAnn[1].includes('.jpeg')) {
        nameAnn[1] = nameAnn[1].replace('.jpeg', '');
    }
    if (nameAnn[1].includes('.PNG')) {
        nameAnn[1] = nameAnn[1].replace('.PNG', '');
    }
    const paths = process.env.resources2 + 'datasets/' + nameAnn[0] + '/' + nameAnn[1] + '.txt';
    if (fs.existsSync(paths)) {
        fs.readFile(paths, (e, data) => {
            if (e) throw e;
            console.log(data.toString());
            res.json(data.toString());
        });
    } else {
        res.json("it doesn't exists this annotation")
    }
})

app.post('/api/createAnn/:pathPic', function(req, res) {
    let annotation = JSON.stringify(req.body);
    const joinedPath = req.params.pathPic.split(' ');
    if (joinedPath[1].includes('.jpg')) {
        joinedPath[1] = joinedPath[1].replace('.jpg', '');
    } else if (joinedPath[1].includes('.png')) {
        joinedPath[1] = joinedPath[1].replace('.png', '');
    } else if (joinedPath[1].includes('.JPG')) {
        joinedPath[1] = joinedPath[1].replace('.JPG', '');
    } else if (joinedPath[1].includes('.jpeg')) {
        joinedPath[1] = joinedPath[1].replace('.jpeg', '');
    }
    if (joinedPath[1].includes('.PNG')) {
        joinedPath[1] = joinedPath[1].replace('.PNG', '');
    }
    res.json('buena');
    let writeStream = fs.createWriteStream(process.env.resources2 + 'datasets/' + joinedPath[0] + '/' + joinedPath[1] + '.txt');

    writeStream.write(annotation);
})

app.get('/api/getImages/:path/:where', function(req, res) {
    let arreglo = [];
    if (req.params.where == 'data') {
        var theEnd = 'datasets/'
    } else if (req.params.where == 'class') {
        var theEnd = 'classifications/'
    } else if (req.params.where == 'images') {
        var theEnd = 'pictures/'
    }
    // const newStuff = req.params.path.split(' ').join('/');
    const newStuff = process.env.resources2 + theEnd + req.params.path;
    const files = fs.readdirSync(newStuff);
    // Math.ceil(files.length / num)
    for (let i = 0; i < files.length; i++) {
        const fileName = newStuff + '/' + files[i];
        const idk = files[i];
        const file = fs.statSync(fileName);
        if (file.isFile()) {
            if (idk.includes('.jpg') || idk.includes('.png') || idk.includes('.JPG') || idk.includes('.jpeg') || idk.includes('.PNG')) {
                let dimension = sizeOf(newStuff + '/' + idk)
                arreglo.push({
                    'name': idk,
                    'width': dimension.width,
                    'height': dimension.height
                })
            }
        }
    }
    // if(files.length > 0){
    //     arreglo.push({'total':files.length})
    // }
    res.json(arreglo)
})


app.get('/api/writeLabel/:label', function(req, res) {
    var theThing = req.params.label + '\r\n';
    fs.createWriteStream(process.env.resources2 + 'labels.txt', {
        flags: 'a'
    }).write(theThing);
    res.json('listoque');
});


app.get('/api/readStatus/:mod', function(req, res, err) {
    const statusFr = process.env.resources2 + 'statusFr.json';
    if (req.params.mod == 0) {
        if (!fs.existsSync(statusFr)) {
            fs.createWriteStream(statusFr).write('{"fr":0}');
            fs.readFile(statusFr, (e, data) => {
                if (e) throw e;
                const yapo = JSON.parse(data);
                res.json(yapo.fr);
            });
        } else {
            fs.readFile(statusFr, (e, data) => {
                if (e) throw e;
                const yapo = JSON.parse(data);
                res.json(yapo.fr);
            });
        }
    } else if (req.params.mod == 1) {
        fs.readFile(statusFr, (e, data) => {
            if (e) throw e;
            const dat = JSON.parse(data)
            if (dat.fr == 0) {
                dat.fr = 1;
            } else if (dat.fr == 2) {
                dat.fr = 3;
                setTimeout(() => {
                    dat.fr = 0;
                    fs.createWriteStream(statusFr).write(JSON.stringify(dat));
                }, 8000)
            }
            fs.createWriteStream(statusFr).write(JSON.stringify(dat));
            res.json(dat.fr);
        });
    }
});

app.get('/api/readLabels/', function(req, res) {
    fs.readFile(process.env.resources2 + 'labels.txt', (e, data) => {
        if (e) throw e;
        console.log(data.toString());
        res.json(data.toString());
    });
});

app.post('/api/getInfo/', function(req, res, next) {
    let writeStream = fs.createWriteStream('./access.log', {
        flags: 'a'
    });
    if (req.body.ip != undefined) {
        var ip = req.body.ip;
        var logged = ip + ' logged at: ' + Date(Date.now()).toString() + '\r\n'
    } else if (req.body.ip == undefined) {
        var os = req.body.os,
            browser = req.body.browser,
            device = req.body.device,
            width = req.body.width,
            height = req.body.height;
        var logged = 'Info: ' + '\r\n' + '-Os: ' + os + '\r\n' + '-Browser: ' + browser + '\r\n' + '-Device: ' + device + '\r\n' + '-Width of window: ' + width + '\r\n' + '-Height of window: ' + height + '\r\n';
    }
    writeStream.write(logged);
    res.json('buena');
});

let server = app.listen(process.env.server, process.env.my_ip, function() {
    let writeStream = fs.createWriteStream('./access.log', {
        flags: 'a'
    });
    var a = 'Server started at: ' + Date(Date.now()).toString() + '\r\n' + 'From: ' + process.env.my_ip + '\r\n' + 'Using port ' + process.env.server + ' for server and ' + process.env.io + ' for socket. \r\n';
    writeStream.write(a);
    console.log(Date(Date.now()).toString());
    console.log('IP: ' + process.env.my_ip)
    console.log('running on ' + process.env.server + '...');
});
http.listen(process.env.io, function() {
    console.log('Running ' + process.env.io + ' for socket...')
});

messOff = function() {
    console.log('shutting off')
}

app.get('/api/turnOff', function(req, res) {
    gracefulExit.gracefulExitHandler(app, server, {
        log: true,
        callback: messOff()
    });
    res.json('turned Off')
});

module.exports = app