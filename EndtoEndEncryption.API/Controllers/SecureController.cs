using EndtoEndEncryption.API.Models;
using EndtoEndEncryption.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EndtoEndEncryption.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecureController : ControllerBase
    {
        private readonly ICryptoService _cryptoService;

        public SecureController(ICryptoService cryptoService)
        {
            _cryptoService = cryptoService;
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new { Status = "API is running securely." });
        }

        [HttpGet("public-key")]
        public IActionResult GetPublicKey()
        {
            return Ok(new { PublicKey = _cryptoService.GetPublicKey() });
        }

        [HttpPost("user-data")]
        public IActionResult ProcessSecureData([FromBody] EncryptedRequest request)
        {
            try
            {
                var decryptedData = _cryptoService.DecryptRequest<UserModel>(request);

                // Process the decrypted data
                var result = ProcessUserData(decryptedData);

                // Optionally encrypt the response
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest("Decryption failed");
            }
        }

        private object ProcessUserData(UserModel userData)
        {
            // Your business logic here
            return new { Success = true, Message = "Data processed successfully" };
        }
    }
}
