using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using QMS.API.Services.Notification;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Repositories.Notification;
using QMS_Certificate_Store_Portal.Services;
using QMS_Certificate_Store_Portal.WhatsappConfig;
using System.Text;
var builder = WebApplication.CreateBuilder(args);



// --- ADD THIS SECTION: JWT Configuration ---
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("JWT Key is missing");
var key = Encoding.UTF8.GetBytes(jwtKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
// Add services to the container.
// Register all services with one clean line
builder.Services.AddApplicationServices();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<ApprovalNotificationService>();
builder.Services.AddHttpClient<WhatsAppService>();
builder.Services.AddScoped<ICertificateReminderProcessor,CertificateReminderProcessor>();
builder.Services.AddScoped<ICertificateReminderRepository,CertificateReminderRepository>();
builder.Services.AddHttpClient<INotificationApiService, NotificationApiService>();
builder.Services.AddScoped<CertificateReminderJob>();
builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();
//builder.Services.AddScoped<IWhatsAppRepository, WhatsAppRepository>();
//builder.Services.AddHostedService<CertificateReminderWorker>();



// Update your builder.Services.AddSwaggerGen() to this:
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token here: Bearer {your_token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
{
    {
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Reference = new Microsoft.OpenApi.Models.OpenApiReference
            {
                // Try changing it to this:
                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        new string[] {}
    }
});

});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // This allows any website to talk to your API
              .AllowAnyMethod()   // This allows GET, POST, DELETE, etc.
              .AllowAnyHeader();  // This allows JSON headers
    });
});

var app = builder.Build();
app.UseHangfireDashboard("/hangfire");
RecurringJob.AddOrUpdate<CertificateReminderJob>(
    "certificate-reminder-job",
    x => x.Execute(),
    Cron.Minutely());
using (var scope = app.Services.CreateScope())
{
    // Pass 'scope.ServiceProvider' instead of 'app.Services'
    await DataSeeder.SeedAdminUser(scope.ServiceProvider); 
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseStaticFiles(); // Serves files from wwwroot (e.g. /uploads/certificates/file.pdf)

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

