using Microsoft.Extensions.Options;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Configuration;
using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;
using QMS_Certificate_Store_Portal.Repositories.UserMgmt;
using System.Net.Http.Json;
using System.Text.Json;

namespace QMS_Certificate_Store_Portal.Services.Aira;

public sealed class AiraUserManagementClient : IAiraUserManagementClient
{
    private const string ApiKeyHeader = "X-Aira-Api-Key";

    private readonly HttpClient _httpClient;
    private readonly UserManagementOptions _options;
    private readonly ILogger<AiraUserManagementClient> _logger;

    public AiraUserManagementClient(
        HttpClient httpClient,
        IOptions<UserManagementOptions> options,
        ILogger<AiraUserManagementClient> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public Task<AiraApiResponse<AiraOtpSendResult>> SendOtpAsync(
        AiraOtpSendRequest request,
        CancellationToken cancellationToken = default)
    {
        return PostAsync<AiraOtpSendResult>(
            "api/app/login-otp/send",
            request,
            cancellationToken);
    }

    public Task<AiraApiResponse<AiraLoginUser>> VerifyOtpAsync(
        AiraOtpVerifyRequest request,
        CancellationToken cancellationToken = default)
    {
        return PostAsync<AiraLoginUser>(
            "api/app/login-otp/verify",
            request,
            cancellationToken);
    }

    private async Task<AiraApiResponse<T>> PostAsync<T>(
        string endpoint,
        object request,
        CancellationToken cancellationToken)
    {
        try
        {
            using var httpRequest = new HttpRequestMessage(
                HttpMethod.Post,
                endpoint);

            httpRequest.Headers.Add(
                ApiKeyHeader,
                _options.ApiKey);

            httpRequest.Content = JsonContent.Create(request);

            using var response = await _httpClient.SendAsync(
                httpRequest,
                cancellationToken);

            var responseText = await response.Content.ReadAsStringAsync(
                cancellationToken);


            _logger.LogInformation(
    "Aira OTP response. Endpoint: {Endpoint}, Status: {StatusCode}, Body: {ResponseBody}",
    endpoint,
    response.StatusCode,
    responseText
);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Aira rejected the request. Endpoint: {Endpoint}, Status: {StatusCode}, Body: {ResponseBody}",
                    endpoint,
                    response.StatusCode,
                    responseText
                );

                return new AiraApiResponse<T>
                {
                    Success = false,
                    Message =
                        $"Aira rejected the request: {responseText}"
                };
            }
            if (string.IsNullOrWhiteSpace(responseText))
            {
                return new AiraApiResponse<T>
                {
                    Success = false,
                    Message = "Aira returned an empty response."
                };
            }

            var result = JsonSerializer.Deserialize<AiraApiResponse<T>>(
                responseText,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (result == null)
            {
                return new AiraApiResponse<T>
                {
                    Success = false,
                    Message = "Invalid response received from Aira."
                };
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error while calling Aira endpoint {Endpoint}",
                endpoint);

            return new AiraApiResponse<T>
            {
                Success = false,
                Message = "Unable to connect to Aira User Management."
            };
        }
    }


    public async Task<AiraApiResponse<List<AiraSyncUser>>>
     GetUserByEmployeeCodeAsync(
         string employeeCode,
         CancellationToken cancellationToken = default)
    {
        try
        {
            var projectUrl = Uri.EscapeDataString(
                _options.ProjectUrl);

            // Do not send the search parameter.
            // Aira returns no result when searching by employeeCode.
            var endpoint =
                $"api/app/sync-users" +
                $"?projectUrl={projectUrl}";

            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                endpoint);

            request.Headers.Add(
                ApiKeyHeader,
                _options.ApiKey);

            using var response = await _httpClient.SendAsync(
                request,
                cancellationToken);

            var responseText =
                await response.Content.ReadAsStringAsync(
                    cancellationToken);

            var result =
                JsonSerializer.Deserialize<
                    AiraApiResponse<List<AiraSyncUser>>>(
                    responseText,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

            return result ?? new AiraApiResponse<List<AiraSyncUser>>
            {
                Success = false,
                Message = "Invalid user response from Aira."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error loading Aira users.");

            return new AiraApiResponse<List<AiraSyncUser>>
            {
                Success = false,
                Message = "Unable to get user details from Aira."
            };
        }
    }


    public async Task<AiraApiResponse<List<AiraSyncUser>>>
    GetAllUsersAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var projectUrl = Uri.EscapeDataString(
                _options.ProjectUrl
            );

            var endpoint =
                $"api/app/sync-users" +
                $"?projectUrl={projectUrl}" +
                $"&search=";

            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                endpoint
            );

            request.Headers.Add(
                ApiKeyHeader,
                _options.ApiKey
            );

            using var response = await _httpClient.SendAsync(
                request,
                cancellationToken
            );

            var responseText =
                await response.Content.ReadAsStringAsync(
                    cancellationToken
                );

            var result =
                JsonSerializer.Deserialize<
                    AiraApiResponse<List<AiraSyncUser>>
                >(
                    responseText,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                );

            return result ??
                new AiraApiResponse<List<AiraSyncUser>>
                {
                    Success = false,
                    Message = "Invalid response received from Aira."
                };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error loading all Aira users."
            );

            return new AiraApiResponse<List<AiraSyncUser>>
            {
                Success = false,
                Message = "Unable to load employees from Aira."
            };
        }



        // Implement GetAllCompaniesAsync method




    }

    public async Task<AiraApiResponse<List<AiraSyncCompany>>> GetAllCompaniesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var projectUrl = Uri.EscapeDataString(
                _options.ProjectUrl
            );

            var endpoint =
                $"api/app/sync/companies" +
                $"?projectUrl={projectUrl}";

            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                endpoint
            );

            request.Headers.Add(
                ApiKeyHeader,
                _options.ApiKey
            );

            using var response = await _httpClient.SendAsync(
                request,
                cancellationToken
            );

            var responseText =
                await response.Content.ReadAsStringAsync(
                    cancellationToken
                );

            var result =
                JsonSerializer.Deserialize<
                    AiraApiResponse<List<AiraSyncCompany>>
                >(
                    responseText,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                );

            return result ??
                new AiraApiResponse<List<AiraSyncCompany>>
                {
                    Success = false,
                    Message = "Invalid company response received from Aira."
                };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error loading companies from Aira."
            );
            
            return new AiraApiResponse<List<AiraSyncCompany>>
            {
                Success = false,
                Message = "Unable to load companies from Aira."
            };
        }
    }
}