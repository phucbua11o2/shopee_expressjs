const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');

const { mutipleMongooseToObject } = require('../../util/mongoose');
class AccountController {
    //[GET] /accounts/register
    register(req, res, next){
        res.render('accounts/register');
    }
    //[POST] /accounts/buyer
    buyer(req, res, next){
        let {email,username,password,confirmpass} = req.body;
        email = email.trim();
        username = username.trim();
        password = password.trim();
        confirmpass = confirmpass.trim();
        if(email==''||username==''||password==''||confirmpass=='')
        {
            res.status(401).json('Empty fields');
        }else if(password != confirmpass){
            res.status(401).json('Confirm password incorrect');
        }else if(!/^[a-zA-Z0-9]+$/.test(username)){
            res.status(401).json('Username invalid');
        }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            res.status(401).json('Email invalid');
        }else if(!/^[A-Za-z]\w{7,14}$/.test(password)){
            res.status(401).json('Password between 7 to 16 characters which contain only characters, numeric digits, underscore and first character must be a letter');
        }
        else{
            User.find({email}).then(result=>{
                if(result.length){
                    res.status(200).json('User provided email already exists')
                }else{
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds).then(hashedPassword=>{
                        const user = new User({
                            email,
                            username,
                            password:hashedPassword,
                            confirmpass:hashedPassword,
                        });
                        user.save()
                            .then(() => res.redirect('/'))
                            .catch(err=>{
                                res.status(400).json('Signup failure!!')
                            })
                    })
                    .catch(err=>{
                res.status(500).json('An error occurred while hash password');
                    })                    
                }
            }).catch(err=>{
                console.error(err);
                res.status(500).json('An error occurred while checking for existing user');
            })
        // user.save()
        //     .then(() => res.redirect('/'))
        //     .catch(next);
        }
    }
    login(req, res, next){
        res.render('accounts/login');
    }
    logout(req, res, next){
        req.session.isAuthenticated = false;
        req.session.authUser=null;
        res.redirect(req.headers.referer);
    }
    exploit(req, res, next){
        let {email,username,password} = req.body;
        email = email.trim();
        password = password.trim();
        User.find({email})
            .then(data=> {
                if(data.length){
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword)
                        .then(result => {
                            if(result){
                                // delete data[0].password;
                                // delete data[0].confirmpass;
                                req.session.isAuthenticated = true;
                                req.session.authUser = data[0];
                                if(data[0].role===0){
                                    req.session.authRole =true;
                                }else{
                                    req.session.authRole=false;
                                }
                                const url =req.query.returnUrl || '/';
                                res.redirect(url);
                            }else{
                                res.status(403).json('Invalid password entered');                               
                            }
                        })
                        .catch(err => {
                            res.status(500).json('An error occurred while compare password');
                        })
                }else{
                    res.status(500).json('invalid credentials entered');
                }
            })
            .catch(err=>{
                res.status(500).json('An error occurred while checking for existing user');
            })
    }
}

module.exports = new AccountController();
