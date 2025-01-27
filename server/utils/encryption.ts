import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable must be set');
}

// Convert the hex key to buffer
const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

export function encryptBuffer(buffer: Buffer): { encryptedData: Buffer; iv: Buffer } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encryptedData: encrypted, iv };
}

export function decryptBuffer(encryptedData: Buffer, iv: Buffer): Buffer {
  const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}
