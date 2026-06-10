using System.Collections.Generic;
using System.Threading.Tasks;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Services
{
    /// <summary>
    /// Sends approval notifications to the approver and the certificate creator.
    /// Uses <see cref="WhatsAppService"/> to dispatch WhatsApp template messages.
    /// </summary>
    public class ApprovalNotificationService
    {
        private readonly WhatsAppService _whatsApp;
        private readonly UserRepo _userRepo;

        public ApprovalNotificationService(WhatsAppService whatsApp, UserRepo userRepo)
        {
            _whatsApp = whatsApp;
            _userRepo = userRepo;
        }

        /// <summary>
        /// Sends a WhatsApp notification to both the approver and the creator of a certificate.
        /// </summary>
        /// <param name="approverUserId">UserId of the approver (taken from JWT claim).</param>
        /// <param name="creatorUserId">UserId of the certificate creator (stored in the certificate record).</param>
        /// <param name="certificateName">Human‑readable name of the certificate, used in the template.</param>
        public async Task NotifyAsync(int approverUserId, int creatorUserId, string certificateName)
        {
            // Fetch contact details for both users
            var approver = await _userRepo.GetByIdAsync(approverUserId);
            var creator = await _userRepo.GetByIdAsync(creatorUserId);

            // Guard against missing phone numbers – the WhatsAppService will log the failure.
            if (approver?.Phone != null)
            {
                await _whatsApp.SendTemplateNotificationAsync(approver.Phone);
            }

            if (creator?.Phone != null && creatorUserId != approverUserId)
            {
                await _whatsApp.SendTemplateNotificationAsync(creator.Phone);
            }
        }
    }
}
