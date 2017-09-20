using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ATTPOCWebApp.Models;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace ATTPOCWebApp.Controllers
{
    public class HomeController : Controller
    {
        public IConfiguration Configuration { get; set; }
        string sarfID = "";

        public HomeController()
        {
            var builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory());
            builder.AddJsonFile("appsettings.json");

            Configuration = builder.Build();
        }


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CRANDetails(string processInstanceId, long sarfid)
        {
            //sarfID = Request.QueryString["processInstanceId"].ToString();
            //workflowImg.Attributes["src"] = System.Configuration.ConfigurationManager.AppSettings.Get("WFImgUrl") + sarfID;
            string serviceUrl = string.Format("{0}{1}", Convert.ToString(Configuration["WFImgUrl"]), sarfid);
            CRANDetailsModel cRANDetailsModel = new CRANDetailsModel();
            cRANDetailsModel.ProcessInstanceId = processInstanceId;
            cRANDetailsModel.Source = serviceUrl;
            cRANDetailsModel.SarfId = sarfid;
            return View(cRANDetailsModel);
        }

        private void bindSarfDetails()
        {
            using (var client = new HttpClient())
            {
                string serviceUrl = Convert.ToString(Configuration["ServiceUrl"]);
                client.BaseAddress = new Uri(serviceUrl);
                var response = client.GetAsync("SarfDetailsByTaskID/Get/" + sarfID).Result;
                var data = response.Content.ReadAsStringAsync();
                var dt = JsonConvert.DeserializeObject<DataTable>(data.Result);
                if (response.IsSuccessStatusCode && dt.Rows != null && dt.Rows.Count > 0)
                {
                    //txtsarfname.Value = dt.Rows[0][0].ToString();
                    //txtfacode.Value = dt.Rows[0][1].ToString();
                    //txtsearchring.Value = dt.Rows[0][2].ToString();
                    //txtiplan.Value = dt.Rows[0][3].ToString();
                    //txtpace.Value = dt.Rows[0][4].ToString();
                    //txtmarket.Value = dt.Rows[0][5].ToString();
                    //txtcounty.Value = dt.Rows[0][6].ToString();
                    //txtfatype.Value = dt.Rows[0][7].ToString();
                    //txtmarketcluster.Value = dt.Rows[0][8].ToString();
                    //txtregion.Value = dt.Rows[0][9].ToString();
                    //txtrfdesign.Value = dt.Rows[0][10].ToString();
                    //txtarea.Value = (int.Parse(dt.Rows[0][13].ToString()) * 0.386102).ToString("N3");
                }
            }

        }
    }
}
