using ATTWebAppAPI.DAL;
using ATTWebAppAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Net.Http;
using System.Text;

namespace ATTWebAppAPI.Controllers
{
    [EnableCors("AllowCors")]
    public class SarfController : BaseApiController
    {
        SarfDao sarfDao = null;
        static long transId = 0;
        static bool isValidArea = true;
        static int nodeOfNodes = 0;
        public SarfController()
        {
            sarfDao = new SarfDao();
        }

        [HttpPost]
        [Route("Sarf/Post")]
        public HttpResponseMessage PostSarf([FromBody] Sarf sarf)
        {
            try
            {
                sarf.CreatedDate = DateTime.Now;
                transId = sarfDao.SaveSarf(sarf);
                isValidArea = sarf.IsValidArea;
                return WrapObjectToHttpResponse(transId);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateSarf/Post")]
        public HttpResponseMessage UpdateSarf([FromBody] Sarf sarf)
        {
            try
            {
                sarf.CreatedDate = DateTime.Now;
                sarfDao.UpdateSarf(sarf);
                return WrapObjectToHttpResponse(1);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateSarfStatus")]
        public HttpResponseMessage UpdateSarfStatus([FromBody] Sarf sarf)
        {
            try
            {
                sarfDao.UpdateSarfStatus(sarf);
                return WrapObjectToHttpResponse(1);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }
        
        [HttpGet("SarfDetails/Get")]
        public string GetSarfDetails()
        {
            try
            {
                return DataTableToJSONWithStringBuilder(sarfDao.GetSarfDetails());
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet("GetStatusByID/{id}")]        
        public string GetSarfStatusByID(int id)
        {
            try
            {
                return sarfDao.GetSarfStatusByID(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("AllSarfDetails/Get/{sarfID}")]
        public string GetAllSarfDetails(int sarfID)
        {
            try
            {
                return DataTableToJSONWithStringBuilder(sarfDao.GetAllSarfDetails(sarfID));
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("SarfDetailsByTaskID/Get/{taskID}")]
        public DataTable SarfDetailsByTaskID(string taskID)
        {
            try
            {
                return sarfDao.SarfDetailsByTaskID(taskID);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpPost]
        [Route("Polygon/Post")]
        public HttpResponseMessage PostPolygon([FromBody] Polygon polygon)
        {
            try
            {
                polygon.ModifiedDate = DateTime.Now;
                long polyId = sarfDao.SavePolygon(polygon, transId);
                polygon.SarfId = (int)transId;
                nodeOfNodes = isValidArea ? GenerateNodesAndHubs(polygon, isValidArea) : 0;
                return WrapObjectToHttpResponse(nodeOfNodes);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAllPolygon/Get")]
        public DataTable GetAllPolygons()
        {
            try
            {
                return sarfDao.GetAllPolygons();
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("Test/Get")]        
        public HttpResponseMessage TestGet()
        {
            try
            {
                long transId = 1;
                return WrapObjectToHttpResponse(transId);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("Node/Get/{nodeId}")]
        public HttpResponseMessage GetNodeByID(int nodeId)
        {
            try
            {
                var result = sarfDao.GetNodeByID(nodeId);
                return WrapObjectToHttpResponse(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("Hub/Get/{hubId}")]
        public HttpResponseMessage GetHubByID(int hubId)
        {
            try
            {
                var result = sarfDao.GetHubByID(hubId);
                return WrapObjectToHttpResponse(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("GetNodesBySarfID/{sarfID}")]
        public HttpResponseMessage GetNodesBySarfID(int sarfID)
        {
            try
            {
                var result = sarfDao.GetNodesBySarfID(sarfID);
                return WrapObjectToHttpResponse(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHubsBySarfID/{sarfID}")]
        public HttpResponseMessage GetHubsBySarfID(int sarfID)
        {
            try
            {
                var result = sarfDao.GetHubsBySarfID(sarfID);
                return WrapObjectToHttpResponse(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpPost]
        [Route("Node/Post")]
        public HttpResponseMessage SaveNode([FromBody]Node node)
        {
            try
            {
                var result = sarfDao.SaveNode(node);
                return WrapObjectToHttpResponse(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        [HttpPost]
        [Route("Hub/Post")]
        public HttpResponseMessage SaveHub([FromBody]Hub hub)
        {
            try
            {
                var result = sarfDao.SaveHub(hub);
                return WrapObjectToHttpResponse(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Error : " + ex.Message);
            }
        }

        public string DataTableToJSONWithStringBuilder(DataTable table)
        {
            var JSONString = new StringBuilder();
            if (table.Rows.Count > 0)
            {
                JSONString.Append("[");
                for (int i = 0; i < table.Rows.Count; i++)
                {
                    JSONString.Append("{");
                    for (int j = 0; j < table.Columns.Count; j++)
                    {
                        if (j < table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\",");
                        }
                        else if (j == table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\"");
                        }
                    }
                    if (i == table.Rows.Count - 1)
                    {
                        JSONString.Append("}");
                    }
                    else
                    {
                        JSONString.Append("},");
                    }
                }
                JSONString.Append("]");
            }
            return JSONString.ToString();
        }
    }
}
