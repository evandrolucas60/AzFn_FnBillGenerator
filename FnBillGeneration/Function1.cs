using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using BarcodeStandard;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using Newtonsoft.Json;

namespace FnBillGeneration
{
    public class GeneratorBarCode
    {
        private readonly ILogger<GeneratorBarCode> _logger;
        private readonly string _ServiceBusConnectionString;
        private readonly string _queueName = "generator-barcode";

        public GeneratorBarCode(ILogger<GeneratorBarCode> logger)
        {
            _logger = logger;
            _ServiceBusConnectionString = Environment.GetEnvironmentVariable("ServiceBusConnectionString");
        }

        [Function("barcode-generate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                string value = data?.value;
                string dueDate = data?.dueDate;
                string barcodeData;

                //Data validation
                if (string.IsNullOrEmpty(value) || string.IsNullOrEmpty(dueDate))
                {
                    return new BadRequestObjectResult("The fields value and dueData are request.");
                }

                //Validate date format YYYY-MM-DD
                if (!DateTime.TryParseExact(dueDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime parsedDate))
                {
                    return new BadRequestObjectResult("The field dueData is not in the correct format YYYY-MM-DD.");
                }

                string dateStr = parsedDate.ToString("yyyyMMdd");

                //validate value format until 8 digits
                if (!decimal.TryParse(value, out decimal decimalValue))
                {
                    return new BadRequestObjectResult("Value is invalid!");
                }
                int valueCents = (int)(decimalValue * 10);
                string valueStr = valueCents.ToString("D8");

                string bankCode = "006";
                string baseCode = string.Concat(bankCode, dateStr, valueStr);

                //barcode must be 44 characters
                barcodeData = baseCode.Length < 44 ? baseCode.PadRight(44, '0') : baseCode.Substring(0, 44);
                _logger.LogInformation($"Barcode generated: {barcodeData}");

                Barcode barcode = new Barcode();
                var skImage = barcode.Encode(BarcodeStandard.Type.Code128, barcodeData);

                using (var encodeData = skImage.Encode(SkiaSharp.SKEncodedImageFormat.Png, 100))
                {
                    var imageBytes = encodeData.ToArray();

                    string base64String = Convert.ToBase64String(imageBytes);

                    var resultObeject = new
                    {
                        Barcode = barcodeData,
                        billValue = value,
                        DueDate = DateTime.Now.AddDays(30),
                        ImagemBase64 = base64String,
                    };

                    await SendFileFallback(resultObeject, _ServiceBusConnectionString, _queueName);
                    return new OkObjectResult(resultObeject);
                }

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private async Task SendFileFallback(object resultObeject, string serviceBusConnectionString, string queueName)
        {
            await using var client = new ServiceBusClient(serviceBusConnectionString);

            ServiceBusSender sender = client.CreateSender(queueName);

            string messageBody = JsonConvert.SerializeObject(resultObeject);

            ServiceBusMessage message = new ServiceBusMessage(messageBody);

            await sender.SendMessageAsync(message);

            _logger.LogInformation($"Message sent to queue {queueName}: {messageBody}");
        }
    }
}
