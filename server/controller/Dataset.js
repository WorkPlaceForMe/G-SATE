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

const makeRandomString = (length) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

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
    const imgPath = req.body.image_path.replace(
      `http://${process.env.my_ip}:4200/assets/shared-data/`,
      process.env.resources2
    );

    // const imgPath = req.body.image_path;

    console.log(">>>>>>>>>>>>> " + imgPath);

    const options = {
      method: "POST",
      url: process.env.vista_server_ip + "/api/v1/sync",
      strictSSL: false,
      headers: {
        // Authorization: process.env.authorization,
        "Content-Type": `multipart/form-data;`,
      },
      auth: {
        username: "admin",
        password: "admin",
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

  // processVistaMultipleImage: async (req, res, next) => {
  //   // const arrayOfImagePaths = [];

  //   // for (const imgPath of req.body.image_paths) {
  //   //   console.log(imgPath, "imgPath");
  //   //   const path = imgPath.replace(
  //   //     `http://${process.env.my_ip}:4200/assets/shared-data/`,
  //   //     process.env.resources2
  //   //   );
  //   //   // console.log(path,'path');
  //   //   // console.log(fs.createReadStream(path),'fs.createReadStream(path)');
  //   //   // arrayOfImagePaths.push(fs.createReadStream(path))
  //   //   arrayOfImagePaths.push(path);
  //   // }

  //   // console.log(">>>>>>>>>>>>> " + arrayOfImagePaths);

  //   const options = {
  //     method: "POST",
  //     url: process.env.vista_server_ip + "/api/v1/urlasync",
  //     strictSSL: false,
  //     headers: {
  //       // Authorization: process.env.authorization,
  //       "Content-Type": `application/json`,
  //     },
  //     auth: {
  //       username: "admin",
  //       password: "admin",
  //     },
  //     body: JSON.stringify({
  //       upload: req.body.image_paths,
  //       subscriptions: "Object,themes,food,tags,face,fashion",
  //     }),
  //   };

  //   console.log(JSON.stringify(options));
 
  //   await rp(options)
  //     .then(async(response) => {
  //       console.log(response);
  //       const responseArray = []
  //       for (const responseObj of response) {
  //         const operationOptions = {
  //           method: "GET",
  //           url: process.env.vista_server_ip + `/api/v1/operation/${responseObj.id}`,
  //           strictSSL: false,
  //           headers: {
  //             // Authorization: process.env.authorization,
  //             "Content-Type": `application/json`,
  //           },
  //           auth: {
  //             username: "admin",
  //             password: "admin",
  //           }
  //         };
  //         await rp(operationOptions)
  //         .then((res) => {
  //           console.log(res,'line 178');
  //           responseArray.push(res)
  //           console.log(responseArray,'line 179');
  //         })
  //         .catch((error) => {
  //           return res.status(500).json(error);
  //         });
  //         console.log(responseArray,'line 184');
  //       }
  //       console.log(responseArray,'line 186');
  //       return res.json(responseArray);
  //     })
  //     .catch((error) => {
  //       return res.status(500).json(error);
  //     });
  // },

  processVistaMultipleImage: async (req, res, next) => {

    const options = {
      method: "POST",
      url: process.env.vista_server_ip + "/api/v1/urlasync",
      strictSSL: false,
      headers: {
        // Authorization: process.env.authorization,
        "Content-Type": `application/json`,
      },
      auth: {
        username: "admin",
        password: "admin",
      },
      body: JSON.stringify({
        upload: req.body.image_paths,
        subscriptions: "Object,themes,food,tags,face,fashion",
      }),
    };

    console.log(JSON.stringify(options));

    const responseData = await rp(options)
      .then(async(response) => {
        console.log(response,'>>>>>>>>>>first response');
        return response;
      })
      .catch((error) => {
        return res.status(500).json(error);
      });

      console.log(responseData,'>>>>>>>>>>>>responseData');
      const responseArray = []
      const operationOptions = {
        method: "GET",
        url: '',
        strictSSL: false,
        headers: {
          // Authorization: process.env.authorization,
          "Content-Type": `application/json`,
        },
        auth: {
          username: "admin",
          password: "admin",
        }
      };
      for (let i = 0; i < responseData.length; i++) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>1');
        console.log(responseData[i],">>>>>>>>>>>>>>>>responseData");
        console.log(responseData[i].id,'>>>>>>>>>>>>>>>>>>>>>>>>>>>idd');
        operationOptions['url'] = process.env.vista_server_ip + '/api/v1/operation/' + responseData[i].id;
        console.log(operationOptions,'>>>>>>>>>>>>...operationOptions');
        // await rp(operationOptions)
        // .then((res) => {
        //   console.log(res,'>>>>>>>>>260');
        //   responseArray.push(res)
        //   console.log(responseArray,'>>>>>>>>261');
        //   // return res.json(responseArray);
        // })
        // .catch((error) => {
        //   return res.status(500).json(error);
        // });
      }
      console.log(responseArray,'>>>>>>>>>>>269');
      return res.json(responseArray);
  },

  processVistaBatchImages: async (req, res, next) => {
    if (!req.body.images) {
      res.status(400).send("Images are required!");
      return;
    }

    console.log("IMAGES: ", req.body.images);
    const images = req.body.images;

    rq({
      method: "POST",
      url: process.env.vista_server_ip + "/api/v1/urlasync",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic YWRtaW46YWRtaW4=",
      },
      body: {
        upload: images,
        subscriptions: "Object,themes,food,tags,face,fashion",
      },
    })
      .then((objectIds) => {
        console.log("objectIds", objectIds);
        let ids = [];

        for (const i in objectIds) {
          ids[i] = objectIds[i].id;
        }

        rq({
          method: "POST",
          url: process.env.vista_server_ip + "/api/v1/operationlist",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic YWRtaW46YWRtaW4=",
          },
          body: {
            id: ids,
          },
        })
          .then((vistaDetections) => {
            console.log("vistaDetections", vistaDetections);
            res.json(vistaDetections);
          })
          .catch((error) => {
            return res.status(500).json(error);
          });
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
      let pathExist = false;
      let directory =
        process.env.resources2 + "recordings/" + body.datasetName + ".mp4";
      let datasetDir = process.env.resources2 + "datasets/" + body.datasetName;
      let absDir =
        process.env.resources2 + "recordings/" + body.datasetName + ".mp4";
      if (!fs.existsSync(datasetDir)) {
        fs.mkdirSync(datasetDir);
      } else {
        pathExist = true;
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
          .saveToFile(datasetDir + "/" + Date.now() + "-image%d.jpg")
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
      //--------
      fs.exists(absDir, (exists) => {
        console.log(exists ? absDir + " - Found" : absDir + " - Not Found!");
      });
      //--------
      if (!pathExist) {
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
            //--------
            fs.exists(datasetDir, (exists) => {
              console.log(
                exists ? datasetDir + " - Found" : datasetDir + " - Not Found!"
              );
            });
            //--------
            Datasets.add(data, function (err, row) {
              if (err) return res.status(500).json(err);
              res.status(200).json("Dataset created successfully!");
            });
          });
        });
      }
    } catch (e) {
      console.log("error>>>>>>>>>>", e);
    }
  },
  unzipDataset: async (req, res) => {
    let pathExist;

    let stor = await multer.diskStorage({
      //multers disk storage settings
      filename: (req, file, cb) => {
        var newName = file.originalname.toString();
        cb(null, newName);
        console.log(newName);
        //file.originalname
      },
      destination: (req, file, cb) => {
        const pathName = file.originalname.toString().replace(".zip", "");
        console.log(pathName);
        var lugar = process.env.resources2 + "datasets/" + pathName;
        pathExist = fs.existsSync(lugar);

        console.log("lugar", lugar, pathExist);

        if (!fs.existsSync(lugar)) {
          fs.mkdirSync(lugar);
        }
        cb(null, lugar);
      },
    });

    let upZip = await multer({
      //multer settings
      storage: stor,
    }).single("zip");

    upZip(req, res, async (err) => {
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

        console.log(
          "unZippedPath",
          unZippedPath,
          pathExist,
          fs.existsSync(pat),
          pat
        );

        await fs
          .createReadStream(pat)
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
                    console.log(
                      file,
                      `${pathName}-${makeRandomString(14)}.${file
                        .split(".")
                        .pop()}`
                    );

                    fs.rename(
                      unZippedPath + "/" + file,
                      // unZippedPath + "/" + file.split(" ").join("-"),
                      `${unZippedPath}/${pathName}-${makeRandomString(
                        14
                      )}.${file.split(".").pop()}`,
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

        /**
         * Store in the DB if path is not exist
         */
        if (!pathExist) {
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
        } else {
          fs.unlinkSync(pat);
          res.status(200).json("Uploaded");
        }
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
  16: "ppe_gsate",
  17: "defects_gsate",
};

let processByAnalytics = (name) => {
  console.log("******* Process By Analytics ********* ");
  let result = [];
  let index = 0;
  let count = 0;
  return new Promise(async (resolve, reject) => {
    try {
      Datasets.listOneByTypeVideo(name, function (err, dataset) {
        if (err) reject(err);

        if (dataset.length === 0) resolve("Dataset does not exists.");
        Relations.getRelsFromSnippetId(
          dataset[0].snippet_id,
          async function (err, rows) {
            if (err) reject(err);

            if (rows.length > 0) {
              for (const itm of rows) {
                if (itm.algo_id !== "18") {
                  console.log("----Entered----");
                  let data = {
                    table: table[itm.algo_id],
                    snippet_id: itm.snippet_id,
                  };
                  ++index;
                  await Algorithms.fetchAlgoData(data).then((resp) => {
                    for (const element of resp) {
                      if (
                        (table[itm.algo_id] == "ppe_gsate" ||
                          table[itm.algo_id] == "defects_gsate") &&
                        element.class == "person"
                      ) {
                        console.log("======> Excluding person");
                      } else {
                        console.log("======> Including data");
                        let cl =
                          table[itm.algo_id] == "person_gsate"
                            ? "person"
                            : table[itm.algo_id] == "vehicle_gsate"
                            ? element.class
                            : table[itm.algo_id] == "clothing_gsate"
                            ? "clothes"
                            : table[itm.algo_id] == "ppe_gsate"
                            ? element.class
                            : element.class;
                        let obj = {
                          id: count,
                          image:
                            "/assets/shared-data/" +
                            element.image_path
                              .split("/")
                              .splice(5, 5)
                              .join("/"),
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
                    }
                  });
                }
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
