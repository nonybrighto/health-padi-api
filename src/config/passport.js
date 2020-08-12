import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import FacebookTokenStrategy from 'passport-facebook-token';
import GoogleTokenStrategy from 'passport-google-id-token';
import models from '../app/models';
import config from './config';

const { User } = models;

function configurePassport() {
  passport.use(
    new passportLocal.Strategy(
      {
        usernameField: 'credential',
        passwordField: 'password'
      },
      async (credential, password, done) => {
        try {
          const user = await User.canLogin(credential, password);
          if (user) {
            return done(null, user);
          }
          return done(null, false, { message: 'Invalid email or password' });
        } catch (error) {
          return done(new Error('An unknown error occured'), false);
        }
      }
    )
  );

  passport.use(
    new passportJwt.Strategy(
      {
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme(
          'bearer'
        ),
        secretOrKey: config.get('jwt-secret')
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.scope('withHidden').findByPk(jwtPayload.id);
          if (user) {
            return done(null, user);
          }
          return done(new Error('Could not get user credentials'), false);
        } catch (error) {
          return done(new Error('An unknown error occured'), false);
        }
      }
    )
  );

  // NOTE: These social login implementation authenticates the user once the email matches an
  // existing email in the system.
  // Might not be what you need if this is a serious security concern to you.
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: config.get('google-client-id')
      },
      async (parsedToken, googleId, done) => {
        const userPayload = parsedToken.payload;

        try {
          const user = await User.findOrCreateSocialUser({
            name: userPayload.name,
            email: userPayload.email,
            avatarUrl: userPayload.picture
          });
          return done(null, user);
        } catch (error) {
          return done(new Error('An unknown google error occured'), false);
        }
      }
    )
  );

  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: config.get('facebook-client-id'),
        clientSecret: config.get('facebook-client-secret')
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOrCreateSocialUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatarUrl: profile.photos[0].value
          });
          return done(null, user);
        } catch (error) {
          return done(new Error('An unknown facebook error occured'), false);
        }
      }
    )
  );
}

export default configurePassport;
