import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Cognito JWKS URI - Initialize dynamically to ensure env vars are loaded
let client;

function getJwksClient() {
  if (!client) {
    const jwksUri = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`;
    console.log('Initializing JWKS client with URI:', jwksUri);
    client = jwksClient({ jwksUri });
  }
  return client;
}

// Get key for JWT validation
function getKey(header, callback) {
  const jwksClient = getJwksClient();
  jwksClient.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.log('JWKS key retrieval error:', err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Authenticate middleware
export function authenticateJWT(req, res, next) {
  console.log(`[${req.requestId}] Authenticating request...`);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log(`[${req.requestId}] Missing Authorization header`);
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Accept both "Bearer <token>" and just "<token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  console.log(`[${req.requestId}] Token extracted, length: ${token.length}`);

  const jwtOptions = {
    algorithms: ['RS256'],
    audience: process.env.COGNITO_CLIENT_ID,
    issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}`
  };
  
  console.log(`[${req.requestId}] JWT verification options:`, jwtOptions);

  jwt.verify(
    token,
    getKey,
    jwtOptions,
    (err, decoded) => {
      if (err) {
        console.log(`[${req.requestId}] JWT verification failed:`, err.message);
        return res.status(403).json({ error: 'Invalid or expired token', details: err.message });
      }
      console.log(`[${req.requestId}] JWT verified successfully for user:`, decoded.sub);
      console.log(`[${req.requestId}] User groups:`, decoded['cognito:groups']);
      req.user = decoded;
      next();
    }
  );
}

// Admin-only middleware
export function requireAdmin(req, res, next) {
  console.log(`[${req.requestId}] Checking admin access...`);
  
  if (!req.user) {
    console.log(`[${req.requestId}] No user found in request`);
    return res.status(401).json({ error: 'Authentication required' });
  }

  const userGroups = req.user['cognito:groups'] || [];
  console.log(`[${req.requestId}] User groups:`, userGroups);
  
  if (!userGroups.includes('admin')) {
    console.log(`[${req.requestId}] User is not admin. Groups:`, userGroups);
    return res.status(403).json({ error: 'Admin access required' });
  }

  console.log(`[${req.requestId}] Admin access granted`);
  next();
}