import CryptoJS from "crypto-js";

const key = import.meta.env.VITE_APP_ENCRYPTION_KEY;

if (!key) {
  throw new Error("Encryption key is not defined. Please set VITE_APP_ENCRYPTION_KEY in your .env file.");
}

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decryptData = (data) => {
  if (!data) return null;
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};