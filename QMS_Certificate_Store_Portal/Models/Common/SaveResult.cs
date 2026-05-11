namespace QMS_Certificate_Store_Portal.Models.Common
{
    public class SaveResult
    {
        public int Result { get; set; }
        public string Message { get; set; } = "";
        public int? NewId { get; set; }
        public string RefNo { get; set; } = "";
        public string ErrorCode { get; set; } = "";
        public Dictionary<string, object>? Extra { get; set; }

        public bool IsSuccess => Result > 0;

        public static SaveResult Fail(string message, string errorCode = "")
        {
            return new SaveResult { Result = -1, Message = message, ErrorCode = errorCode };
        }

        public static SaveResult Success(string message, int? newId = null)
        {
            return new SaveResult { Result = 1, Message = message, NewId = newId };
        }
    }
}
