import express from 'express';
import https from 'https';
import querystring from 'querystring';

const router = express.Router();

// Exchange authorization code for tokens
router.post('/exchange-code', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Prepare token exchange request
    const tokenEndpoint = `https://${process.env.COGNITO_DOMAIN}/oauth2/token`;
    const postData = querystring.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.COGNITO_CLIENT_ID,
      code: code,
      redirect_uri: redirect_uri || 'http://localhost:8081/callback'
    });

    console.log('Token exchange request:', {
      endpoint: tokenEndpoint,
      client_id: process.env.COGNITO_CLIENT_ID,
      redirect_uri: redirect_uri || 'http://localhost:8081/callback',
      code: code.substring(0, 10) + '...' // Log partial code for debugging
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    // Make request to Cognito token endpoint
    const tokenRequest = https.request(tokenEndpoint, options, (tokenRes) => {
      let data = '';
      
      tokenRes.on('data', (chunk) => {
        data += chunk;
      });
      
      tokenRes.on('end', () => {
        try {
          const tokenResponse = JSON.parse(data);
          
          if (tokenRes.statusCode === 200) {
            // Successfully got tokens
            res.json({
              access_token: tokenResponse.access_token,
              id_token: tokenResponse.id_token,
              refresh_token: tokenResponse.refresh_token,
              token_type: tokenResponse.token_type,
              expires_in: tokenResponse.expires_in
            });
          } else {
            console.error('Token exchange failed:', tokenResponse);
            res.status(tokenRes.statusCode).json({ 
              error: 'Token exchange failed', 
              details: tokenResponse 
            });
          }
        } catch (parseError) {
          console.error('Failed to parse token response:', parseError);
          res.status(500).json({ error: 'Invalid response from Cognito' });
        }
      });
    });

    tokenRequest.on('error', (error) => {
      console.error('Token request error:', error);
      res.status(500).json({ error: 'Failed to exchange code for tokens' });
    });

    tokenRequest.write(postData);
    tokenRequest.end();

  } catch (error) {
    console.error('Code exchange error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;