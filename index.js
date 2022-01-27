require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");

const ErrorResponse = require("./utils/errorResponse");
const sendEmail = require("./utils/sendemail");

const User = require("./modles/User");

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connect mongodb");
  })
  .catch(console.error);

app.post("/register", async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, number } = req.body;
  if (!firstName || !lastName || !email || !password || !number)
    return next(new ErrorResponse("please provide email and name", 400));
  const exixt = await User.findOne({ email });

  if (exixt) return next(new ErrorResponse("user already exixt", 401));
  //  user create
  const user = await User.create({
    email,
    firstName,
    lastName,
    password,
    number,
  });
  const verificationToken = user.getVerificationToken();
  await user.save();

  // Generating a verification url and message
  const verifyUrl = `${process.env.SITE_URL}/verify/${verificationToken}`;
  const message = `
          <h1>claistehnic porgrmaes are avaliable</h1>
          <p>Please go to this link to verify your account</p>
          <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
      `;

  // Sending the email
  try {
    // await sendEmail({
    //   to: user.email,
    //   subject: " Account Verification",
    //   text: message,
    // });
    return res.status(200).json({
      success: true,
      verificationToken,
      //   data: "Email for account verification has been sent successfully",
    });
  } catch (error) {
    return next(new ErrorResponse("Email couldn't be sent", 500));
  }
});

app.put("/verify", async (req, res, next) => {
  // Hashing the token
  if (!req.body.verificationToken)
    return next(new ErrorResponse("please provide verify token", 400));

  const verificationToken = crypto
    .createHash("sha256")
    .update(req.body.verificationToken)
    .digest("hex");

  try {
    // Finding the user based on the token
    const user = await User.findOne({ verificationToken });
    if (!user)
      return next(new ErrorResponse("Invalid Verification Token", 400));

    // Verifying the account
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verifiedAt = Date.now();
    await user.save();

    // Returning a success message
    return res.status(200).json({
      success: true,
      token: user.getSignedToken(),
      user,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // Finding the user
  try {
    const user = await User.findOne({ email }).select("+password");

    // Don't let people know whether a certain email exists
    if (!user) {
      return next(
        new ErrorResponse("Your email or password is incorrect", 401)
      );
    }

    // Checking if the account is verified
    if (!user.isVerified) {
      return next(new ErrorResponse("Account has not been verified yet"), 403);
    }

    // Comparing the password
    const isMatched = await user.matchPasswords(password);
    if (!isMatched) {
      return next(
        new ErrorResponse("Your email or password is incorrect", 401)
      );
    }

    // Success response
    const _user = await User.findById(user.id);
    return res.status(200).json({
      success: true,
      token: user.getSignedToken(),
      user: _user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// forget password

app.post("/forget-password", async (req, res, next) => {
  // Finding the user
  try {
    const user = await User.findOne({ email: req.body.email });

    // Don't let people know whether a certain email exists or not
    if (!user) {
      return next(new ErrorResponse("The email couldn't be sent", 404));
    }

    // Generating a reset token
    const resetToken = user.getResetToken();
    await user.save();

    // Generating a reset password url and the email message
    const resetUrl = `${process.env.SITE_URL}/resetpassword/${resetToken}`;
    const message = `
               <h1>You have requested to reset your password</h1>
               <p>Please go to this link to reset</p>
               <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
           `;

    // Sending the email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).json({
        success: true,
        data: "Email for password reset has been sent successfully",
      });
    } catch (error) {
      // In case of an error, remove the reset password token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(new ErrorResponse("Email couldn't be sent", 500));
    }
  } catch (error) {
    next(error);
  }
});

// reset password

app.put("/reset", async (req, res, next) => {
  // Hashing the token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // Finding the user
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return next(
        new ErrorResponse(
          "Password reset token is either invalid or has been expired",
          400
        )
      );

    // Resetting the password and saving changes
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      data: "Password resetted successfully",
    });
  } catch (error) {
    next(error);
  }
});
//  this should be at the end
app.use(require("./middlewares/err"));

app.use("/", express.static(path.join(__dirname, "./frontend")));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server stated ${port} `);
});
