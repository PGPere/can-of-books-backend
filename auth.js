const jwt = require('jsonwebtoken'); // auth
const jwksClient = require('jwks-rsa'); // auth

// this comes directly from the jsonwebtoken docs
// define a client, this is connected to YOUR auth0 account
const client = jwksClient({
  // this url comes from your app on the auth0 dashboard
  jwksUri: process.env.JWKS_URI
});

// this function comes directly from the jsonwebtoken docs
// https://www.npmjs.com/package/jsonwebtoken
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    // console.error(err)
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// this is our function we created to verify our user
function verifyUser(request, errOrUserCallback) {

  try {
    const token = request.headers.authorization.split(' ')[1];
    // this console allows me to grab the token so I can use it to test it in ThunderClient
    // make a request from the client-side, get my token back, then test it in ThunderClient
    console.log(token);
    // we get .verify from jwt - it verifies the user 
    jwt.verify(token, getKey, {}, errOrUserCallback);
  } catch (error) {
    errOrUserCallback('Not Authorized');
  }
}

module.exports = verifyUser