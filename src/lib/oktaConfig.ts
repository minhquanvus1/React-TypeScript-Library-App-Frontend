export const oktaConfig = {
    clientId: '0oabcn50qhlh7szMi5d7',
    issuer: 'https://dev-96351608.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}