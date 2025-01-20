const express = require("express");
const passport = require("passport");
const session = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Configure session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:"69774506460-r0ddmdumgu9d8k41l444340igd1d6u7e.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000"); // Redirigez vers le front-end
  }
);

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send("Non autorisé");
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
