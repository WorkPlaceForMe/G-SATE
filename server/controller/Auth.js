const User = require('../models/User')
const moment = require('moment')
const bcrypt = require('bcrypt')
const userService = require('../services/users')
const { v4: uuidv4 } = require('uuid')
const emailService = require('../services/email')
const userRoleArray = ['BRANCH', 'CLIENT', 'USER', 'ADMIN']
const format = 'YYYY-MM-DD HH:mm:ss'

let Auth = {
  signup: async (req, res) => {
    const body = req.body
    const smtpDetails = req['smtpDetails']
    try {
      User.getUserByEmail(body.email, async function (err, data) {
        if (err) {
          return res.json(err)
        } else {
          if (data && data.length !== 0) {
            return res.status(400).send({
              message: 'Provided email is already registered!',
            })
          } else {
            const bcryptedPassword = await bcrypt.hash(
              body.password,
              Number(process.env.passwordSaltRound),
            )
            const OTP = await emailService.generateOTP()

            const userData = {
              uuid: uuidv4(),
              name: body.name,
              email: body.email,
              password: bcryptedPassword,
              mobileNumber: body.mobileNumber || '',
              address: body.address || '',
              role: body.role,
              createdAt: moment().format(format),
              verificationOTP: OTP,
              otpExpiredAt: moment()
                .add(Number(process.env.otpExpiry), 'minutes')
                .format(format),
            }
            console.log(
              `OTP -- ${userData.email}`,
              userData.verificationOTP,
              userData.otpExpiredAt,
            )
            User.createNewUser(userData, async function (err, userCreated) {
              if (err) {
                return res.json(err)
              } else {
                res.status(200).json({
                  message: 'You have registered successfully',
                })

                await emailService.sendOTP(OTP, userData, smtpDetails)
              }
            })
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  verifyOTP: async (req, res) => {
    const smtpDetails = req['smtpDetails']
    try {
      const requestData = {
        email: req.body.email,
        verificationOTP: req.body.otp,
      }
      User.getUserByEmail(requestData.email, async function (err, userDetails) {
        if (err) {
          return res.json(err)
        } else {
          if (userDetails && userDetails.length !== 1) {
            return res.status(400).send({
              message: 'Provided email is not registered!',
            })
          } else {
            User.verifyOTPByEmail(requestData, async function (err, data) {
              if (err) {
                return res.json(err)
              } else {
                if (data && data.length !== 1) {
                  return res.status(400).send({
                    message: 'Invalid OTP Provided',
                  })
                } else {
                  if (data[0].verificationStatus === 1) {
                    return res.status(400).send({
                      message:
                        'Provided email is already verified, Please go to login!',
                    })
                  } else {
                    const otpExpired = await userService.checkOTPExpired(
                      data[0].otpExpiredAt,
                    )
                    if (otpExpired) {
                      return res.status(400).send({
                        message:
                          'OTP expired,Click on resend OTP to get new OTP!',
                      })
                    } else {
                      User.updateVerificationStatus(
                        { status: 1, id: data[0].id },
                        async function (err, updated) {
                          if (err) {
                            return res.json(err)
                          } else {
                            res.status(200).json({
                              message: 'OTP verified successfully',
                            })
                            await emailService.sendVerificationMail(
                              {
                                name: data[0].name,
                                email: data[0].email,
                              },
                              smtpDetails,
                            )
                          }
                        },
                      )
                    }
                  }
                }
              }
            })
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  login: async (req, res) => {
    const reqBody = req.body
    try {
      User.getUserByEmail(reqBody.email, async function (err, userDetails) {
        if (err) {
          return res.json(err)
        } else {
          if (userDetails && userDetails.length !== 1) {
            return res.status(400).send({
              message: 'Please provide your registered email address!',
            })
          } else {
            if (!userRoleArray.includes(userDetails[0].role)) {
              return res.status(400).send({
                message: 'Can not do this action, You are not a valid user!',
              })
            }
            const isSame = await bcrypt.compare(
              reqBody.password,
              userDetails[0].password,
            )
            if (!isSame) {
              return res.status(400).send({
                message: 'Invalid password!',
              })
            } else {
              if (userDetails[0].role !== 'ADMIN') {
                const accessibility = await userService.checkAccessibility(
                  userDetails[0].startDate,
                  userDetails[0].endDate,
                )
                if (!accessibility) {
                  return res.status(400).send({
                    message:
                      'You are not authorized to login, Please contact with admin panel!',
                  })
                }
              }

              const tokenDetails = await userService.genrateUserTokens(
                userDetails[0],
              )

              const responseObj = {
                id: userDetails[0].id,
                name: userDetails[0].name,
                email: userDetails[0].email,
                uuid: userDetails[0].uuid,
                mobileNumber: userDetails[0].mobileNumber,
                address: userDetails[0].address,
                role: userDetails[0].role,
                accessToken: tokenDetails.accessToken,
                accessTokenExpiry: tokenDetails.accessTokenExpiry,
                createdAt: userDetails[0].createdAt,
                startDate: userDetails[0].startDate,
                endDate: userDetails[0].endDate,
                verificationStatus: userDetails[0].verificationStatus,
              }
              res.status(200).json(responseObj)
            }
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  resendOTP: async (req, res) => {
    const body = req.body
    const smtpDetails = req['smtpDetails']
    try {
      User.getUserByEmail(body.email, async function (err, data) {
        if (err) {
          return res.json(err)
        } else {
          if (data && data.length !== 1) {
            return res.status(400).send({
              message: 'Provided email is not registered!',
            })
          } else {
            if (data[0].verificationStatus === 1) {
              return res.status(400).send({
                message:
                  'Provided email is already verified, Please go to login!',
              })
            } else {
              const OTP = await emailService.generateOTP()
              const userData = {
                id: data[0].id,
                verificationOTP: OTP,
                otpExpiredAt: moment()
                  .add(Number(process.env.otpExpiry), 'minutes')
                  .format(format),
              }
              console.log(
                `OTP -- ${body.email}`,
                userData.verificationOTP,
                userData.otpExpiredAt,
              )
              User.updateVerificationOTP(userData, async function (
                err,
                updated,
              ) {
                if (err) {
                  return res.json(err)
                } else {
                  res.status(200).json({
                    message: 'OTP resent successfully',
                  })
                  await emailService.sendOTP(
                    OTP,
                    {
                      name: data[0].name,
                      email: body.email,
                    },
                    smtpDetails,
                  )
                }
              })
            }
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  verificationStatus: async (req, res) => {
    if (!req.params.email) {
      return res.status(400).send({
        message: 'Email is required!',
      })
    }
    try {
      User.getUserByEmail(req.params.email, async function (err, userDetails) {
        if (err) {
          return res.json(err)
        } else {
          if (userDetails && userDetails.length !== 1) {
            return res.status(400).send({
              message: 'Provided email is not registered!',
            })
          } else {
            res.status(200).json({
              verificationStatus: userDetails[0].verificationStatus,
              role: userDetails[0].role,
            })
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },
}

module.exports = Auth
