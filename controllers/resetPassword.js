const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({ email : email });
        if(user){
            const id = uuid.v4();
            ForgotPassword.create({ id: id , active: true, userId: user._id })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(`${process.env.SENGRID_API_KEY}`)

            const msg = {
                to: email,
                from: 'vikashdhaka285@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetPassword/${id}">Reset Password</a>`,
            }

            const response = await sgMail.send(msg)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

exports.resetPassword = async(req, res) => {
    const id =  req.params.id;
    const forgotPasswordRequest = await ForgotPassword.findOne({ id: id })
        if(forgotPasswordRequest){
            forgotPasswordRequest.active = false
            forgotPasswordRequest.save()
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatePassword/${id}" method="get">
                                        <label for="newPassword">Enter New password</label>
                                        <input name="newPassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    }

exports.updatePassword = async(req, res) => {

    try {
        const { newPassword } = req.query;
        const { resetPasswordId } = req.params;
        const resetPasswordRequest = await ForgotPassword.findOne({ id: resetPasswordId })
        const user = await User.findById(resetPasswordRequest.userId)
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            throw new Error(err);
                        }
                        bcrypt.hash(newPassword, salt, async function(err, hash) {
                            if(err){
                                throw new Error(err);
                            }
                            user.password = hash
                            await user.save()
                            res.status(201).send(`<html>
                            <script>
                                alert('Password updated!')
                                window.location.href = "/Login/login.html"
                            </script>
                            </html>`)
                        })
                    })
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}