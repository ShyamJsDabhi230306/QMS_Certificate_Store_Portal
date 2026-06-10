//#region

//using System;
//using System.IO;
//using System.Linq;
//using System.Net.Http;
//using System.Text;
//using System.Threading.Tasks;
//using System.Windows.Forms;
//using Newtonsoft.Json;

//#endregion

//namespace AiraBilling
//{
//    internal class WhatsAppTemplateFile
//    {
//        private readonly HttpClient _client = new HttpClient();
//        private readonly SqlHelp _sql = new SqlHelp();

//        public Task SendOtpMessage(string contact, string personName, string otp)
//        {
//            return SendTOtpMessage(contact, "aira_otp", otp);
//        }

//        public Task SendWorkOrderStatusMessage(string contact, string status, string woNo, string remarks)
//        {
//            return SendTemplateMessage(contact, "workorderstatusmsg", status, woNo, remarks);
//        }

//        public Task SendOaStatusMessage(string contact, string dispatchPerson, string oaNo, string time, string revisedBy, string remarks)
//        {
//            return SendTemplateMessage(contact, "oarevisenew", dispatchPerson, oaNo, time, revisedBy, remarks);
//        }

//        public Task SendLrMessage(string contact, string poNo, string oaNo, string invoiceNo, string lrNo,
//            string lrDate,
//            string lrAmt)
//        {
//            return SendTemplateMessage(contact, "ab_invoice_lr2", poNo, oaNo, invoiceNo, lrNo, lrDate, lrAmt);
//        }

//        public Task SendWorkOrderRejectMessage(string contact, string personName, string woNo, string woDate, string oaNo, string poNo, string remarks)
//        {
//            return SendTemplateMessage(contact, "ab_wo_rejection", personName, woNo, woDate, oaNo, poNo, remarks);
//        }

//        private async Task SendTemplateMessage(string contact, string template, params string[] parameters)
//        {
//            // Define payload for the request
//            //var payload = new
//            //{
//            //    token = "w05rz603rw73hv3j",
//            //    @namespace = "af43431e_0ba0_415a_9c9e_e7db9f5f718a",
//            //    template,
//            //    language = new { policy = "deterministic", code = "en" },
//            //    @params = new[]
//            //    {
//            //        new
//            //        {
//            //            type = "body",
//            //            parameters = parameters
//            //                .Select(param => new
//            //                {
//            //                    type = "text",
//            //                    text = string.IsNullOrWhiteSpace(param) ? "—" : param.Trim()
//            //                })
//            //                .ToArray()
//            //        }
//            //    },
//            //    phone = contact
//            //};

//            //string json;
//            //try
//            //{
//            //    // Serialize payload to JSON
//            //    json = JsonConvert.SerializeObject(payload);
//            //}
//            //catch (Exception ex)
//            //{
//            //    _sql.WriteLogs($"Error serializing payload: {ex.Message}");
//            //    return;
//            //}

//            //using (var content = new StringContent(json, Encoding.UTF8, "application/json"))
//            //{
//            //    try
//            //    {
//            //        var response = await _client.PostAsync("https://api.1msg.io/391000/sendTemplate", content);

//            //        if (response.IsSuccessStatusCode)
//            //        {
//            //            var responseBody = await response.Content.ReadAsStringAsync();
//            //            WriteLogs($"Message sent successfully: {responseBody}");
//            //        }
//            //        else
//            //        {
//            //            WriteLogs($"HTTP request failed: Status {response.StatusCode}, Reason {response.ReasonPhrase}");
//            //        }
//            //    }
//            //    catch (HttpRequestException httpEx)
//            //    {
//            //        WriteLogs($"HTTP request error: {httpEx.Message}");
//            //    }
//            //    catch (TaskCanceledException timeoutEx)
//            //    {
//            //        WriteLogs($"HTTP request timeout: {timeoutEx.Message}");
//            //    }
//            //    catch (Exception ex)
//            //    {
//            //        WriteLogs($"Unexpected error occurred: {ex.Message}");
//            //    }
//            //}
//        }

