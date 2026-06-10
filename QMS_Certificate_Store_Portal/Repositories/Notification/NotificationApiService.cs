using Newtonsoft.Json;
using QMS_Certificate_Store_Portal.Repositories.Notification;
using System.Net.Http.Headers;
using System.Text;

namespace QMS.API.Services.Notification
{
    public class NotificationApiService
        : INotificationApiService
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public NotificationApiService(
            HttpClient client,
            IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<string> SendNotificationAsync(
            string subject,
            string header,
            string message,
            string footer,
            List<string> userPhones,
            string category,
            string subCategory)
        {
            var apiUrl =
                _configuration["NotificationApi:Url"];

            var apiKey =
                _configuration["NotificationApi:ApiKey"];

            var payload = new
            {
                subject,
                header,
                message,
                footer,
                userPhones,
                category,
                subCategory,
                forceSend = true
            };

            var json =
                JsonConvert.SerializeObject(payload);
            Console.WriteLine(json);
            using var request =
                new HttpRequestMessage(
                    HttpMethod.Post,
                    apiUrl);

            request.Headers.Add(
                "X-API-KEY",
                apiKey);

            request.Headers.Accept.Add(
                new MediaTypeWithQualityHeaderValue(
                    "application/json"));

            request.Content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            var response = await _client.SendAsync(request);

            Console.WriteLine("=================================");
            Console.WriteLine("Pulse API Response");
            Console.WriteLine($"Status: {response.StatusCode}");
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseBody);
            Console.WriteLine("=================================");

            return responseBody;
        }
    }
}