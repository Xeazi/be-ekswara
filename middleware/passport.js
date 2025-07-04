const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const privateKey = require("../utils/privateKey");
const authServices = require("../admin/services/auth")

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

            const initialData = await authServices.getAdmin(payload.username);

            const data = initialData[0];

            console.log(data.username +'HALP');

            if(payload.username === data.username) {
                return done(null, data);
            } else {
                return done(null, false);
            }

        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    }
));