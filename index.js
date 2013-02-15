var crypto = require('crypto');

module.exports = Cryptonite;

function Cryptonite(options) {
    this.options = options;
    if (!this.options) this.options = {};
    if (!this.options.cryptoSecret) this.options.cryptoSecret = 'please change me';
    if (!this.options.cryptoAlgorithm) this.options.cryptoAlgorithm = 'aes-256-cbc';
    if (!this.options.signingSecret) this.options.signingSecret = 'please change me';
    if (!this.options.signingAlgorithm) this.options.signingAlgorithm = 'sha256';
    if (!this.options.encoding) this.options.encoding = 'base64';
    if (!this.options.delimiter) this.options.delimiter = '|';
}

Cryptonite.prototype.encrypt = function (object) {
    if (!object) return;

    var serializedObject = JSON.stringify(object);

    var objectDigest = crypto
        .createHmac(this.options.signingAlgorithm, this.options.signingSecret)
        .update(serializedObject)
        .digest(this.options.encoding);

    var toEncrypt = serializedObject + this.options.delimiter + objectDigest;

    var cipher = crypto.createCipher(this.options.cryptoAlgorithm, this.options.cryptoSecret);

    var encrypted = cipher.update(toEncrypt, 'utf8', this.options.encoding);
    encrypted += cipher.final(this.options.encoding);

    return encrypted;
};

Cryptonite.prototype.decrypt = function (encryptedObject) {

    if (!encryptedObject) return;

    var decipher = crypto.createDecipher(this.options.cryptoAlgorithm, this.options.cryptoSecret);

    var serializedDecryptedValue = decipher.update(encryptedObject, this.options.encoding, 'utf8');

    serializedDecryptedValue += decipher.final(this.options.encoding);



    var encryptedArray = serializedDecryptedValue.split(this.options.delimiter);
    var serializedObject = encryptedArray[0];
    var storedDigest = encryptedArray[1];

    var computedDigest = crypto
        .createHmac(this.options.signingAlgorithm, this.options.signingSecret)
        .update(serializedObject)
        .digest(this.options.encoding);

    if (storedDigest !== computedDigest) return;

    return JSON.parse(serializedObject);
};