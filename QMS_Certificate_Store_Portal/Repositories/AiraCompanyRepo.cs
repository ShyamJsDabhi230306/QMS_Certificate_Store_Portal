using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;

namespace QMS_Certificate_Store_Portal.Repositories;

public sealed class AiraCompanyRepo
{
    private readonly IDapperHelper _dapper;

    public AiraCompanyRepo(IDapperHelper dapper)
    {
        _dapper = dapper;
    }

    public async Task<AiraSyncCompany?> UpsertAsync(
        AiraSyncCompany company)
    {
        var parameters = new DynamicParameters();

        parameters.Add("@IDCompany", company.IDCompany);
        parameters.Add("@CompanyCode", company.CompanyCode);
        parameters.Add("@CompanyName", company.CompanyName);
        parameters.Add("@GSTIN", company.GSTIN);
        parameters.Add("@PAN", company.PAN);
        parameters.Add("@OfficeAddress", company.OfficeAddress);
        parameters.Add("@FactoryAddress", company.FactoryAddress);
        parameters.Add("@City", company.City);
        parameters.Add("@State", company.State);
        parameters.Add("@Country", company.Country);
        parameters.Add("@Pincode", company.Pincode);
        parameters.Add("@ContactNo", company.ContactNo);
        parameters.Add("@LogoFileName", company.LogoFileName);
        parameters.Add("@LogoBase64", company.LogoBase64);
        parameters.Add("@IsActive", company.IsActive);

        return await _dapper.QueryFirstOrDefaultAsync<AiraSyncCompany>(
            "dbo.usp_Aira_Company_Upsert",
            parameters
        );
    }

    public async Task<IEnumerable<AiraSyncCompany>>
    GetAllAsync()
    {
        return await _dapper.QueryAsync<AiraSyncCompany>(
            "dbo.usp_Aira_Company_SelectAll"
        );
    }


    public async Task<AiraSyncCompany?>
    SelectOneAsync(int idCompany)
    {
        var parameters = new DynamicParameters();

        parameters.Add(
            "@IDCompany",
            idCompany
        );

        return await _dapper.QueryFirstOrDefaultAsync<AiraSyncCompany>(
            "dbo.usp_Aira_Company_SelectOne",
            parameters
        );
    }
}