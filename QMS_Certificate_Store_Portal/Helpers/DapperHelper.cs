using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
namespace Airmax_Payroll_System.Helpers
{

    public interface IDapperHelper
    {
        Task<IEnumerable<T>> QueryAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
        Task<T?> QueryFirstOrDefaultAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
        Task<T?> QuerySingleOrDefaultAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
        Task<T> QuerySingleAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
        Task<int> ExecuteAsync(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
        Task<(SqlMapper.GridReader Reader, SqlConnection Conn)> QueryMultipleAsync(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
        Task<T?> ExecuteScalarAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure);
    }

    public class DapperHelper : IDapperHelper   
    {
        private readonly string  _connectionString;
        private readonly int _defaultTimeout = 60;
        private readonly bool _showSqlError;
        public DapperHelper(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")
                 ?? throw new Exception("connection string 'DefaultConnection' not found");
            _showSqlError = 
                (config["ASPNETCORE_ENVIRONMENT" ?? "Production"])
                        .Equals("Devlopment", StringComparison.OrdinalIgnoreCase);

        }
        private SqlConnection CreateConnection() => new SqlConnection(_connectionString);
        public async Task<int> ExecuteAsync(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                return await conn.ExecuteAsync(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                return await conn.QueryAsync<T>(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<T?> QueryFirstOrDefaultAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                return await conn.QueryFirstOrDefaultAsync<T>(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<T> QuerySingleAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                return await conn.QuerySingleAsync<T>(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<T?> QuerySingleOrDefaultAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                return await conn.QuerySingleOrDefaultAsync<T>(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<(SqlMapper.GridReader Reader, SqlConnection Conn)> QueryMultipleAsync(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            var conn = CreateConnection();
            try
            {
                await conn.OpenAsync();
                var reader = await conn.QueryMultipleAsync(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);

                return (reader, conn);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<T?> ExecuteScalarAsync<T>(string sp, object? param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                return await conn.ExecuteScalarAsync<T>(sp, param,
                    commandType: commandType,
                    commandTimeout: _defaultTimeout);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //private void ThrowFormattedException(string sp, object? param, Exception ex)
        //{
        //    Log.Error(ex, "SQL Error in {StoredProcedure} with params {@Params}", sp, param);

        //    if (ex is SqlException sqlEx && _showSqlError)
        //    {
        //        var detailedMessage =
        //            $"SQL Error {sqlEx.Number} at Line {sqlEx.LineNumber} " +
        //            $"in {sqlEx.Procedure}: {sqlEx.Message}";

        //        throw new Exception(detailedMessage, sqlEx);
        //    }

        //    throw new Exception("Database operation failed. Please contact administrator.");
        //}
    }
}
