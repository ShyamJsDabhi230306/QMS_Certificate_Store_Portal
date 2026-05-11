namespace QMS_Certificate_Store_Portal.Models.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public T? Data { get; set; }
        public string ErrorCode { get; set; } = "";
        public string? DebugInfo { get; set; }

        // SUCCESS
        public static ApiResponse<T> SuccessResponse(string message, T? data = default)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        // FAIL
        public static ApiResponse<T> FailResponse(string message, string errorCode = "")
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                ErrorCode = errorCode
            };
        }
    }
}
