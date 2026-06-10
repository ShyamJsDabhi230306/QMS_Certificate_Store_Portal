using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace QMS_Certificate_Store_Portal.Services
{
    public class WhatsAppService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public WhatsAppService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<bool> SendTemplateNotificationAsync(string recipientPhoneNumber)
        {
            var apiVersion = _config["WhatsApp:ApiVersion"] ?? "v20.0";
            var phoneId = _config["WhatsApp:PhoneId"];
            var token = _config["WhatsApp:AccessToken"];
            var templateName = _config["WhatsApp:TemplateName"] ?? "hello_world";

            var url = $"https://graph.facebook.com/{apiVersion}/{phoneId}/messages";

            var payload = new
            {
                messaging_product = "whatsapp",
                to = recipientPhoneNumber,
                type = "template",
                template = new
                {
                    name = templateName,
                    language = new { code = "en_US" }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var requestContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            // Attach bearer token
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            try
            {
                var response = await _httpClient.PostAsync(url, requestContent);
                if (response.IsSuccessStatusCode)
                {
                    return true;
                }

                var errorResponse = await response.Content.ReadAsStringAsync();
                System.Console.WriteLine($"WhatsApp Send Failed: {errorResponse}");
                return false;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"WhatsApp Exception: {ex.Message}");
                return false;
            }
        }
    }
}
