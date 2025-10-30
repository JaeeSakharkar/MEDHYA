const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Cognito JWKS URI
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`
});

// Get key for JWT validation
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Authenticate middleware
function authenticateJWT(req, res, next) {
  // Development mode bypass
  if (process.env.DEV_MODE === 'true' && process.env.NODE_ENV === 'development') {
    console.log('🔓 Development mode: Bypassing authentication');
    req.user = {
      sub: 'dev-user-123',
      email: 'dev@example.com',
      'cognito:groups': ['admin'] // Give admin access in dev mode
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Accept both "Bearer <token>" and just "<token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
      audience: process.env.COGNITO_CLIENT_ID,
      issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}`
    },
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    }
  );
}

// Admin-only middleware
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const userGroups = req.user['cognito:groups'] || [];
  if (!userGroups.includes('admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}

module.exports = { authenticateJWT, requireAdmin };
