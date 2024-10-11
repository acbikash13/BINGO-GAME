// googleStrategy.js
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const databasePromise = require('./databaseConnector');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const database = await databasePromise;
    const collection = database.collection('users');
    const user = await collection.findOne({ _id: ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  async (token, tokenSecret, profile, done) => {
    try {
      const database = await databasePromise;
      const collection = database.collection('users');
      let user = await collection.findOne({ googleId: profile.id });

      if (!user) {
        user = await collection.insertOne({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        });
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));
