const fs = require("fs");
const junk = require("junk");
const rp = require("request-promise");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sizeOf = require("image-size");
const unzipper = require("unzipper");
const ffmpeg = require("fluent-ffmpeg");
const Camera = require("../models/Camera");
const del = require("del");
const Datasets = require("../models/Dataset");
const child_process = require("child_process");
const Relations = require("../models/Relations");
const Algorithms = require("../models/Algorithms");
const requestImageSize = require("request-image-size");
const logger = require("../helpers/logger");

let Dataset = {
  processWithoutVista: async (req, res, next) => {
    let body = req.body;
    let dName = body.name;
    let method = body.method;
    if (method === "vista") {
      let directory = process.env.resources2 + "datasets/" + dName;

      try {
        let images = [];
        const readDir = await fs.readdirSync(directory).filter(junk.not);

        for (let i = 0; i < readDir.length; i++) {
          try {
            let size = await sizeOf(directory + "/" + readDir[i]);

            images.push({
              image: (directory + "/" + readDir[i]).replace(
                process.env.resources2,
                "/assets/shared-data/"
              ),
              ...size,
            });
          } catch (err) {
            logger.log("error", `${readDir[i]}: ${err}`);
            continue;
          }
        }

        return res.json(images);
      } catch (err) {
        logger.log("error", `process_api: ${err}`);
        return res.status(500).json(err);
      }
    } else {
      processByAnalytics(dName)
        .then((resp) => {
          return res.json(resp);
        })
        .catch((err) => {
          console.log("error in catch>>>>>>>>>>>>>>>", err);
        });
    }
  },
  processVistaSingleImage: async (req, res, next) => {
    /* const imgPath = req.body.image_path.replace(
      "/assets/shared-data/",
      process.env.resources2
    ); */

    const imgPath = req.body.image_path;

    const options = {
      method: "POST",
      url: process.env.vista_server_ip + "/api/v1/sync",
      strictSSL: false,
      headers: {
        Authorization: process.env.authorization,
      },
      formData: {
        upload: {
          value: fs.createReadStream(imgPath),
          options: {
            filename: imgPath,
            contentType: null,
          },
        },
        subscriptions: "Object,themes,food,tags,face,fashion",
      },
    };

    console.log(JSON.stringify(options));

    await rp(options)
      .then((response) => {
        console.log(response);
        return res.json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  },
  process: (req, res, next) => {
    let body = req.body;
    let dName = body.name;
    let method = body.method;
    if (method === "vista") {
      processByVista(dName)
        .then((resp) => {
          return res.json(resp);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    } else {
      processByAnalytics(dName)
        .then((resp) => {
          return res.json(resp);
        })
        .catch((err) => {
          console.log("error in catch>>>>>>>>>>>>>>>", err);
        });
    }
  },
  createDataset: async (req, res) => {
    const body = req.body;
    if (body.name.includes(".mov")) {
      body.name = body.name.replace(".mov", "");
      body.format = ".mov";
    }
    try {
      let directory =
        process.env.resources2 + "recordings/" + body.datasetName + ".mp4";
      let datasetDir = process.env.resources2 + "datasets/" + body.datasetName;
      let absDir =
        process.env.resources3 + "recordings/" + body.datasetName + ".mp4";
      if (!fs.existsSync(datasetDir)) {
        fs.mkdirSync(datasetDir);
      }
      let snippetId = uuidv4();
      let accId = uuidv4();
      let cam_id = body.cam_id;
      let datasetName = body.datasetName;
      let promise1 = new Promise((resolve, reject) => {
        ffmpeg(body.stream)
          .format("mp4")
          .seekInput("00:00:00")
          .duration(`${body.t}`)
          .saveToFile(directory)
          .on("end", function (stdout, stderr) {
            resolve("Done");
          });
      });
      let promise2 = new Promise((resolve, reject) => {
        ffmpeg(body.stream)
          //.format('mp4')
          .seekInput("00:00:00")
          .outputOptions([`-vf fps=${body.fps}`])
          .duration(`${body.t}`)
          .saveToFile(datasetDir + "/image%d.jpg")
          .on("end", function (stdout, stderr) {
            resolve("Done!!");
          });
      });
      await Promise.all([promise1, promise2]);
      let data = {
        cam_id: cam_id,
        clientId: uuidv4(),
        name: datasetName,
        path: absDir,
        processed: "No",
        class: "data",
        type: "video",
        uploaded: "Yes",
        snippet_id: snippetId,
      };
      Datasets.add(data, function (err, row) {
        if (err) return res.status(500).json(err);
        Relations.getRels(cam_id, function (err, result) {
          if (err) return res.status(500).json(err);
          for (const itm of result) {
            let d = {
              id: uuidv4(),
              camera_id: cam_id,
              algo_id: itm.algo_id,
              snippet_id: snippetId,
              roi_id: null,
              atributes: `[{"conf": 10, "save": true, "time": 0, "fps":${body.fps}}]`,
              id_account: accId,
              id_branch: accId,
              stream: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              http_out: null,
            };
            Relations.create(d, function (err, r) {
              if (err) console.log("err>>>>>>>>>>>>>>>>", err);
            });
          }
          let data = {
            cam_id: cam_id,
            clientId: uuidv4(),
            name: datasetName,
            path: datasetDir,
            processed: "Yes",
            class: "data",
            type: "zip",
            uploaded: "Yes",
            snippet_id: uuidv4(),
          };
          Datasets.add(data, function (err, row) {
            if (err) return res.status(500).json(err);
            res.status(200).json("Dataset created successfully!");
          });
        });
      });
    } catch (e) {
      console.log("error>>>>>>>>>>", e);
    }
  },
  unzipDataset: (req, res) => {
    let stor = multer.diskStorage({
      //multers disk storage settings
      filename: function (req, file, cb) {
        var newName = file.originalname.toString();
        cb(null, newName);
        //file.originalname
      },
      destination: function (req, file, cb) {
        const pathName = file.originalname.toString().replace(".zip", "");
        var lugar = process.env.resources2 + "datasets/" + pathName;
        if (!fs.existsSync(lugar)) {
          fs.mkdirSync(lugar);
        }
        cb(null, lugar);
      },
    });

    let upZip = multer({
      //multer settings
      storage: stor,
    }).single("zip");

    upZip(req, res, function (err) {
      if (err) {
        res.json({
          error_code: 1,
          err_desc: err,
        });
        return;
      } else {
        const pathName = req.file.originalname.toString().replace(".zip", "");
        pat =
          process.env.resources2 +
          "datasets/" +
          pathName +
          "/" +
          req.file.originalname;
        unZippedPath = process.env.resources2 + "datasets/" + pathName;
        fs.createReadStream(pat)
          .pipe(
            unzipper.Extract({
              path: unZippedPath,
            })
          )
          .promise()
          .then(
            () => {
              /**
               * File rename
               */
              fs.readdirSync(unZippedPath)
                .filter(junk.not)
                .forEach((file) => {
                  if (file !== `${pathName}.zip`) {
                    // console.log(file);
                    fs.rename(
                      unZippedPath + "/" + file,
                      unZippedPath + "/" + file.split(" ").join("-"),
                      (err) => {
                        if (err) {
                          logger.log("error", `${file}: ${err}`);
                        }
                        console.log("Rename complete!");
                      }
                    );
                  }
                });
            },
            (e) => console.log("error", e)
          );

        let data = {
          cam_id: uuidv4(),
          clientId: uuidv4(),
          name: pathName,
          path: unZippedPath,
          processed: "Yes",
          class: "data",
          type: "zip",
          uploaded: "Yes",
          snippet_id: uuidv4(),
        };
        Datasets.add(data, function (err, row) {
          if (err) return res.status(500).json(err);
          fs.unlinkSync(pat);
          res.status(200).json("Uploaded");
        });
      }
    });
  },
  imageSeachDataset: (req, res) => {
    let directory = process.env.resources2 + "search_images_json/";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    fs.writeFileSync(
      directory + req.body.name + ".json",
      JSON.stringify(req.body.images)
    );
    let child = child_process.spawn("node", ["SaveImage.js", req.body.name]);
    child.stdout.on("data", function (data) {
      console.log("stdout: " + data);
      res.json(`${req.body.name} dataset created successfully!`);
    });
    child.stderr.on("data", function (data) {
      console.log("stderr: " + data);
      res.json(data);
    });
    child.on("message", function (msg) {
      console.log("message from child: " + require("util").inspect(msg));
    });
    child.on("exit", function () {
      console.log(`${req.body.name} dataset cretaed successfully!`);
      res.json(`${req.body.name} dataset created successfully!`);
    });
    child.on("end", function () {
      console.log(`${req.body.name} dataset cretaed successfully!`);
      res.json(`${req.body.name} dataset created successfully!`);
    });
    child.on("close", function (code) {
      console.log("child process exited with code: " + code);
      res.json(`${req.body.name} dataset cretaed successfully!`);
    });
  },
  deleteDataset: async (req, res) => {
    let directory;
    let data = req.params;
    let snippetId = data.snippet_id;
    if (data.type == "video") {
      directory = process.env.resources2 + "recordings/" + data.name + ".mp4";
    } else {
      directory = process.env.resources2 + "datasets/" + data.name;
    }
    //fs.rmdirSync(directory, { recursive: true });
    await del(directory, { force: true });
    Relations.delete(snippetId, function (err, rows) {
      if (err) {
        return res.json(err);
      } else {
        Datasets.delete(snippetId, function (err, count) {
          if (err) {
            return res.json(err);
          } else {
            res.json(count);
          }
        });
      }
    });
  },
};

let getImgSize = (url) => {
  return new Promise((resolve, reject) => {
    /* const options = {
            'url': url,
            'strictSSL': false
        }; */
    requestImageSize(url)
      .then((size) => resolve(size))
      .catch((err) => reject(err));
  });
};

let processByVista = (name) => {
  console.log(
    "******* Process By Vista APIs ********* ",
    process.env.vista_server_ip + "/api/v1/sync"
  );

  let directory = process.env.resources2 + "datasets/" + name;
  return new Promise(async (resolve, reject) => {
    try {
      /**
       * Load all files from dataset resources
       * Ignoring junk files
       */
      let readDir = fs.readdirSync(directory).filter(junk.not);
      let rm = [];
      let count = 0;

      for (let i = 0; i < readDir.length; i++) {
        const imageName = readDir[i];
        let path = directory + "/" + imageName;
        let options = {
          method: "POST",
          url: process.env.vista_server_ip + "/api/v1/sync",
          strictSSL: false,
          headers: {
            Authorization: process.env.authorization,
          },
          formData: {
            upload: {
              value: fs.createReadStream(path),
              options: {
                filename: path,
                contentType: null,
              },
            },
            subscriptions: "Object,themes,food,tags,face,fashion",
          },
        };

        await rp(options)
          .then(async (res) => {
            logger.log("info", `${imageName}: ${res}`);

            let itm = JSON.parse(res);
            itm.id = count;
            let xx = itm.image.split("/")[3];
            let yy = xx.split(".")[1];
            let zz = xx.split("_");
            zz.splice(zz.length - 1, 1);
            let imgPath = directory + "/" + zz.join("_") + "." + yy;
            let size = await sizeOf(imgPath);
            itm.width = size.width;
            itm.height = size.height;
            itm.image = process.env.vista_server_ip + itm.image;
            itm.checked = true;
            rm.push(itm);
            ++count;

            console.log(itm);
          })
          .catch((err) => {
            logger.log("error", `${imageName}: ${err}`);
          });
      }

      console.log("RECEIVED_THE_RESULT");

      resolve(rm);

      // const promises = readDir.map(imageName => {
      //     let path = directory + '/' + imageName;
      //     let options = {
      //         'method': 'POST',
      //         'url': process.env.vista_server_ip + '/api/v1/sync',
      //         'strictSSL': false,
      //         'headers': {
      //             'Authorization': process.env.authorization
      //         },
      //         formData: {
      //             'upload': {
      //                 'value': fs.createReadStream(path),
      //                 'options': {
      //                     'filename': path,
      //                     'contentType': null
      //                 }
      //             },
      //             'subscriptions': 'Object,themes,food,tags,face,fashion'
      //         }
      //     };
      //     console.log('OPTIONS - ', JSON.stringify(options));
      //     return rp(options);
      // });

      // console.log('PROMISES - ', promises);

      // let rm = [];
      // let count = 0;
      // Promise.all(promises).then(async(data) => {
      //     console.log('DATA - ', data);
      //     for (const element of data) {
      //         let itm = JSON.parse(element);
      //         itm.id = count;
      //         let xx = itm.image.split('/')[3];
      //         let yy = xx.split('.')[1];
      //         let zz = xx.split('_');
      //         zz.splice(zz.length - 1, 1);
      //         let imgPath = directory + '/' + zz.join('_') + '.' + yy;
      //         let size = await sizeOf(imgPath);
      //         itm.width = size.width;
      //         itm.height = size.height;
      //         itm.image = process.env.vista_server_ip + itm.image;
      //         itm.checked = true;
      //         rm.push(itm);
      //         ++count;
      //     };
      //     resolve(rm);
      // }).catch(err => {
      //     console.log('error>>>>>>>>>>>>>>>>', err);
      //     reject(err);
      // });
    } catch (err) {
      console.log("error>>>>>>>>>>>>>>>>", err);
      reject(err);
    }
  });
};

let table = {
  0: "person_gsate",
  1: "vehicle_gsate",
  2: "clothing_gsate",
};

let processByAnalytics = (name) => {
  console.log("******* Process By Analytics ********* ");
  let result = [];
  let index = 0;
  let count = 0;
  return new Promise(async (resolve, reject) => {
    try {
      Datasets.listOne(name, function (err, dataset) {
        if (err) reject(err);

        if (dataset.length === 0) resolve("Dataset does not exists.");
        Relations.getRelsFromSnippetId(
          dataset[0].snippet_id,
          async function (err, rows) {
            if (err) reject(err);

            if (rows.length > 0) {
              for (const itm of rows) {
                let data = {
                  table: table[itm.algo_id],
                  snippet_id: itm.snippet_id,
                };
                ++index;
                await Algorithms.fetchAlgoData(data).then((resp) => {
                  for (const element of resp) {
                    let cl =
                      table[itm.algo_id] == "person_gsate"
                        ? "person"
                        : table[itm.algo_id] == "vehicle_gsate"
                        ? element.class
                        : "clothes";
                    let obj = {
                      id: count,
                      image:
                        "/assets/shared-data/" +
                        element.image_path.split("/").splice(5, 5).join("/"),
                      width: element.cam_width,
                      height: element.cam_height,
                      checked: true,
                      results: {
                        Object: [
                          {
                            class: cl,
                            boundingBox: {
                              left: element.x1,
                              top: element.y1,
                              width: element.x2 - element.x1,
                              height: element.y2 - element.y1,
                            },
                          },
                        ],
                      },
                    };
                    ++count;
                    result.push(obj);
                  }
                });
              }
              //result = [].concat(...result);
              resolve(result);
            } else {
              resolve([]);
            }
          }
        );
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = Dataset;
