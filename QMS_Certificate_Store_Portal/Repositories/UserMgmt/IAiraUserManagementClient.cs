using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;

namespace QMS_Certificate_Store_Portal.Repositories.UserMgmt
{
    public interface IAiraUserManagementClient
    {
        Task<AiraApiResponse<AiraOtpSendResult>> SendOtpAsync(
    AiraOtpSendRequest request,
    CancellationToken cancellationToken = default);

        Task<AiraApiResponse<AiraLoginUser>> VerifyOtpAsync(
            AiraOtpVerifyRequest request,
            CancellationToken cancellationToken = default);
        Task<AiraApiResponse<List<AiraSyncUser>>> GetUserByEmployeeCodeAsync(
    string employeeCode,
    CancellationToken cancellationToken = default);



        Task<AiraApiResponse<List<AiraSyncUser>>>
    GetAllUsersAsync(
        CancellationToken cancellationToken = default);
    




    // we are do code for it company 

    Task<AiraApiResponse<List<AiraSyncCompany>>>
    GetAllCompaniesAsync(
        CancellationToken cancellationToken = default);

    }

}
