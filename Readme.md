# cryptonite
Encryption & decryption and signing of objects for node.js made simple.

It's slim wrapper on top of node.js library. Useful for for example secure storing values in cookies.

## Example
example for express js cookies
```js
var Cryptonite = require('./cryptonite');
var cookie = require('cookie');

var cryptonite = new Cryptonite({
                                    cryptoSecret: 'very secret crypto secrect',
                                    signingSecret: 'very secret signing secrect'
                                });
                                
var authenticationTicket = {
              userId: '3456798764',
              token: '234567895345764857864237654345764'
          };

var encryptedAuthenticationTicket = cryptonite.encrypt(authenticationTicket);

res.cookie('auth_cookie',encryptedAuthenticationTicket, {
                                                    httpOnly: true,
                                                    maxAge: 86000
                                                });

var cookies = req.headers.cookie;
var parsedCookies = cookie.parse(cookies);
var authCookieValue = parsedCookies['auth_cookie'];


var retreivedAuthenticationTicket = cryptonite.decrypt(authCookieValue);

```

## License

  MIT
