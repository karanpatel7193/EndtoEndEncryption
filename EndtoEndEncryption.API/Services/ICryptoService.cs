using EndtoEndEncryption.API.Models;

namespace EndtoEndEncryption.API.Services
{
    public interface ICryptoService
    {
        string GetPublicKey();
        T DecryptRequest<T>(EncryptedRequest request);
        EncryptedResponse EncryptResponse<T>(T data);
    }
}
