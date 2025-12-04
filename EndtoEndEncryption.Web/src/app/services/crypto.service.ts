import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private publicKey: CryptoKey | null = null;

  async setServerPublicKey(publicKeyPemOrBase64: string): Promise<void> {
    // Accept either a PEM string ("-----BEGIN PUBLIC KEY-----...") or a raw base64 SPKI string
    const keyData = publicKeyPemOrBase64.includes('-----BEGIN')
      ? this.pemToArrayBuffer(publicKeyPemOrBase64)
      : this.base64ToArrayBuffer(publicKeyPemOrBase64);

    try {
      this.publicKey = await window.crypto.subtle.importKey(
        'spki',
        keyData,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        false,
        ['encrypt']
      );
    } catch (err) {
      console.error('Failed to import server public key:', err);
      throw err;
    }
  }

  async generateAESKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data: any): Promise<{
    encryptedData: string;
    encryptedAESKey: string;
    iv: string;
  }> {
    // Generate AES key for this session
    const aesKey = await this.generateAESKey();

    // Generate random IV (12 bytes recommended for GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt data with AES-GCM
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      encodedData
    );

    // Export AES key and encrypt with RSA public key
    const exportedAESKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedAESKey = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      this.publicKey!,
      exportedAESKey
    );

    return {
      encryptedData: this.arrayBufferToBase64(encryptedData),
      encryptedAESKey: this.arrayBufferToBase64(encryptedAESKey),
      iv: this.arrayBufferToBase64(iv.buffer)
    };
  }

  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem.replace(/(-----(BEGIN|END) PUBLIC KEY-----|\s)/g, '');
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
  }

  private base64ToArrayBuffer(b64: string): ArrayBuffer {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }
}
