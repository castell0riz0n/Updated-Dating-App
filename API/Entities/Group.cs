using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

public class Group
{
    public Group()
    {
        
    }

    public Group(string name)
    {
        Name = name;
    }
    [Key]
    public string Name { get; set; }

    public ICollection<Connection> Connections { get; set; } =
        new List<Connection>();
}

public class Connection
{
    public string ConnectionId { get; set; }
    public string Username { get; set; }

    public Connection()
    {
        
    }

    public Connection(string connectionId, string username)
    {
        ConnectionId = connectionId;
        Username = username;
    }
}