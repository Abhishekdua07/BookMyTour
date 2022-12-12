const crypto = require('crypto');        //for PasswordresetToken
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');     //we install it for password encryption  npm i bcryptjs 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false  //it will not shown in the output
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {                         // if we want to delete user account then we can simply flag active as false.
        type: Boolean,
        default: true,
        select: false               //hiding from user
    }
});

userSchema.pre('save', async function (next) {    //using pre middleware so that before saving to database it will encrypt the password
    //Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;  //we don't need to save it in database, we need it for validation only
    next();
});

userSchema.pre('save', function (next) {            //this middleware will run before new document save (before updating new password)
    if (!this.isModified('password') || this.isNew) return next();  // If password is not modified or document is new then don't change the passwordChangeAt property and call next middleware

    this.passwordChangedAt = Date.now() - 1000;      //Password changed 1 sec before it actually shows due to slow saving in database then generating token.
    next();
});

userSchema.pre(/^find/, function (next) {     //All expressions that start from find word
    //This is query middleware so it points to current query, now which has active property set to true, then user will only shown
    this.find({ active: { $ne: false } });
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);                     //userpassword is encrypt so to compare we have to encrypt candidate password too.
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        //console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;           //100 < 200
    }

    //False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');    //Generating reset Token

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');  //encrypting token

    console.log({ resetToken }, this.passwordResetToken);
    // const d = new Date();
    // const t = -d.getTimezoneOffset() + 10; // Difference between your current time and UTC + 10min

    // this.passwordResetExpires = Date.now() + t * 60 * 1000;

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;      // (10 min(in milliseconds))

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;