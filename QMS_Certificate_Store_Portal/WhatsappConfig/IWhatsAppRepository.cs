using QMS_Certificate_Store_Portal.Models;

namespace QMS_Certificate_Store_Portal.WhatsappConfig
{
    public interface IWhatsAppRepository
    {
        Task<WhatsAppConfigDto> GetWhatsAppConfigAsync();
    }
}
