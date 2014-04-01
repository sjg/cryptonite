var crypto = require('crypto');

module.exports = Cryptonite;

function Cryptonite(options) {
    this.options = options;
    if (!this.options) this.options = {};
    if (!this.options.cryptoSecret) this.options.cryptoSecret = 'please change me';
    if (!this.options.cryptoAlgorithm) this.options.cryptoAlgorithm = 'aes-256-cbc';
    if (!this.options.signingSecret) this.options.signingSecret = 'please change me';
    if (!this.options.signingAlgorithm) this.options.signingAlgorithm = 'sha256';
    if (!this.options.encoding) this.options.outputEncoding = 'base64';  // base64 | may need changing to hex for https://github.com/joyent/node/issues/738/ seems fine in 0.10.26
    if (!this.options.encoding) this.options.inputEncoding = 'utf-8';
    if (!this.options.delimiter) this.options.delimiter = '|';
}

Cryptonite.prototype.encrypt = function (object) {
    if (!object) return;

    var serializedObject = JSON.stringify(object);

    var objectDigest = crypto
        .createHmac(this.options.signingAlgorithm, this.options.signingSecret)
        .update(serializedObject)
        .digest(this.options.outputEncoding);

    var toEncrypt = serializedObject + this.options.delimiter + objectDigest;

    var cipher = crypto.createCipher(this.options.cryptoAlgorithm, this.options.cryptoSecret);

    var encrypted = cipher.update(toEncrypt, this.options.inputEncoding, this.options.outputEncoding);
    encrypted += cipher.final(this.options.outputEncoding);
    return encrypted;
};

Cryptonite.prototype.decrypt = function (encryptedObject) {

    if (!encryptedObject) return;

    var decipher = crypto.createDecipher(this.options.cryptoAlgorithm, this.options.cryptoSecret);

    var serializedDecryptedValue;

    try {
        serializedDecryptedValue = decipher.update(encryptedObject, this.options.outputEncoding, this.options.inputEncoding);
        serializedDecryptedValue += decipher.final(this.options.inputEncoding);
    } catch (e) {
        console.log("Error: " + e);
        return;
    }

    var encryptedArray = serializedDecryptedValue.split(this.options.delimiter);
    var serializedObject = encryptedArray[0];
    var storedDigest = encryptedArray[1];

    var computedDigest = crypto
        .createHmac(this.options.signingAlgorithm, this.options.signingSecret)
        .update(serializedObject)
        .digest(this.options.outputEncoding);

    if (storedDigest !== computedDigest) return;

    return JSON.parse(serializedObject);
};