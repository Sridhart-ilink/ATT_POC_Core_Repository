using System;
using ATTWebAppAPI.Models;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace ATTWebAppAPI.Controllers
{
    [Route("api/[controller]")]
    public class BPMWorkFlowController : Controller
    {
        public IConfiguration Configuration { get; set; }

        public BPMWorkFlowController()
        {
            var builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory());
            builder.AddJsonFile("appsettings.json");

            Configuration = builder.Build();
        }

        // GET api/task        
        [EnableCors("AllowCors"), Route("api/[controller]")]        
        public string GetAllWorkFlowTask()
        {

            //var serverName = System.Configuration.ConfigurationManager.AppSettings.Get("serverName");
            string serverName = Convert.ToString(Configuration["serverName"]);
            var client = new RestClient();
            client.EndPoint = @"http://"+serverName+":8080/engine-rest/task"; 
            client.Method = HttpVerb.GET;
            string strJson = client.MakeRequest();
            return strJson;
        }
                
        [EnableCors("AllowCors"), Route("api/task-by-process-instance/{id}")]
        public string GetActivityInstance(string id)
        {
            //var serverName = System.Configuration.ConfigurationManager.AppSettings.Get("serverName");
            string serverName = Convert.ToString(Configuration["serverName"]);
            var client = new RestClient();
            client.EndPoint = @"http://" + serverName + ":8080/engine-rest/task/?processInstanceId=" + id;
            client.Method = HttpVerb.GET;
            string strJson = client.MakeRequest();
            return strJson;
        }

        // GET api/products/5
        public string Get(int id)
        {
            return "value";
        }

        //public void StartProcess(string name,[FromBody]string value)
        // POST process-definition/key/{key}/start
        [EnableCors("AllowCors"), Route("api/process-definition")]        
        public string StartProcess(JObject jsonData)        
        {
            //var serverName = System.Configuration.ConfigurationManager.AppSettings.Get("serverName");
            string serverName = Convert.ToString(Configuration["serverName"]);
            dynamic json = jsonData;
            var endPoint = @"http://"+serverName+":8080/engine-rest/process-definition/key/" + json.key + "/start";
            var method = HttpVerb.POST;
            JObject variables = json.variables;
            string PostData = "{}";
            if (variables != null && variables.Count > 0)
            {
                var jsonObject = new JObject();
                jsonObject.Add("variables", variables);
                PostData = Convert.ToString(jsonObject);
            }
            var client = new RestClient(endPoint, method, PostData, "application/json");
            string strJson = client.MakeRequest();
            return strJson;            
        }

        // POST task{id}/complete
        [EnableCors("AllowCors"), Route("api/taskcomplete")]        
        public string TaskComplete(JObject jsonData)
        {
            //var serverName = System.Configuration.ConfigurationManager.AppSettings.Get("serverName");
            string serverName = Convert.ToString(Configuration["serverName"]);
            dynamic json = jsonData;
            var endPoint = @"http://"+serverName+":8080/engine-rest/task/" + json.id + "/complete";
            var method = HttpVerb.POST;
            JObject variables = json.variables;
            string PostData  = "{}";
            if (variables != null && variables.Count > 0)
            {
                var jsonObject = new JObject();
                jsonObject.Add("variables", variables);
                PostData = Convert.ToString(jsonObject);
            }
            var client = new RestClient(endPoint, method, PostData, "application/json");
            string strJson = client.MakeRequest();
            return strJson;
        }

        // PUT api/products/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/products/5
        public void Delete(int id)
        {
        }
    }
}
