using EndtoEndEncryption.API.Models;
using System.Security.Cryptography;
using System.Text.Json;

namespace EndtoEndEncryption.API.Services
{
    public class CryptoService: ICryptoService
    {
        private readonly RSA _rsa;

        public CryptoService()
        {
            _rsa = RSA.Create(2048);
        }

        // Export SubjectPublicKeyInfo (SPKI) so the browser can import with format 'spki'
        public string GetPublicKey()
        {
            return Convert.ToBase64String(_rsa.ExportSubjectPublicKeyInfo());
        }

        public T DecryptRequest<T>(EncryptedRequest request)
        {
            // Decrypt AES key using RSA private key
            var encryptedAESKeyBytes = Convert.FromBase64String(request.EncryptedAESKey);

            int expectedKeyBytes = _rsa.KeySize / 8;
            if (encryptedAESKeyBytes.Length != expectedKeyBytes)
                throw new CryptographicException($"Encrypted AES key length ({encryptedAESKeyBytes.Length}) does not match RSA key size in bytes ({expectedKeyBytes}).");

            byte[] aesKeyBytes;
            try
            {
                // Try OAEP-SHA256 first (preferred)
                aesKeyBytes = _rsa.Decrypt(encryptedAESKeyBytes, RSAEncryptionPadding.OaepSHA256);
            }
            catch (CryptographicException)
            {
                // Fallback: try OAEP-SHA1 in case the client used the default OAEP (some clients default to SHA-1)
                try
                {
                    aesKeyBytes = _rsa.Decrypt(encryptedAESKeyBytes, RSAEncryptionPadding.OaepSHA1);
                }
                catch (CryptographicException ex)
                {
                    throw new CryptographicException("RSA decryption failed with both OAEP-SHA256 and OAEP-SHA1. Ensure the client encrypted with the matching public key and OAEP hash.", ex);
                }
            }

            // The client uses AES-GCM. Decrypt using AesGcm (available in .NET 6+ / .NET 9).
            var iv = Convert.FromBase64String(request.IV);
            if (iv == null || iv.Length == 0)
                throw new CryptographicException("IV is empty.");
            if (iv.Length != 12) // 12 bytes is the common recommended IV size for GCM
                throw new CryptographicException($"Unexpected IV length for AES-GCM: {iv.Length} (expected 12).");

            var cipherWithTag = Convert.FromBase64String(request.EncryptedData);

            // Web Crypto returns ciphertext || tag (tag length 16 bytes for AES-GCM)
            const int tagLength = 16;
            if (cipherWithTag.Length < tagLength)
                throw new CryptographicException("Ciphertext too short (must be at least tag length).");

            var ciphertext = new byte[cipherWithTag.Length - tagLength];
            var tag = new byte[tagLength];
            Array.Copy(cipherWithTag, 0, ciphertext, 0, ciphertext.Length);
            Array.Copy(cipherWithTag, ciphertext.Length, tag, 0, tagLength);

            var plaintext = new byte[ciphertext.Length];
            try
            {
                using var aesGcm = new AesGcm(aesKeyBytes);
                aesGcm.Decrypt(iv, ciphertext, tag, plaintext);
            }
            catch (CryptographicException ex)
            {
                throw new CryptographicException("AES-GCM decryption failed. Verify IV, ciphertext+tag and AES key are correct and aligned with the client.", ex);
            }

            var decryptedJson = System.Text.Encoding.UTF8.GetString(plaintext);

            // Make property name matching case-insensitive so JSON with lower-case keys maps to PascalCase properties
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var result = JsonSerializer.Deserialize<T>(decryptedJson, options);

            if (result == null)
                throw new JsonException("Deserialization returned null. Check decrypted JSON structure: " + decryptedJson);

            return result;
        }

        public EncryptedResponse EncryptResponse<T>(T data)
        {
            // Similar implementation for response encryption
            // Generate new AES key, encrypt data, encrypt AES key with RSA
            throw new NotImplementedException();
        }
    }
}
