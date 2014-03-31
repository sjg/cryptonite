var crypto = require('crypto');

module.exports = Cryptonite;

function Cryptonite(options) {
    this.options = options;
    if (!this.options) this.options = {};
    if (!this.options.cryptoSecret) this.options.cryptoSecret = 'please change me';
    if (!this.options.cryptoAlgorithm) this.options.cryptoAlgorithm = 'aes-256-cbc';
    if (!this.options.signingSecret) this.options.signingSecret = 'please change me';
    if (!this.options.signingAlgorithm) this.options.signingAlgorithm = 'SHA256';
    if (!this.options.encoding) this.options.output_encoding = 'sha256';  // base64 | may need changing to hex for https://github.com/joyent/node/issues/738/ seems fine in 0.10.26
    if (!this.options.encoding) this.options.input_encoding = 'utf-8';
    if (!this.options.delimiter) this.options.delimiter = '|';
}

Cryptonite.prototype.encrypt = function (object) {
    if (!object) return;

    var serializedObject = JSON.stringify(object);

    var objectDigest = crypto
        .createHmac(this.options.signingAlgorithm, this.options.signingSecret)
        .update(serializedObject)
        .digest(this.options.output_encoding);

    var toEncrypt = serializedObject + this.options.delimiter + objectDigest;

    var cipher = crypto.createCipher(this.options.cryptoAlgorithm, this.options.cryptoSecret);

    var encrypted = cipher.update(toEncrypt, this.options.input_encoding, this.options.output_encoding);
    encrypted += cipher.final(this.options.output_encoding);
    return encrypted;
};

Cryptonite.prototype.decrypt = function (encryptedObject) {

    if (!encryptedObject) return;

    var decipher = crypto.createDecipher(this.options.cryptoAlgorithm, this.options.cryptoSecret);

    var serializedDecryptedValue;

    try {
        serializedDecryptedValue = decipher.update(encryptedObject, this.options.output_encoding, this.options.input_encoding);
        serializedDecryptedValue += decipher.final(this.options.input_encoding);
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
        .digest(this.options.output_encoding);

    if (storedDigest !== computedDigest) return;

    return JSON.parse(serializedObject);
};