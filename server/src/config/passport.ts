import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import dotenv from "dotenv";

dotenv.config();

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
        // Step 1: Check if a user exists with this Google ID
        let user = await User.findOne({ where: { google_id: profile.id } });

        if (!user) {
          // Step 2: If not, check if a user exists with the same email
          const existingEmailUser = await User.findOne({
            where: { email: profile.emails?.[0].value },
          });

          if (existingEmailUser) {
            // Link Google ID to existing account
            existingEmailUser.google_id = profile.id;
            existingEmailUser.provider = "google";
            existingEmailUser.is_verified = true;
            await existingEmailUser.save();
            user = existingEmailUser;
          } else {
            // Step 3: Create a new user
            user = await User.create({
              username: profile.displayName,
              email: profile.emails?.[0].value,
              google_id: profile.id,
              is_verified: true,
              provider: "google",
            });
          }
        }

        // Step 4: Generate JWT
        const token = generateToken(user.id);

        // Step 5: Return user + token to callback
        return done(null, { user, token });
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default passport;
