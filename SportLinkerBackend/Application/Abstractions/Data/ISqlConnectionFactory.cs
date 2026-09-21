using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Application.Abstractions.Data
{
    public interface ISqlConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
