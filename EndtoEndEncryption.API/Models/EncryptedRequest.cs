namespace EndtoEndEncryption.API.Models
{
    public class EncryptedRequest
    {
        public string EncryptedData { get; set; }
        public string EncryptedAESKey { get; set; }
        public string IV { get; set; }
    }
}
