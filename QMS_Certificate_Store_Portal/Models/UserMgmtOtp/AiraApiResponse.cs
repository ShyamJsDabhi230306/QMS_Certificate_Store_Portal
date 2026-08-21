namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class AiraApiResponse<T>
    {
        public bool Success { get; set; }

        public string? Message { get; set; }

        public T? Data { get; set; }
    }
}
