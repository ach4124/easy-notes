module.exports = function(app) {
    const User = require('./userModel');

    app.post('/signup', (req, res, next) => {
      const { body } = req;
      const { username, password } = body;
      let { email } = body;

      if (!username) {
        return res.send({
          success: false,
          message: 'Username cannot be blank.'
        });
      }  
      if (!email) {
        return res.send({
          success: false,
          message: 'Email cannot be blank.'
        });
      }
      if (!password) {
        return res.send({
          success: false,
          message: 'Password cannot be blank.'
        });
      }
  
      email = email.toLowerCase();
      email = email.trim();
  
      User.find({
        email: email
      }, (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Server error'
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: 'Account already exist.'
          });
        }
  
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
            var token;
            token = user.generateJwt();
            res.status(200);
            if (err) {
                return res.send({
                    success: false,
                    message: 'Server error'
                });
            }
            return res.send({
              username,
              success: true,
              message: 'You have successfully signed up. Please click log in.',
              token: token,
              user: user._id
            });
        });
    });
  
    });
  
    app.post('/signin', (req, res, next) => {

      const { body } = req;
      const { password } = body;
      let { email } = body;
  
        if (!email) {
          return res.send({
            success: false,
            message: 'Email cannot be blank.'
          });
        }
        if (!password) {
          return res.send({
            success: false,
            message: 'Password cannot be blank.'
          });
        }
    
        email = email.toLowerCase();
        email = email.trim();
    
        User.find({
          email: email
        }, (err, users) => {
          if (err) {
            console.log('err:', err);
            return res.send({
              success: false,
              message: 'Error: server error'
            });
          }
          if (users.length != 1) {
            return res.send({
              success: false,
              message: 'Incorrect email'
            });
          }
    
          const user = users[0];
          if (!user.validPassword(password)) {
            return res.send({
              success: false,
              message: 'Incorrect password'
            });
          }

          token = user.generateJwt();
          res.status(200);
          res.send({
            token : token,
            id: user._id,
            username: user.username,
            success: true,
            message: "You are now logged in."
          });
        })
    })

    app.get('/logout', (req, res) => {
      res.send({ message: "Logged out", success: true })
      res.redirect('/');
    });
}