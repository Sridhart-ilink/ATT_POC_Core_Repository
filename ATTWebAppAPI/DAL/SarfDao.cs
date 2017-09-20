using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Configuration; 
using System.Data;
using System.Data.Common;
using ATTWebAppAPI.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.Configuration.Xml;
using System.IO;

namespace ATTWebAppAPI.DAL
{
    public class SarfDao
    {
        public IConfiguration Configuration { get; set; }
        public string connString = string.Empty;
        public SarfDao() {
            var builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory());
            builder.AddJsonFile("appsettings.json");

            Configuration = builder.Build();
            connString = Convert.ToString(Configuration["ConnectionString"]);
        }        

        #region Get Methods
        public DataTable GetSarfDetails()
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT S.SARFID,S.SARFNAME,S.ProcessInstanceID, S.SarfStatus, S.AtollSiteName, S.RF_Design_Engineer_ATTUID, P.Vertices,P.AreaInSqKm FROM SARF S JOIN Polygon P ON S.SarfId=P.SarfId order by S.DateCreated desc;";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        DataTable dt = new DataTable();
                        dt.Columns.Add("SARFID");
                        dt.Columns.Add("SARFNAME");
                        dt.Columns.Add("ProcessInstanceID");
                        dt.Columns.Add("SarfStatus");
                        dt.Columns.Add("AtollSiteName");
                        dt.Columns.Add("RF_Design_Engineer_ATTUID");
                        dt.Columns.Add("Vertices");
                        dt.Columns.Add("AreaInSqKm"); 
                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["SARFID"] = mySqlDataReader["SARFID"];
                            dataRow["SARFNAME"] = mySqlDataReader["SARFNAME"];
                            dataRow["ProcessInstanceID"] = mySqlDataReader["ProcessInstanceID"];
                            dataRow["SarfStatus"] = mySqlDataReader["SarfStatus"];
                            dataRow["AtollSiteName"] = mySqlDataReader["AtollSiteName"];
                            dataRow["RF_Design_Engineer_ATTUID"] = mySqlDataReader["RF_Design_Engineer_ATTUID"];
                            dataRow["Vertices"] = mySqlDataReader["Vertices"];
                            dataRow["AreaInSqKm"] = mySqlDataReader["AreaInSqKm"];
                            dt.Rows.Add(dataRow);
                        }

                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable GetNodeByID(int nodeId)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT * from NODE WHERE NodeId=" + nodeId + ";";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {   
                        DataTable dt = new DataTable();
                        dt.Columns.Add("NodeId");
                        dt.Columns.Add("SarfId");
                        dt.Columns.Add("Latitude");
                        dt.Columns.Add("Longitude");
                        dt.Columns.Add("AtollSiteName");
                        dt.Columns.Add("iPlanJobNumber");
                        dt.Columns.Add("PaceNumber");
                        dt.Columns.Add("DateCreated");
                        dt.Columns.Add("DateModified");
                        dt.Columns.Add("HubId");
                        dt.Columns.Add("NodeType");
                        dt.Columns.Add("VendorName");
                        dt.Columns.Add("ContactPolice");
                        dt.Columns.Add("ContactFire");
                        dt.Columns.Add("ContactEnergy");
                        dt.Columns.Add("IsATTOwned");
                        dt.Columns.Add("StructureHeight");
                        dt.Columns.Add("Company");
                        dt.Columns.Add("BusinessPhone");
                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["NodeId"] = mySqlDataReader["NodeId"];
                            dataRow["SarfId"] = mySqlDataReader["SarfId"];
                            dataRow["Latitude"] = mySqlDataReader["Latitude"];
                            dataRow["Longitude"] = mySqlDataReader["Longitude"];
                            dataRow["AtollSiteName"] = mySqlDataReader["AtollSiteName"];
                            dataRow["iPlanJobNumber"] = mySqlDataReader["iPlanJobNumber"];
                            dataRow["PaceNumber"] = mySqlDataReader["PaceNumber"];
                            dataRow["DateCreated"] = mySqlDataReader["DateCreated"];
                            dataRow["DateModified"] = mySqlDataReader["DateModified"];
                            dataRow["HubId"] = mySqlDataReader["HubId"];
                            dataRow["NodeType"] = mySqlDataReader["NodeType"];
                            dataRow["VendorName"] = mySqlDataReader["VendorName"];
                            dataRow["ContactPolice"] = mySqlDataReader["ContactPolice"];
                            dataRow["ContactFire"] = mySqlDataReader["ContactFire"];
                            dataRow["ContactEnergy"] = mySqlDataReader["ContactEnergy"];
                            dataRow["IsATTOwned"] = mySqlDataReader["IsATTOwned"];
                            dataRow["StructureHeight"] = mySqlDataReader["StructureHeight"];
                            dataRow["Company"] = mySqlDataReader["Company"];
                            dataRow["BusinessPhone"] = mySqlDataReader["BusinessPhone"];
                            dt.Rows.Add(dataRow);
                        }                        
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable GetHubByID(int hubId)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT * from HUB WHERE HubId=" + hubId + ";";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {                        
                        DataTable dt = new DataTable();
                        dt.Columns.Add("HubId");
                        dt.Columns.Add("SarfId");
                        dt.Columns.Add("Latitude");
                        dt.Columns.Add("Longitude");
                        dt.Columns.Add("Address");
                        dt.Columns.Add("DateCreated");
                        dt.Columns.Add("DateModified");
                        dt.Columns.Add("HubType");
                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["HubId"] = mySqlDataReader["HubId"];
                            dataRow["SarfId"] = mySqlDataReader["SarfId"];
                            dataRow["Latitude"] = mySqlDataReader["Latitude"];
                            dataRow["Longitude"] = mySqlDataReader["Longitude"];
                            dataRow["Address"] = mySqlDataReader["Address"];
                            dataRow["DateCreated"] = mySqlDataReader["DateCreated"];
                            dataRow["DateModified"] = mySqlDataReader["DateModified"];
                            dataRow["HubType"] = mySqlDataReader["HubType"];
                            dt.Rows.Add(dataRow);
                        }
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable GetNodesBySarfID(int sarfId)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {

                    string query = "SELECT node.AtollSiteName,iPlanJobNumber, Latitude,Longitude, HubId, NodeType, VendorName,ContactPolice,ContactFire,ContactEnergy,BusinessPhone,IsATTOwned,StructureHeight,Company,sarf.SarfStatus FROM NODE join SARF on node.sarfid=sarf.sarfid WHERE node.SarfId=" + sarfId + ";";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {                        
                        DataTable dt = new DataTable();
                        dt.Columns.Add("AtollSiteName");
                        dt.Columns.Add("iPlanJobNumber");
                        dt.Columns.Add("Latitude");
                        dt.Columns.Add("Longitude");
                        dt.Columns.Add("HubId");
                        dt.Columns.Add("NodeType");
                        dt.Columns.Add("VendorName");
                        dt.Columns.Add("ContactPolice");
                        dt.Columns.Add("ContactFire");
                        dt.Columns.Add("ContactEnergy");
                        dt.Columns.Add("BusinessPhone");
                        dt.Columns.Add("IsATTOwned");
                        dt.Columns.Add("StructureHeight");
                        dt.Columns.Add("Company");
                        dt.Columns.Add("SarfStatus");

                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["AtollSiteName"] = mySqlDataReader["AtollSiteName"];
                            dataRow["iPlanJobNumber"] = mySqlDataReader["iPlanJobNumber"];
                            dataRow["Latitude"] = mySqlDataReader["Latitude"];
                            dataRow["Longitude"] = mySqlDataReader["Longitude"];
                            dataRow["HubId"] = mySqlDataReader["HubId"];
                            dataRow["NodeType"] = mySqlDataReader["NodeType"];
                            dataRow["VendorName"] = mySqlDataReader["VendorName"];
                            dataRow["ContactPolice"] = mySqlDataReader["ContactPolice"];
                            dataRow["ContactFire"] = mySqlDataReader["ContactFire"];
                            dataRow["ContactEnergy"] = mySqlDataReader["ContactEnergy"];
                            dataRow["BusinessPhone"] = mySqlDataReader["BusinessPhone"];
                            dataRow["IsATTOwned"] = mySqlDataReader["IsATTOwned"];
                            dataRow["StructureHeight"] = mySqlDataReader["StructureHeight"];
                            dataRow["Company"] = mySqlDataReader["Company"];
                            dataRow["SarfStatus"] = mySqlDataReader["SarfStatus"];
                            dt.Rows.Add(dataRow);
                        }
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable GetHubsBySarfID(int sarfId)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT * from HUB WHERE SarfId=" + sarfId + ";";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        DataTable dt = new DataTable();
                        dt.Columns.Add("HubId");
                        dt.Columns.Add("SarfId");
                        dt.Columns.Add("Latitude");
                        dt.Columns.Add("Longitude");
                        dt.Columns.Add("Address");
                        dt.Columns.Add("DateCreated");
                        dt.Columns.Add("DateModified");
                        dt.Columns.Add("HubType");
                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["HubId"] = mySqlDataReader["HubId"];
                            dataRow["SarfId"] = mySqlDataReader["SarfId"];
                            dataRow["Latitude"] = mySqlDataReader["Latitude"];
                            dataRow["Longitude"] = mySqlDataReader["Longitude"];
                            dataRow["Address"] = mySqlDataReader["Address"];
                            dataRow["DateCreated"] = mySqlDataReader["DateCreated"];
                            dataRow["DateModified"] = mySqlDataReader["DateModified"];
                            dataRow["HubType"] = mySqlDataReader["HubType"];
                            dt.Rows.Add(dataRow);
                        }
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable GetAllSarfDetails(int sarfId)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT s.SarfName,s.FA_Code,s.Search_Ring_ID,s.iPlan_Job, " +
                        "s.Pace,s.Market,s.County,s.FA_Type,s.Market_Cluster,s.Region," +
                        "s.RF_Design_Engineer_ATTUID, s.SarfStatus, s.AtollSiteName, p.AreaInSqKm, p.Vertices " +
                        "FROM SARF s INNER JOIN Polygon p ON s.SarfId = p.SarfId WHERE " +
                        "s.SarfId=" + sarfId + ";";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {                        
                        DataTable dt = new DataTable();
                        dt.Columns.Add("SarfName");
                        dt.Columns.Add("FA_Code");
                        dt.Columns.Add("Search_Ring_ID");
                        dt.Columns.Add("iPlan_Job");
                        dt.Columns.Add("Pace");
                        dt.Columns.Add("Market");
                        dt.Columns.Add("County");
                        dt.Columns.Add("FA_Type");
                        dt.Columns.Add("Market_Cluster");
                        dt.Columns.Add("Region");
                        dt.Columns.Add("RF_Design_Engineer_ATTUID");
                        dt.Columns.Add("SarfStatus");
                        dt.Columns.Add("AtollSiteName");
                        dt.Columns.Add("AreaInSqKm");
                        dt.Columns.Add("Vertices");
                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["SarfName"] = mySqlDataReader["SarfName"];
                            dataRow["FA_Code"] = mySqlDataReader["FA_Code"];
                            dataRow["Search_Ring_ID"] = mySqlDataReader["Search_Ring_ID"];
                            dataRow["iPlan_Job"] = mySqlDataReader["iPlan_Job"];
                            dataRow["Pace"] = mySqlDataReader["Pace"];
                            dataRow["Market"] = mySqlDataReader["Market"];
                            dataRow["County"] = mySqlDataReader["County"];
                            dataRow["FA_Type"] = mySqlDataReader["FA_Type"];
                            dataRow["Market_Cluster"] = mySqlDataReader["Market_Cluster"];
                            dataRow["Region"] = mySqlDataReader["Region"];
                            dataRow["RF_Design_Engineer_ATTUID"] = mySqlDataReader["RF_Design_Engineer_ATTUID"];
                            dataRow["SarfStatus"] = mySqlDataReader["SarfStatus"];
                            dataRow["AtollSiteName"] = mySqlDataReader["AtollSiteName"];
                            dataRow["AreaInSqKm"] = mySqlDataReader["AreaInSqKm"];
                            dataRow["Vertices"] = mySqlDataReader["Vertices"];
                            dt.Rows.Add(dataRow);
                        }
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error :" + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public string GetSarfStatusByID(int id)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT SarfStatus from SARF WHERE SarfId=" + id + ";";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        var status = Convert.ToString(cmd.ExecuteScalar());
                        return status;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable SarfDetailsByTaskID(string taskID)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT s.SarfName,s.FA_Code,s.Search_Ring_ID,s.iPlan_Job, s.Pace,s.Market,s.County,s.FA_Type,s.Market_Cluster,s.Region,s.RF_Design_Engineer_ATTUID, s.SarfStatus, s.AtollSiteName, p.AreaInSqKm, p.Vertices FROM SARF s INNER JOIN Polygon p ON s.SarfId = p.SarfId WHERE ProcessInstanceID='" + taskID + "';";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {                        
                        DataTable dt = new DataTable();
                        dt.Columns.Add("SarfName");
                        dt.Columns.Add("FA_Code");
                        dt.Columns.Add("Search_Ring_ID");
                        dt.Columns.Add("iPlan_Job");
                        dt.Columns.Add("PaceMarket");
                        dt.Columns.Add("County");
                        dt.Columns.Add("FA_Type");
                        dt.Columns.Add("Market_Cluster");
                        dt.Columns.Add("Region");
                        dt.Columns.Add("RF_Design_Engineer_ATTUID");
                        dt.Columns.Add("SarfStatus");
                        dt.Columns.Add("AtollSiteName");
                        dt.Columns.Add("AreaInSqKm");
                        dt.Columns.Add("Vertices");

                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["SarfName"] = mySqlDataReader["SarfName"];
                            dataRow["FA_Code"] = mySqlDataReader["FA_Code"];
                            dataRow["Search_Ring_ID"] = mySqlDataReader["Search_Ring_ID"];
                            dataRow["iPlan_Job"] = mySqlDataReader["iPlan_Job"];
                            dataRow["PaceMarket"] = mySqlDataReader["PaceMarket"];
                            dataRow["County"] = mySqlDataReader["County"];
                            dataRow["FA_Type"] = mySqlDataReader["FA_Type"];
                            dataRow["Market_Cluster"] = mySqlDataReader["Market_Cluster"];
                            dataRow["Region"] = mySqlDataReader["Region"];
                            dataRow["RF_Design_Engineer_ATTUID"] = mySqlDataReader["RF_Design_Engineer_ATTUID"];
                            dataRow["SarfStatus"] = mySqlDataReader["SarfStatus"];
                            dataRow["AtollSiteName"] = mySqlDataReader["AtollSiteName"];
                            dataRow["AreaInSqKm"] = mySqlDataReader["AreaInSqKm"];
                            dataRow["Vertices"] = mySqlDataReader["Vertices"];
                            dt.Rows.Add(dataRow);

                        }
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public DataTable GetAllPolygons()
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "SELECT P.Vertices FROM SARF S JOIN Polygon P ON S.SarfId=P.SarfId order by S.DateCreated desc;";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {   
                        DataTable dt = new DataTable();
                        dt.Columns.Add("Vertices");
                        MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                        while (mySqlDataReader.Read())
                        {
                            DataRow dataRow = dt.NewRow();
                            dataRow["Vertices"] = mySqlDataReader["Vertices"];
                            dt.Rows.Add(dataRow);
                        }
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        #endregion

        #region Save Methods
        public long SaveSarf(Sarf sarf)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    long id = 0;
                    string query = "INSERT INTO SARF(SarfName,DateCreated,ProcessInstanceID, " +
                        "SarfStatus, AtollSiteName, FA_Code, Search_Ring_ID, iPlan_Job, " +
                        "Pace, Market, County, FA_Type, Market_Cluster, Region, RF_Design_Engineer_ATTUID) VALUES(" +
                        "?SarfName,?DateCreated,?ProcessInstanceID, ?SarfStatus, " +
                        "?AtollSiteName, ?FA_Code, ?Search_Ring_ID, ?iPlan_Job, ?Pace, ?Market," +
                        "?County, ?FA_Type, ?Market_Cluster, ?Region, ?RF_Design_Engineer_ATTUID);";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        cmd.Parameters.Add("?SarfName", MySqlDbType.VarChar).Value = sarf.SarfName;
                        cmd.Parameters.Add("?DateCreated", MySqlDbType.DateTime).Value = sarf.CreatedDate;
                        cmd.Parameters.Add("?ProcessInstanceID", MySqlDbType.VarChar).Value = sarf.ProcessInstanceID;
                        cmd.Parameters.Add("?SarfStatus", MySqlDbType.VarChar).Value = sarf.SarfStatus;
                        cmd.Parameters.Add("?AtollSiteName", MySqlDbType.VarChar).Value = sarf.AtollSiteName;
                        cmd.Parameters.Add("?FA_Code", MySqlDbType.VarChar).Value = sarf.FACode;
                        cmd.Parameters.Add("?Search_Ring_ID", MySqlDbType.VarChar).Value = sarf.SearchRingId;
                        cmd.Parameters.Add("?iPlan_Job", MySqlDbType.VarChar).Value = sarf.IPlanJob;
                        cmd.Parameters.Add("?Pace", MySqlDbType.VarChar).Value = sarf.PaceNumber;
                        cmd.Parameters.Add("?Market", MySqlDbType.VarChar).Value = sarf.Market;
                        cmd.Parameters.Add("?County", MySqlDbType.VarChar).Value = sarf.County;
                        cmd.Parameters.Add("?FA_Type", MySqlDbType.VarChar).Value = sarf.FAType;
                        cmd.Parameters.Add("?Market_Cluster", MySqlDbType.VarChar).Value = sarf.MarketCluster;
                        cmd.Parameters.Add("?Region", MySqlDbType.VarChar).Value = sarf.Region;
                        cmd.Parameters.Add("?RF_Design_Engineer_ATTUID", MySqlDbType.VarChar).Value = sarf.RFDesignEnggId;
                        cmd.ExecuteNonQuery();
                        id = cmd.LastInsertedId;

                    }
                    return id;
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public long SaveNode(Node node)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    long id = 0;
                    string query = "INSERT INTO NODE(SarfId, HubId, Latitude,Longitude, AtollSiteName," +
                        "iPlanJobNumber, PaceNumber, DateCreated, DateModified, NodeType, VendorName, BusinessPhone, " +
                        "ContactPolice, ContactFire, ContactEnergy, IsATTOwned, StructureHeight, Company) VALUES" +
                        "(?SarfId, ?HubId, ?Latitude,?Longitude, ?AtollSiteName,?iPlanJobNumber, " +
                        "?PaceNumber, ?DateCreated, ?DateModified, ?NodeType, ?VendorName, ?BusinessPhone, " +
                        "?ContactPolice, ?ContactFire, ?ContactEnergy, ?IsATTOwned, ?StructureHeight, ?Company);";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        cmd.Parameters.Add("?SarfId", MySqlDbType.Int32).Value = node.SarfId;
                        cmd.Parameters.Add("?HubId", MySqlDbType.Int32).Value = node.HubId;
                        cmd.Parameters.Add("?Latitude", MySqlDbType.Decimal).Value = node.Latitude;
                        cmd.Parameters.Add("?Longitude", MySqlDbType.Decimal).Value = node.Longitude;
                        cmd.Parameters.Add("?AtollSiteName", MySqlDbType.VarChar).Value = node.AtollSiteName;

                        cmd.Parameters.Add("?iPlanJobNumber", MySqlDbType.VarChar).Value = node.iPlanJobNumber;
                        cmd.Parameters.Add("?PaceNumber", MySqlDbType.VarChar).Value = node.PaceNumber;
                        cmd.Parameters.Add("?DateCreated", MySqlDbType.Datetime).Value = DateTime.Now;
                        cmd.Parameters.Add("?DateModified", MySqlDbType.Datetime).Value = DateTime.Now;

                        cmd.Parameters.Add("?NodeType", MySqlDbType.VarChar).Value = node.NodeType;
                        cmd.Parameters.Add("?VendorName", MySqlDbType.VarChar).Value = node.VendorName;
                        cmd.Parameters.Add("?BusinessPhone", MySqlDbType.VarChar).Value = node.BusinessPhone;
                        cmd.Parameters.Add("?ContactPolice", MySqlDbType.VarChar).Value = node.ContactPolice;
                        cmd.Parameters.Add("?ContactFire", MySqlDbType.VarChar).Value = node.ContactFire;
                        
                        cmd.Parameters.Add("?ContactEnergy", MySqlDbType.VarChar).Value = node.ContactEnergy;
                        cmd.Parameters.Add("?IsATTOwned", MySqlDbType.VarChar).Value = node.IsATTOwned;
                        cmd.Parameters.Add("?StructureHeight", MySqlDbType.VarChar).Value = node.StructureHeight;
                        cmd.Parameters.Add("?Company", MySqlDbType.VarChar).Value = node.Company;

                        cmd.ExecuteNonQuery();
                        id = cmd.LastInsertedId;

                    }
                    return id;
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public long SaveHub(Hub hub)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    long id = 0;
                    string query = "INSERT INTO HUB(SarfId,Latitude,Longitude, Address, HubType, " +
                        "DateCreated, DateModified) VALUES (?SarfId, ?Latitude, ?Longitude, ?Address, ?HubType, " +
                        "?DateCreated, ?DateModified);";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        cmd.Parameters.Add("?SarfId", MySqlDbType.Int32).Value = hub.SarfId;
                        cmd.Parameters.Add("?Latitude", MySqlDbType.Decimal).Value = hub.Latitude;
                        cmd.Parameters.Add("?Longitude", MySqlDbType.Decimal).Value = hub.Longitude;
                        cmd.Parameters.Add("?Address", MySqlDbType.VarChar).Value = hub.Address;
                        cmd.Parameters.Add("?HubType", MySqlDbType.VarChar).Value = hub.HubType;
                        cmd.Parameters.Add("?DateCreated", MySqlDbType.Datetime).Value = DateTime.Now;
                        cmd.Parameters.Add("?DateModified", MySqlDbType.Datetime).Value = DateTime.Now;
                        cmd.ExecuteNonQuery();
                        id = cmd.LastInsertedId;

                    }
                    return id;
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public int SavePolygon(Polygon polygon, long sarfId)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    long id = 0;
                    string query = "INSERT INTO SARF(SarfName,DateCreated) VALUES(?SarfName,?DateCreated);";
                    cn.Open();
                    if (sarfId > 0)
                    {
                        decimal area;
                        decimal.TryParse(polygon.AreaInSqKm, out area);

                        query = "INSERT INTO Polygon(Vertices,SarfId, AreaInSqKm, DateCreated,DateModified) VALUES(?Vertices, ?SarfId, ?AreaInSqKm, ?DateCreated,?DateModified);";
                        using (MySqlCommand cmd = new MySqlCommand(query, cn))
                        {
                            cmd.Parameters.Add("?SarfId", MySqlDbType.Int32).Value = sarfId;
                            cmd.Parameters.Add("?Vertices", MySqlDbType.VarChar).Value = polygon.Vertices;
                            cmd.Parameters.Add("?AreaInSqKm", MySqlDbType.Decimal).Value = area;
                            cmd.Parameters.Add("?DateCreated", MySqlDbType.DateTime).Value = DateTime.Now;
                            cmd.Parameters.Add("?DateModified", MySqlDbType.DateTime).Value = DateTime.Now;
                            return cmd.ExecuteNonQuery();
                        }
                    }
                    return 0;
                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        #endregion

        #region Update Methods
        public void UpdateSarf(Sarf sarf)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "update sarf set SarfName='" + sarf.SarfName + "',FA_Code='" +
                        sarf.FACode + "',Search_Ring_ID='" + sarf.SearchRingId + "',iPlan_Job='" +
                        sarf.IPlanJob + "',Pace='" + sarf.PaceNumber + "',Market='" + sarf.Market +
                        "',County='" + sarf.County + "',FA_Type='" + sarf.FAType +
                        "', ProcessInstanceID='" + sarf.ProcessInstanceID +
                        "', SarfStatus='" + sarf.SarfStatus +
                        "',Market_Cluster='" + sarf.MarketCluster + "',Region='" + sarf.Region +
                        "',RF_Design_Engineer_ATTUID='" + sarf.RFDesignEnggId + "' where SarfId='" +
                        sarf.Id + "';";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        cmd.ExecuteNonQuery();
                    }

                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public void UpdateSarfStatus(Sarf sarf)
        {
            using (MySqlConnection cn = new MySqlConnection(connString))
            {
                try
                {
                    string query = "update sarf set SarfStatus='" + sarf.SarfStatus +
                        "' where SarfId='" + sarf.Id + "';";
                    cn.Open();
                    using (MySqlCommand cmd = new MySqlCommand(query, cn))
                    {
                        cmd.ExecuteNonQuery();
                    }

                }
                catch (Exception ex)
                {
                    throw new Exception("Data Error : " + ex.Message);
                }
                finally
                {
                    if (cn.State == System.Data.ConnectionState.Open)
                    {
                        cn.Close();
                    }
                }
            }
        }
        #endregion
    }
}