//        private async Task SendTOtpMessage(string contact, string template, params string[] parameters)
//        {
//            // Define payload for the request
//            var payload = new
//            {
//                token = "w05rz603rw73hv3j",
//                @namespace = "af43431e_0ba0_415a_9c9e_e7db9f5f718a",
//                template,
//                language = new { policy = "deterministic", code = "en" },
//                @params = new object[]
//{
//                new
//                {
//                    type = "body",
//                    parameters = parameters.Select(p => new
//                    {
//                        type = "text",
//                        text = string.IsNullOrWhiteSpace(p) ? "—" : p.Trim()
//                    }).ToArray()
//                },
//                new
//                {
//                    type = "button",
//                    sub_type = "url",
//                    index = "0",
//                    parameters = new[]
//                    {
//                        new
//                        {
//                            type = "text",
//                            text = "Copy"
//                        }
//                    }
//                }
//            },
//                phone = contact
//            };

//            string json;
//            try
//            {
//                // Serialize payload to JSON
//                json = JsonConvert.SerializeObject(payload);
//            }
//            catch (Exception ex)
//            {
//                _sql.WriteLogs($"Error serializing payload: {ex.Message}");
//                return;
//            }

//            using (var content = new StringContent(json, Encoding.UTF8, "application/json"))
//            {
//                try
//                {
//                    var response = await _client.PostAsync("https://api.1msg.io/391000/sendTemplate", content);

//                    if (response.IsSuccessStatusCode)
//                    {
//                        var responseBody = await response.Content.ReadAsStringAsync();
//                        WriteLogs($"Message sent successfully: {responseBody}");
//                    }
//                    else
//                    {
//                        WriteLogs($"HTTP request failed: Status {response.StatusCode}, Reason {response.ReasonPhrase}");
//                    }
//                }
//                catch (HttpRequestException httpEx)
//                {
//                    WriteLogs($"HTTP request error: {httpEx.Message}");
//                }
//                catch (TaskCanceledException timeoutEx)
//                {
//                    WriteLogs($"HTTP request timeout: {timeoutEx.Message}");
//                }
//                catch (Exception ex)
//                {
//                    WriteLogs($"Unexpected error occurred: {ex.Message}");
//                }
//            }
//        }

//        public async Task SendHeaderAttachmentMsg(string contact, string templateName, string documentLink,
//            string fileName, params string[] messageBodies)
//        {
//            //using (var client = new HttpClient())
//            //{
//            //    var url = "https://api.1msg.io/391000/sendTemplate";

//            //    var requestData = new
//            //    {
//            //        token = "w05rz603rw73hv3j",
//            //        @namespace = "af43431e_0ba0_415a_9c9e_e7db9f5f718a",
//            //        template = templateName,
//            //        language = new
//            //        {
//            //            policy = "deterministic",
//            //            code = "en"
//            //        },
//            //        @params = new object[]
//            //        {
//            //            new
//            //            {
//            //                type = "header",
//            //                parameters = new object[]
//            //                {
//            //                    new
//            //                    {
//            //                        type = "document",
//            //                        document = new
//            //                        {
//            //                            link = documentLink,
//            //                            filename = fileName
//            //                        }
//            //                    }
//            //                }
//            //            },
//            //            new
//            //            {
//            //                type = "body",
//            //                parameters = messageBodies.Select(body => new { type = "text", text = body }).ToArray()
//            //            }
//            //        },
//            //        phone = contact
//            //    };

//            //    var json = JsonConvert.SerializeObject(requestData);
//            //    var content = new StringContent(json, Encoding.UTF8, "application/json");

//            //    try
//            //    {
//            //        var response = await client.PostAsync(url, content);
//            //        var responseString = await response.Content.ReadAsStringAsync();
//            //        WriteLogs("Response: " + responseString);
//            //    }
//            //    catch (Exception ex)
//            //    {
//            //        WriteLogs("Error: " + ex.Message);
//            //    }
//            //}
//        }


//        public void WriteLogs(string message)
//        {
//            var logMessage = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}";
//            var path = Application.StartupPath + "\\Logs\\WhatsAppLogs.txt";
//            using (var writer = new StreamWriter(path, true))
//            {
//                writer.WriteLine(logMessage);
//                writer.Close();
//            }
//        }
//    }
//}