#!/usr/bin/env node

var Cryptonite = require('cryptonite');

cryptonite = new Cryptonite({
                                    cryptoSecret: "0a841f77-d798-e8f5-9e9f-9a8be3b17252",
                                    signingSecret: "oaON48VQrzNCB0zfHiW1r1KOo5kJsRnb"
                                });

var message = '{"quote": "If my calculations are correct, when this baby hits 88 miles per hour... you\'re gonna see some serious shit.", "movie": "bttf"}';
console.log("Message: \n" + message + "\n");
var s = cryptonite.encrypt(message);
console.log("Encrypted: \n" + s + "\n");
console.log("Decrypted: \n" + cryptonite.decrypt(s));