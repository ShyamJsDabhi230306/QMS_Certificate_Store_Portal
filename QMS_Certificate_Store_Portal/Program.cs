using Aira.LiveSession;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using QMS.API.Services.Notification;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models.Configuration;
using QMS_Certificate_Store_Portal.Repositories.Notification;
using QMS_Certificate_Store_Portal.Repositories.UserMgmt;
using QMS_Certificate_Store_Portal.Services;
using QMS_Certificate_Store_Portal.Services.Aira;
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



    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var path = context.HttpContext.Request.Path;

            if (path.StartsWithSegments("/hubs/session"))
            {
                // WebSocket/SSE sends token in query string.
                var queryToken =
                    context.Request.Query["access_token"].ToString();

                if (!string.IsNullOrWhiteSpace(queryToken))
                {
                    context.Token = queryToken;
                }
                else
                {
                    // SignalR negotiation normally sends Authorization header.
                    var authorization =
                        context.Request.Headers.Authorization.ToString();

                    if (authorization.StartsWith(
                        "Bearer ",
                        StringComparison.OrdinalIgnoreCase))
                    {
                        context.Token =
                            authorization["Bearer ".Length..].Trim();
                    }
                }

                Console.WriteLine(
                    $"LiveSession authentication: Path={path}, " +
                    $"TokenFound={!string.IsNullOrWhiteSpace(context.Token)}"
                );
            }

            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            Console.WriteLine(
                $"LiveSession JWT failed: {context.Exception.Message}"
            );

            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine(
                $"LiveSession JWT challenge: " +
                $"Error={context.Error}, " +
                $"Description={context.ErrorDescription}"
            );

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddHttpClient<
    IAiraUserManagementClient,
    AiraUserManagementClient>((serviceProvider, client) =>
    {
        var options = serviceProvider
            .GetRequiredService<
                Microsoft.Extensions.Options.IOptions<UserManagementOptions>>()
            .Value;

        client.BaseAddress = new Uri(options.BaseUrl);
        client.Timeout = TimeSpan.FromSeconds(60);
    });
// Add services to the container.
// Register all services with one clean line
builder.Services.AddApplicationServices();

builder.Services.AddAiraLiveSession();
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

builder.Services
    .AddOptions<UserManagementOptions>()
    .Bind(builder.Configuration.GetSection("UserMgmt"))
    .Validate(options =>
        !string.IsNullOrWhiteSpace(options.BaseUrl) &&
        !string.IsNullOrWhiteSpace(options.ApiKey) &&
        !string.IsNullOrWhiteSpace(options.ProjectUrl),
        "UserMgmt configuration is incomplete.")
    .ValidateOnStart();

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

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", policy =>
//    {
//        policy.AllowAnyOrigin()   // This allows any website to talk to your API
//              .AllowAnyMethod()   // This allows GET, POST, DELETE, etc.
//              .AllowAnyHeader();  // This allows JSON headers
//    });
//});


//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("FrontendPolicy", policy =>
//    {
//        policy
//            .WithOrigins(
//                "https://certificate.core1.in"
//                "https://certificate-cair.core1.in",
//                "http://localhost:5173"



//            )
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .AllowCredentials();
//    });
//});


builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(

                    "https://certificate.core1.in"





            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
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

    var pageCatalogService =
       scope.ServiceProvider
           .GetRequiredService<PageCatalogService>();
    await pageCatalogService.EnsurePagesAsync();

    var userRightService =
       scope.ServiceProvider
           .GetRequiredService<UserRightService>();

    int[] designationIds = { 1, 2, 3, 4 };

    foreach (var idDesignation in designationIds)
    {
        await userRightService.InitializeForDesignationAsync(
            idDesignation,
            "SYSTEM"
        );
    }
    // Pass 'scope.ServiceProvider' instead of 'app.Services'
    //await DataSeeder.SeedAdminUser(scope.ServiceProvider);
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//app.UseCors("AllowAll");
app.UseCors("FrontendPolicy");

app.UseStaticFiles(); // Serves files from wwwroot (e.g. /uploads/certificates/file.pdf)

app.UseAuthentication();
app.UseAuthorization();

app.MapAiraLiveSession();

app.MapControllers();

app.Run();

