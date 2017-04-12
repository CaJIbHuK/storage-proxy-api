import * as crypto from "crypto";
import {HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding} from "crypto";

const CIPHERS = {
  AES256 : {
    CBC : "aes-256-cbc"
  }
};

const ENCODING = {
  HEX : "hex",
  ASCII : "ascii",
  UTF8 : "utf8"
};

export enum EncryptorAction {
  encrypt,
  decrypt
}

export class Encryptor {

  cipher : crypto.Cipher;
  decipher : crypto.Decipher;

  constructor(password : string,
              private plain_encoding : Utf8AsciiBinaryEncoding = ENCODING.UTF8,
              private cipher_encoding : HexBase64BinaryEncoding = ENCODING.HEX) {
    this.cipher = crypto.createCipher(CIPHERS.AES256.CBC, password);
    this.decipher = crypto.createDecipher(CIPHERS.AES256.CBC, password);
  }

  static encdecFields<T>(key : string, data : T, fields : string[], action : EncryptorAction) : T {
    for(let field of fields) {
      let fieldToEnc = data[field];
      if (fieldToEnc) {
        let encryptor = new Encryptor(key);
        data[field] = encryptor.encdecString(fieldToEnc, action);
      }
    }
    return data;
  }

  encdecString(data : string, action : EncryptorAction) {
    switch (action) {
      case EncryptorAction.encrypt:
        return this.encryptString(data);
      case EncryptorAction.decrypt:
        return this.decryptString(data);
      default:
        throw new Error("Invalid encryptor action");
    }
  }

  encryptString(data : string) {
    let encrypted = this.cipher.update(data, this.plain_encoding, this.cipher_encoding);
    encrypted += this.cipher.final(this.cipher_encoding);
    return encrypted;
  }

  decryptString(data : string) {
    let decrypted = this.decipher.update(data, this.cipher_encoding, this.plain_encoding);
    decrypted += this.decipher.final(this.plain_encoding);
    return decrypted;
  }

  static genPassword() {
    return crypto.randomBytes(64).toString(ENCODING.HEX);
  }

}