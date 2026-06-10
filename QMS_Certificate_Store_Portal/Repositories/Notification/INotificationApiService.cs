namespace QMS_Certificate_Store_Portal.Repositories.Notification
{
    public interface INotificationApiService
    {
        Task<string> SendNotificationAsync(
           string subject,
           string header,
           string message,
           string footer,
           List<string> userPhones,
           string category,
           string subCategory);
    }

}
