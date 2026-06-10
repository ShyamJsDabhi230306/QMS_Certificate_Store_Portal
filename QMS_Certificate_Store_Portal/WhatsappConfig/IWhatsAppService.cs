namespace QMS_Certificate_Store_Portal.WhatsappConfig
{
    public interface IWhatsAppService
    {
        Task<string> SendMessageAsync(
            string mobileNumber,
            string message);
    }
}
