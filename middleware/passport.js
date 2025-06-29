const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const privateKey = require("../utils/privateKey");

/*

ini dia ngebaca token yang di contain di header request
(token di generate di controllers auth.js)
dia ngecheck user data yg di simpen di token, trs ngebandingin sama yg di database

*/

passport.use('jwt-admin', new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: privateKey,
    }, 
    async (payload, done) => {
        console.log(payload);
        try {
            
            // data sudah nemu
            // di cari di mysql

            const userData = {
                fname: 'John',
                lname: 'Doe',
                email: 'example@doe.com',
            };

            if(payload.email === userData.email && payload.email === userData.email) {
                return done(null, userData);
            } else {
                return done(null, false);
            }

        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    }
));