namespace ATTWebAppAPI.Models
{
    public class BPMWorkFlow
    {
        public string id
        { get; set; }
        public string name
        { get; set; }
        public string assignee
        { get; set; }
        public string description
        { get; set; }
         public string taskDefinitionKey
        { get; set; }
        public string formKey
        { get; set; }
        public string due
        { get; set; }
    }
}