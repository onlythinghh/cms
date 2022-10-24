import CryptoJS from 'crypto-js';

export const BASE64Helper = {
    encode(str) {
        const wordArray = CryptoJS.enc.Utf8.parse(str);
        const base64 = CryptoJS.enc.Base64.stringify(wordArray);
        return base64;
    },
    decode(base64Str) {
        const parsedWordArray = CryptoJS.enc.Base64.parse(base64Str);
        return parsedWordArray.toString(CryptoJS.enc.Utf8);
    },
    imgMd5(file){
        return new Promise((resolve, reject) => {
            if(file.size>(50*1024*1024)){
                file.sha = ''
                resolve(file);
            }else{
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (reader.result) {
                        var wordArray = CryptoJS.lib.WordArray.create(reader.result)
                        file.sha = CryptoJS.SHA1(wordArray).toString()
                        resolve(file);
                    }
                };
                reader.onerror = () => {
                    reject();
                };
            }
        });
        // // return new Promise()
        // // try {
        //     let reader = new FileReader();
        //     reader.readAsArrayBuffer(file);
        //     reader.onload = function(){
        //         var wordArray = CryptoJS.lib.WordArray.create(reader.result)
        //         file.chs = CryptoJS.SHA512(wordArray).toString()
        //         callback(file)
        //     };
        // } catch (err){
        //     console.error(err)
        // }
    }
};

const AES = {
    key: CryptoJS.enc.Utf8.parse('YUtsdas34Sdw0-d7'),
    iv: CryptoJS.enc.Utf16.parse('-0t9SW2@#sdsdewr'),
    encrypt(src) {
        if (!src) {
            return '';
        }
        const enc = CryptoJS.AES.encrypt(src, this.key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return enc.ciphertext.toString(CryptoJS.enc.Base64);
    },
    decrypt(encryptStr) {
        if (!encryptStr) {
            return '';
        }
        const decBytes = CryptoJS.AES.decrypt(encryptStr, this.key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decBytes.toString(CryptoJS.enc.Utf8);
    },
};

export const AESHelper = {
    encrypt(src) {
        return AES.encrypt(src);
    },
    decrypt(encryptStr) {
        return AES.decrypt(encryptStr);
    },
};
