    var express = require('express');
    var app = express();
    var request = require('request');
    var fs = require('fs');
    var fs = require('fs');
    var Faces = require('./routes/Faces');
    var Faces2 = require('./routes/Faces2');
    var Faces3 = require('./routes/Faces3');
    var Images = require('./routes/Images');
    var Users = require('./routes/Users');
    var Cameras = require('./routes/Cameras');
    var hm = require('./routes/Heatmap');
    var schedule = require('./routes/Schedule');
    var Algorithm = require('./routes/Algorithms');
    var Relations = require('./routes/Relations');
    var Rel = require('./routes/Rel');
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var cookieParser = require('cookie-parser');
    var cp = require('child_process');
    var morgan = require('morgan');
    const http = require('http').Server(app);
    const io = require('socket.io')(http);
    require('dotenv').config({
        path: './config.env'
    });
    var unzipper = require("unzipper");
    var sizeOf = require('image-size');
    var ffmpeg = require('ffmpeg');
    const moveFile = require('move-file');
    var gracefulExit = require('express-graceful-exit');
    var ExifImage = require('exif').ExifImage;


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(function (req, res, next) {
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
    app.use('/api/relations', Relations);
    app.use('/api/rel', Rel);

    /** Serving from the same express Server
    No cors required */

    const options = {
        quality: 85
    }

    var frPicPath;

    app.use(express.static('../client'));
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            frPicPath = file.originalname.toString().split('_');
            if (!fs.existsSync(process.env.resources + frPicPath[0])) {
                fs.mkdirSync(process.env.resources + frPicPath[0]);
            }
            cb(null, process.env.resources + frPicPath[0])
        },
        filename: function (req, file, cb) {
            var newName = file.originalname.toString().split('_');
            cb(null, newName[1])
            //file.originalname
        }
    });
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');
    /** API path that will upload the files */
    app.post('/upload/', function (req, res, next) {
        upload(req, res, function (err) {
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
                }, function (error, exifData) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        res.json('no tiene exif')
                    } else
                    if (exifData.image.Orientation == 6) {
                        const form = frPicPath[1].split('.')
                        cp.exec('ffmpeg -y -i ' + process.env.resources + frPicPath[0] + '/' + form[0] + '.' + form[1] + ' -vf transpose=1 ' + process.env.resources + frPicPath[0] + '/' + form[0] + '_1.' + form[1], function (err, data) {
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

    // Some api requires the socket as it needs to wait for a reply
    /* app.get('/api/send/', function(req, res, err){
             cp.exec('../multicamera/TRAIN.sh', function(err,data){
                 console.log('err: ',err)
                 console.log('data: ',data);  
                 res.send("success") 
             })
     });*/

    app.get('/api/turnOn/', function (req, res, err) {
        cp.exec('node algo_server/app.js', function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {
                console.log(data)
            }
        })
        res.send("turning on")
    });

    app.get('/api/send/', function (req, res, err) {
        var spawn = require('child_process').spawn;
        const trigger = spawn('python3', ["offline_trigger.py", "-t"]);
        trigger.stdout.on('data', (data) => { // calling the stdout.on function with res.send as callback function
            res.send(data) //data will be training_complete and it is synchronous meaning application will have to wait for msg to be sent
        })
    });


    app.get('/api/stopfr/', function (req, res, err) {
        cp.exec('bash stop.sh ' + process.env.passServer, function (err, data) {
            console.log('err: ', err)
            console.log('data: ', data);
            res.send("success")
        })
    });

    app.get('/api/cameraImages/:camera_id', function (req, res, err) {
        const camID = req.params.camera_id;
        if (camID == 'all') {
            cp.exec('python heatmap.py --ip ' + process.env.host + '--user ' + process.env.user + ' --pwd ' + process.env.password, function (err, data) {
                console.log('error: ', err);
                console.log('data: ', data);
                res.send('Executed!')
            })
        } else {
            cp.exec('python heatmap.py --host ' + process.env.host + ' --ip ' + process.env.my_ip + ' --user ' + process.env.user + ' --pwd ' + process.env.password + ' --db ' + process.env.database + ' --path ' + process.env.resources2 + ' --cameraid ' + camID, function (err, data) {
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

        io.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });

        socket.on("wenaMax", message => {
            console.log(message);
        }, function (res) {
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
    var stor = multer.diskStorage({ //multers disk storage settings
        filename: function (req, file, cb) {
            var newName = file.originalname.toString()
            cb(null, newName)
            //file.originalname
        },
        destination: function (req, file, cb) {
            const pathName = file.originalname.toString().replace('.zip', '');
            var lugar = process.env.resources2 + 'datasets/' + pathName;
            if (!fs.existsSync(lugar)) {
                fs.mkdirSync(lugar);
            }
            cb(null, lugar)
        }
    });
    var upZip = multer({ //multer settings
        storage: stor
    }).single('zip');
    /** API path that will upload the files */
    app.post('/api/upZip/', function (req, res, next) {
        upZip(req, res, function (err) {
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
                }))
                fs.unlinkSync(pat)
                res.json('Uploaded');
            }
        })
    });

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });

    var upload = multer({ //multer settings
        storage: storage
    }).single('photo');

    app.post('/api/upload/pic', function (req, res, next) {
        var path = '';
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                console.log(err);
                return res.status(422).send("an Error occured")
            }
            // No error occured.
            console.log('this is imp >>>>>>>>>>>>>>>>>>>', req.file)
            path = req.file.path;
            processImage(path, res);
            //return res.send("Upload Completed for " + path);
        });
    });

    var processImage = (imgPath, res) => {
        try {
            var options = {
                'method': 'POST',
                'url': 'https://ec2-54-152-186-179.compute-1.amazonaws.com/api/v1/sync',
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
            request(options, function (error, response) {
                if (error) {
                    console.log('error.............', error);
                    throw new Error(error);
                }
                console.log(response.body);
                return res.json(response.body);
            });
        } catch(err) {
            res.send(err);
        }
    }

    app.get('/api/getFolders/:which', function (req, res) {
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
    })

    app.get('/api/classify/:path/:name/:yn', function (req, res) {
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

    async function f(where) {
        streamWebCam = cp.exec('bash rtsp_webcam.sh', function (err, data) {
            console.log('err: ', err)
            console.log('data: ', data);

        });
        pidWeb = streamWebCam.pid + 1;

        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        ffmpeg_child = cp.exec('ffmpeg -i ' + rtsp + ' -f mpegts -codec:v mpeg1video -b:v 800k -r 25 http://localhost:' + where + '/yoursecret', function (err, data) {
            console.log('err: ', err)
            console.log('data: ', data);
        })
        console.log('yapo')
        FFMPEG_PID = ffmpeg_child.pid + 1;
    }


    let FFMPEG_PID = 0;
    var pidWeb = 0;
    app.get('/api/FeedWsStreaming/:port/:rtsp', function (req, res) {
        rtsp = req.params.rtsp.split(' ').join('/');
        let listen = req.params.port;
        ffmpeg_child = cp.exec('ffmpeg -i ' + rtsp + ' -f mpegts -codec:v mpeg1video -b:v 800k -r 25 http://localhost:' + listen + '/yoursecret', function (err, data) {
            console.log('err: ', err)
            console.log('data: ', data);
        })
        FFMPEG_PID = ffmpeg_child.pid + 1;
        res.json(FFMPEG_PID)
    });

    app.get('/api/getPorts', function (req, res) {
        res.json(ports)
    })


    app.get('/api/StartWsStreaming/', function (req, res) {
        let listen, portUsed, num;
        for (let a = 0; a < ports.length; a++) {
            if (ports[a].used == 0) {
                listen = ports[a].in;
                ports[a].used = 1;
                portUsed = ports[a].out;
                a = ports.length;
                ws_child = cp.exec('node websocket-relay.js yoursecret ' + listen + ' ' + portUsed, function (err, data) {
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

    app.get('/api/KillWsStreaming/:pid/:port/:server', function (req, res) {
        if (req.params.server == 'true') {
            for (let a = 0; a < ports.length; a++) {
                if (req.params.port == ports[a].out) {
                    ports[a].used = 0;
                }
            }
        }
        if (process.platform == "win32") {
            cp.exec('taskkill /PID ' + req.params.pid + ' /F', function (err, data) {
                console.log('err: ', err)
                console.log('data: ', data);
            })
            res.json('FFMPEG killed ' + req.params.pid)
        } else {
            cp.exec('kill ' + req.params.pid, function (err, data) {
                console.log('err: ', err)
                console.log('data: ', data);
            })
            if (pidWeb != 0) {
                cp.exec('kill ' + pidWeb, function (err, data) {
                    console.log('err: ', err)
                    console.log('data: ', data);
                })
            }
            res.json('FFMPEG killed ' + req.params.pid)
        }
    });

    app.post('/api/cortarFrames', function (req, res) {
        const setVid = req.body;
        if (setVid.name.includes('.mov')) {
            setVid.name = setVid.name.replace('.mov', '');
            setVid.format = '.mov';
        }
        try {
            var process = new ffmpeg(process.env.resources2 + 'recordings/' + setVid.name + setVid.format);
            process.then(function (video) {
                // Callback mode
                var direction = process.env.resources2 + 'datasets/' + setVid.name;
                if (!fs.existsSync(direction)) {
                    fs.mkdirSync(direction);
                }
                video.fnExtractFrameToJPG(direction, {
                    start_time: setVid.ss,
                    duration_time: setVid.t,
                    frame_rate: setVid.fps,
                    // file_name        : 'my_frame_%t_%s'
                }, function (error, files) {
                    if (!error)
                        console.log('Frames: ' + files);
                });
            }, function (err) {
                console.log('Error: ' + err);
            }).then((files) => {
                res.json('buena qlo')
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    })

    app.get('/api/readAnn/:path', function (req, res) {
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

    app.post('/api/createAnn/:pathPic', function (req, res) {
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

    app.get('/api/getImages/:path/:where', function (req, res) {
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


    app.get('/api/writeLabel/:label', function (req, res) {
        var theThing = req.params.label + '\r\n';
        fs.createWriteStream(process.env.resources2 + 'labels.txt', {
            flags: 'a'
        }).write(theThing);
        res.json('listoque');
    });


    app.get('/api/readStatus/:mod', function (req, res, err) {
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

    app.get('/api/readLabels/', function (req, res) {
        fs.readFile(process.env.resources2 + 'labels.txt', (e, data) => {
            if (e) throw e;
            console.log(data.toString());
            res.json(data.toString());
        });
    });

    app.post('/api/getInfo/', function (req, res, next) {
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

    let server = app.listen(process.env.server, process.env.my_ip, function () {
        let writeStream = fs.createWriteStream('./access.log', {
            flags: 'a'
        });
        var a = 'Server started at: ' + Date(Date.now()).toString() + '\r\n' + 'From: ' + process.env.my_ip + '\r\n' + 'Using port ' + process.env.server + ' for server and ' + process.env.io + ' for socket. \r\n';
        writeStream.write(a);
        console.log(Date(Date.now()).toString());
        console.log('IP: ' + process.env.my_ip)
        console.log('running on ' + process.env.server + '...');
    });
    http.listen(process.env.io, function () {
        console.log('Running ' + process.env.io + ' for socket...')
    });

    messOff = function () {
        console.log('shutting off')
    }

    app.get('/api/turnOff', function (req, res) {
        gracefulExit.gracefulExitHandler(app, server, {
            log: true,
            callback: messOff()
        });
        res.json('turned Off')
    });

    module.exports = app