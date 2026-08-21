using QMS_Certificate_Store_Portal.Helpers;

namespace QMS_Certificate_Store_Portal.Services
{
    public sealed class PageCatalogService
    {
        private readonly IDapperHelper _dapper;

        public PageCatalogService(IDapperHelper dapper)
        {
            _dapper = dapper;
        }

        public async Task EnsurePagesAsync()
        {
            foreach (var page in PageCatalogDefinition.Items)
            {
                await _dapper.QueryFirstOrDefaultAsync<PageEnsureResult>(
                    "usp_Master_Page_Ensure",
                    new
                    {
                        PageCode = page.PageCode,
                        PageName = page.PageName,
                        ActionUser = "SYSTEM",
                        Remarks = page.Remarks
                    });
            }
        }

        private sealed class PageEnsureResult
        {
            public int Result { get; set; }
            public string? Message { get; set; }
            public int? IDPage { get; set; }
            public string? PageCode { get; set; }
        }
    }
}
