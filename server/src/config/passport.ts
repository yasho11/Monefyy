import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

// Load environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ where: { google_id: profile.id } });

        if (!user) {
          // Create new user
          user = await User.create({
            username: profile.displayName,
            email: profile.emails?.[0].value,
            google_id: profile.id,
            provider: "google",
          });
        }

        // Attach JWT instead of session
        const token = generateToken(user.id);

        // Pass token along in the user object
        return done(null, { user, token });
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default passport;
