import { defineStore } from "pinia";
import CryptoJS from "crypto-js";
import { decodeJwt } from "jose";

export const useCryptoStore = defineStore("cryptoStore", () => {
    const appConfig = useAppConfig();

    // Encryption function
    const encrypt = (data) => {
        try {
            const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
            const encrypted = CryptoJS.AES.encrypt(dataString, appConfig.base.secret).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    };

    // Decryption function
    const decrypt = (encryptedData) => {
        if (!encryptedData) {
            return null;
        }
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, appConfig.base.secret);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            try {
                return JSON.parse(decryptedString);
            } catch {
                return decryptedString;
            }
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    };

    // JWT Decoding function using jose
    const decodeJwtToken = (token) => {
        try {
            const decoded = decodeJwt(token);
            return decoded;
        } catch (error) {
            console.error('JWT decoding error:', error);
            return null;
        }
    };

    return {
        encrypt,
        decrypt,
        decodeJwtToken // Add the decodeJwtToken function to the return object
    };
});