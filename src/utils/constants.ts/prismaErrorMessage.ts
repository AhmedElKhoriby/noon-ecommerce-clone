interface PrismaErrorDetails {
  statusCode: number;
  devMessage: {
    code: string;
    message: string;
    action: string;
  };
  userMessage: string;
}

type PrismaErrors = Record<string, PrismaErrorDetails>;

export const prismaErrors: PrismaErrors = {
  // Common Errors
  P1000: {
    statusCode: 401,
    devMessage: {
      code: 'P1000',
      message: 'Authentication failed. Please check your database credentials.',
      action: 'Ensure your credentials are correct and that you have the necessary permissions to access the database.',
    },
    userMessage: 'Authentication failed. Please contact support.',
  },
  P1001: {
    statusCode: 503,
    devMessage: {
      code: 'P1001',
      message: 'Unable to connect to the database. Please try again later.',
      action: 'Check your network connection and ensure the database server is running.',
    },
    userMessage: 'Unable to connect to the database. Please try again later.',
  },
  P1002: {
    statusCode: 504,
    devMessage: {
      code: 'P1002',
      message: 'The database connection timed out. Please try again.',
      action: 'This might be due to network issues or an overloaded database server. Please retry after a few moments.',
    },
    userMessage: 'The database connection timed out. Please try again.',
  },
  P1003: {
    statusCode: 404,
    devMessage: {
      code: 'P1003',
      message: 'The database was not found. Please check your database configuration.',
      action: 'Verify that the database name in your connection string is correct and that the database exists.',
    },
    userMessage: 'The database was not found. Please contact support.',
  },
  P1008: {
    statusCode: 504,
    devMessage: {
      code: 'P1008',
      message: 'The operation timed out. Please try again.',
      action: 'This could be due to a slow database response. Please retry or optimize your query.',
    },
    userMessage: 'The operation timed out. Please try again.',
  },
  P1009: {
    statusCode: 409,
    devMessage: {
      code: 'P1009',
      message: 'The database already exists.',
      action:
        'If you intended to create a new database, choose a different name. Otherwise, connect to the existing database.',
    },
    userMessage: 'The database already exists. Please contact support.',
  },
  P1010: {
    statusCode: 403,
    devMessage: {
      code: 'P1010',
      message: 'Access denied. Please check your permissions.',
      action: 'Ensure your user account has the necessary permissions to perform this operation.',
    },
    userMessage: 'Access denied. Please contact support.',
  },
  P1011: {
    statusCode: 502,
    devMessage: {
      code: 'P1011',
      message: 'A TLS connection error occurred. Please check your security settings.',
      action: 'Verify that your SSL/TLS configuration is correct and that the database supports secure connections.',
    },
    userMessage: 'A connection error occurred. Please try again later.',
  },
  P1012: {
    statusCode: 400,
    devMessage: {
      code: 'P1012',
      message: 'Schema validation failed. Please check your Prisma schema.',
      action: 'Review your schema file for errors or inconsistencies.',
    },
    userMessage: 'Schema validation failed. Please contact support.',
  },
  P1013: {
    statusCode: 400,
    devMessage: {
      code: 'P1013',
      message: 'The database connection string is invalid.',
      action:
        'Check the format of your connection string and ensure all required fields (e.g., host, username, password) are provided.',
    },
    userMessage: 'Invalid database connection. Please contact support.',
  },
  P1014: {
    statusCode: 404,
    devMessage: {
      code: 'P1014',
      message: 'The required database table does not exist.',
      action: 'Verify that the table name is correct and that the table has been created.',
    },
    userMessage: 'The required database table does not exist. Please contact support.',
  },
  P1015: {
    statusCode: 400,
    devMessage: {
      code: 'P1015',
      message: 'Database version compatibility error.',
      action: 'Ensure your database version is compatible with the Prisma version you are using.',
    },
    userMessage: 'Database version compatibility error. Please contact support.',
  },
  P1016: {
    statusCode: 400,
    devMessage: {
      code: 'P1016',
      message: 'Invalid number of parameters in the query.',
      action: 'Check your query and ensure all required parameters are provided.',
    },
    userMessage: 'Invalid query. Please try again.',
  },
  P1017: {
    statusCode: 503,
    devMessage: {
      code: 'P1017',
      message: 'The database server closed the connection. Please try again.',
      action: 'This might be due to a server timeout or overload. Please retry after a few moments.',
    },
    userMessage: 'The database server closed the connection. Please try again later.',
  },

  // Prisma Client Errors
  P2000: {
    statusCode: 400,
    devMessage: {
      code: 'P2000',
      message: 'The provided value is too long for this field.',
      action: 'Check the maximum length allowed for this field and provide a shorter value.',
    },
    userMessage: 'Invalid input. Please check your data and try again.',
  },
  P2001: {
    statusCode: 404,
    devMessage: {
      code: 'P2001',
      message: 'The record was not found in the database.',
      action: 'Verify the query conditions and ensure the record exists.',
    },
    userMessage: 'The requested record was not found.',
  },
  P2002: {
    statusCode: 409,
    devMessage: {
      code: 'P2002',
      message: 'This value already exists. Please provide a unique value.',
      action: 'Check for duplicate values in the field marked as unique.',
    },
    userMessage: 'This value already exists. Please provide a unique value.',
  },
  P2003: {
    statusCode: 409,
    devMessage: {
      code: 'P2003',
      message: 'A foreign key constraint failed. Please check related records.',
      action: 'Ensure the referenced record exists in the related table.',
    },
    userMessage: 'A database constraint failed. Please contact support.',
  },
  P2004: {
    statusCode: 409,
    devMessage: {
      code: 'P2004',
      message: 'A database constraint violation occurred.',
      action: 'Review your data and ensure it complies with the database constraints.',
    },
    userMessage: 'A database constraint violation occurred. Please contact support.',
  },
  P2005: {
    statusCode: 400,
    devMessage: {
      code: 'P2005',
      message: 'An invalid value was stored in the database.',
      action: 'Check the data type and constraints for this field.',
    },
    userMessage: 'Invalid data. Please check your input and try again.',
  },
  P2006: {
    statusCode: 400,
    devMessage: {
      code: 'P2006',
      message: 'An invalid field value was provided.',
      action: 'Ensure the value matches the expected format and type.',
    },
    userMessage: 'Invalid input. Please check your data and try again.',
  },
  P2007: {
    statusCode: 400,
    devMessage: {
      code: 'P2007',
      message: 'A data validation error occurred.',
      action: 'Review the input data and ensure it meets the validation rules.',
    },
    userMessage: 'Data validation failed. Please check your input and try again.',
  },
  P2008: {
    statusCode: 400,
    devMessage: {
      code: 'P2008',
      message: 'Query parsing failed. Please check your query syntax.',
      action: 'Review the query for syntax errors or unsupported features.',
    },
    userMessage: 'Invalid query. Please try again.',
  },
  P2009: {
    statusCode: 400,
    devMessage: {
      code: 'P2009',
      message: 'Query validation failed. Please check your query.',
      action: 'Ensure the query complies with the schema and database constraints.',
    },
    userMessage: 'Invalid query. Please try again.',
  },
  P2010: {
    statusCode: 400,
    devMessage: {
      code: 'P2010',
      message: 'Raw query execution failed.',
      action: 'Check the raw query for errors or unsupported SQL syntax.',
    },
    userMessage: 'Query execution failed. Please try again.',
  },
  P2011: {
    statusCode: 400,
    devMessage: {
      code: 'P2011',
      message: 'A null value was provided for a non-nullable field.',
      action: 'Provide a valid value for this field or update the schema to allow null values.',
    },
    userMessage: 'Invalid input. Please check your data and try again.',
  },
  P2012: {
    statusCode: 400,
    devMessage: {
      code: 'P2012',
      message: 'A required value is missing.',
      action: 'Ensure all required fields are provided in the input data.',
    },
    userMessage: 'Required value is missing. Please check your input and try again.',
  },
  P2013: {
    statusCode: 400,
    devMessage: {
      code: 'P2013',
      message: 'A required argument is missing in the query.',
      action: 'Check the query and provide the missing argument.',
    },
    userMessage: 'Invalid query. Please try again.',
  },
  P2014: {
    statusCode: 400,
    devMessage: {
      code: 'P2014',
      message: 'A required relation violation occurred.',
      action: 'Ensure the related records are properly connected.',
    },
    userMessage: 'A database constraint failed. Please contact support.',
  },
  P2015: {
    statusCode: 404,
    devMessage: {
      code: 'P2015',
      message: 'The related record was not found.',
      action: 'Verify the related record exists in the database.',
    },
    userMessage: 'The related record was not found. Please contact support.',
  },
  P2016: {
    statusCode: 400,
    devMessage: {
      code: 'P2016',
      message: 'A query interpretation error occurred.',
      action: 'Review the query and ensure it is correctly structured.',
    },
    userMessage: 'Invalid query. Please try again.',
  },
  P2017: {
    statusCode: 400,
    devMessage: {
      code: 'P2017',
      message: 'Records are not properly connected in the relation.',
      action: 'Check the relationship between the records and ensure they are correctly linked.',
    },
    userMessage: 'A database constraint failed. Please contact support.',
  },
  P2018: {
    statusCode: 404,
    devMessage: {
      code: 'P2018',
      message: 'Required connected records were not found.',
      action: 'Ensure the related records exist and are properly connected.',
    },
    userMessage: 'Required records were not found. Please contact support.',
  },
  P2019: {
    statusCode: 400,
    devMessage: {
      code: 'P2019',
      message: 'An input validation error occurred.',
      action: 'Review the input data and ensure it meets the validation rules.',
    },
    userMessage: 'Invalid input. Please check your data and try again.',
  },
  P2020: {
    statusCode: 400,
    devMessage: {
      code: 'P2020',
      message: 'The provided value is out of range.',
      action: 'Check the allowed range for this field and provide a valid value.',
    },
    userMessage: 'Invalid input. Please check your data and try again.',
  },
  P2021: {
    statusCode: 404,
    devMessage: {
      code: 'P2021',
      message: 'The specified table does not exist in the database.',
      action: 'Verify the table name and ensure it has been created.',
    },
    userMessage: 'The specified table does not exist. Please contact support.',
  },
  P2022: {
    statusCode: 404,
    devMessage: {
      code: 'P2022',
      message: 'The specified column does not exist in the database.',
      action: 'Check the column name and ensure it exists in the table.',
    },
    userMessage: 'The specified column does not exist. Please contact support.',
  },
  P2023: {
    statusCode: 400,
    devMessage: {
      code: 'P2023',
      message: 'Inconsistent column data was found.',
      action: 'Review the data in this column and ensure it is consistent.',
    },
    userMessage: 'Data inconsistency detected. Please contact support.',
  },
  P2024: {
    statusCode: 504,
    devMessage: {
      code: 'P2024',
      message: 'The connection pool timed out. Please try again.',
      action: 'This might be due to high database load. Please retry after a few moments.',
    },
    userMessage: 'The connection timed out. Please try again later.',
  },
  P2025: {
    statusCode: 404,
    devMessage: {
      code: 'P2025',
      message: 'The required record was not found.',
      action: 'Verify the query conditions and ensure the record exists.',
    },
    userMessage: 'The required record was not found. Please contact support.',
  },
  P2026: {
    statusCode: 400,
    devMessage: {
      code: 'P2026',
      message: 'An unsupported database feature was used.',
      action: 'Check the database documentation and ensure the feature is supported.',
    },
    userMessage: 'Unsupported feature. Please contact support.',
  },
  P2027: {
    statusCode: 500,
    devMessage: {
      code: 'P2027',
      message: 'Multiple database errors occurred.',
      action: 'Review the error details and address each issue individually.',
    },
    userMessage: 'Multiple errors occurred. Please contact support.',
  },
  P2028: {
    statusCode: 500,
    devMessage: {
      code: 'P2028',
      message: 'A transaction error occurred.',
      action: 'Check the transaction logic and ensure it is correctly implemented.',
    },
    userMessage: 'A transaction error occurred. Please try again later.',
  },
  P2029: {
    statusCode: 400,
    devMessage: {
      code: 'P2029',
      message: 'The query parameter limit was exceeded.',
      action: 'Reduce the number of parameters in the query or optimize the query.',
    },
    userMessage: 'Query parameter limit exceeded. Please try again.',
  },
  P2030: {
    statusCode: 404,
    devMessage: {
      code: 'P2030',
      message: 'The full-text search index was not found.',
      action: 'Ensure the index exists and is properly configured.',
    },
    userMessage: 'Full-text search index not found. Please contact support.',
  },
  P2031: {
    statusCode: 400,
    devMessage: {
      code: 'P2031',
      message: 'MongoDB must be run as a replica set.',
      action: 'Configure MongoDB to run as a replica set.',
    },
    userMessage: 'Database configuration error. Please contact support.',
  },
  P2033: {
    statusCode: 400,
    devMessage: {
      code: 'P2033',
      message: 'The provided number is too large for the database field.',
      action: 'Check the field size and provide a smaller number.',
    },
    userMessage: 'Invalid input. Please check your data and try again.',
  },
  P2034: {
    statusCode: 409,
    devMessage: {
      code: 'P2034',
      message: 'The transaction failed due to a conflict.',
      action: 'Retry the transaction or resolve the conflict manually.',
    },
    userMessage: 'Transaction failed due to a conflict. Please try again later.',
  },
  P2035: {
    statusCode: 500,
    devMessage: {
      code: 'P2035',
      message: 'A database assertion violation occurred.',
      action: 'Review the database logic and ensure it complies with the assertions.',
    },
    userMessage: 'A database error occurred. Please contact support.',
  },
  P2036: {
    statusCode: 502,
    devMessage: {
      code: 'P2036',
      message: 'An external connector error occurred.',
      action: 'Check the external service and ensure it is functioning correctly.',
    },
    userMessage: 'An external service error occurred. Please try again later.',
  },
  P2037: {
    statusCode: 503,
    devMessage: {
      code: 'P2037',
      message: 'Too many database connections were opened.',
      action: 'Reduce the number of connections or increase the connection limit.',
    },
    userMessage: 'Too many database connections. Please try again later.',
  },

  // Prisma Migrate Errors
  P3000: {
    statusCode: 500,
    devMessage: {
      code: 'P3000',
      message: 'Failed to create database.',
      action: 'Check your database configuration and permissions.',
    },
    userMessage: 'Failed to create database. Please contact support.',
  },
  P3001: {
    statusCode: 400,
    devMessage: {
      code: 'P3001',
      message: 'Destructive changes detected.',
      action: 'Review the migration and ensure no data loss will occur.',
    },
    userMessage: 'Destructive changes detected. Please contact support.',
  },
  P3002: {
    statusCode: 500,
    devMessage: {
      code: 'P3002',
      message: 'Migration rolled back due to error.',
      action: 'Check the error details and resolve the issue before retrying.',
    },
    userMessage: 'Migration failed. Please contact support.',
  },
  P3003: {
    statusCode: 400,
    devMessage: {
      code: 'P3003',
      message: 'Invalid migration format.',
      action: 'Ensure the migration file follows the correct format.',
    },
    userMessage: 'Invalid migration format. Please contact support.',
  },
  P3004: {
    statusCode: 400,
    devMessage: {
      code: 'P3004',
      message: 'Cannot modify system database.',
      action: 'Connect to a different database to perform migrations.',
    },
    userMessage: 'Cannot modify system database. Please contact support.',
  },
  P3005: {
    statusCode: 400,
    devMessage: {
      code: 'P3005',
      message: 'Database is not empty for initial migration.',
      action: 'Use a different database or reset the current one.',
    },
    userMessage: 'Database is not empty. Please contact support.',
  },
  P3006: {
    statusCode: 500,
    devMessage: {
      code: 'P3006',
      message: 'Migration failed in shadow database.',
      action: 'Check the shadow database configuration and permissions.',
    },
    userMessage: 'Migration failed. Please contact support.',
  },
  P3007: {
    statusCode: 400,
    devMessage: {
      code: 'P3007',
      message: 'Unsupported preview features.',
      action: 'Remove unsupported features from your schema.',
    },
    userMessage: 'Unsupported features. Please contact support.',
  },
  P3008: {
    statusCode: 400,
    devMessage: {
      code: 'P3008',
      message: 'Migration already applied.',
      action: 'No action needed. The migration is already applied.',
    },
    userMessage: 'Migration already applied. No action needed.',
  },
  P3009: {
    statusCode: 400,
    devMessage: {
      code: 'P3009',
      message: 'Failed migrations found.',
      action: 'Resolve the failed migrations before applying new ones.',
    },
    userMessage: 'Failed migrations found. Please contact support.',
  },
  P3010: {
    statusCode: 400,
    devMessage: {
      code: 'P3010',
      message: 'Migration name too long.',
      action: 'Use a shorter name for the migration.',
    },
    userMessage: 'Migration name too long. Please try again.',
  },
  P3011: {
    statusCode: 400,
    devMessage: {
      code: 'P3011',
      message: 'Cannot rollback unapplied migration.',
      action: 'Only applied migrations can be rolled back.',
    },
    userMessage: 'Cannot rollback unapplied migration. Please contact support.',
  },
  P3012: {
    statusCode: 400,
    devMessage: {
      code: 'P3012',
      message: 'Cannot rollback non-failed migration.',
      action: 'Only failed migrations can be rolled back.',
    },
    userMessage: 'Cannot rollback non-failed migration. Please contact support.',
  },
  P3013: {
    statusCode: 400,
    devMessage: {
      code: 'P3013',
      message: 'Multiple providers not supported.',
      action: 'Use a single provider for migrations.',
    },
    userMessage: 'Multiple providers not supported. Please contact support.',
  },
  P3014: {
    statusCode: 500,
    devMessage: {
      code: 'P3014',
      message: 'Shadow database creation failed.',
      action: 'Check the shadow database configuration and permissions.',
    },
    userMessage: 'Shadow database creation failed. Please contact support.',
  },
  P3015: {
    statusCode: 404,
    devMessage: {
      code: 'P3015',
      message: 'Migration file not found.',
      action: 'Ensure the migration file exists and is accessible.',
    },
    userMessage: 'Migration file not found. Please contact support.',
  },
  P3016: {
    statusCode: 500,
    devMessage: {
      code: 'P3016',
      message: 'Database reset failed.',
      action: 'Check the database configuration and permissions.',
    },
    userMessage: 'Database reset failed. Please contact support.',
  },
  P3017: {
    statusCode: 404,
    devMessage: {
      code: 'P3017',
      message: 'Specified migration not found.',
      action: 'Ensure the migration exists and is correctly named.',
    },
    userMessage: 'Specified migration not found. Please contact support.',
  },
  P3018: {
    statusCode: 500,
    devMessage: {
      code: 'P3018',
      message: 'Migration failed to apply.',
      action: 'Check the error details and resolve the issue before retrying.',
    },
    userMessage: 'Migration failed. Please contact support.',
  },
  P3019: {
    statusCode: 400,
    devMessage: {
      code: 'P3019',
      message: 'Provider mismatch in migration.',
      action: 'Ensure the provider matches the database configuration.',
    },
    userMessage: 'Provider mismatch. Please contact support.',
  },
  P3020: {
    statusCode: 400,
    devMessage: {
      code: 'P3020',
      message: 'Shadow database disabled on Azure SQL.',
      action: 'Enable the shadow database or use a different database.',
    },
    userMessage: 'Shadow database disabled. Please contact support.',
  },
  P3021: {
    statusCode: 400,
    devMessage: {
      code: 'P3021',
      message: 'Foreign keys not supported.',
      action: 'Remove foreign keys from your schema.',
    },
    userMessage: 'Foreign keys not supported. Please contact support.',
  },
  P3022: {
    statusCode: 400,
    devMessage: {
      code: 'P3022',
      message: 'Direct DDL execution disabled.',
      action: 'Enable DDL execution or use a different database.',
    },
    userMessage: 'Direct DDL execution disabled. Please contact support.',
  },

  // Introspection Errors
  P4000: {
    statusCode: 500,
    devMessage: {
      code: 'P4000',
      message: 'Introspection operation failed to produce a schema file.',
      action: 'Check the database connection and permissions.',
    },
    userMessage: 'Introspection failed. Please contact support.',
  },
  P4001: {
    statusCode: 404,
    devMessage: {
      code: 'P4001',
      message: 'The introspected database was empty.',
      action: 'Ensure the database contains tables and data.',
    },
    userMessage: 'The database is empty. Please contact support.',
  },
  P4002: {
    statusCode: 400,
    devMessage: {
      code: 'P4002',
      message: 'The schema of the introspected database was inconsistent.',
      action: 'Review the database schema for inconsistencies.',
    },
    userMessage: 'Database schema inconsistency detected. Please contact support.',
  },

  // Prisma Accelerate Errors
  P6000: {
    statusCode: 500,
    devMessage: {
      code: 'P6000',
      message: 'Server error occurred.',
      action: 'Contact support with the error details.',
    },
    userMessage: 'A server error occurred. Please try again later.',
  },
  P6001: {
    statusCode: 400,
    devMessage: {
      code: 'P6001',
      message: 'Invalid data source URL.',
      action: 'Check the data source URL format.',
    },
    userMessage: 'Invalid data source URL. Please contact support.',
  },
  P6002: {
    statusCode: 401,
    devMessage: {
      code: 'P6002',
      message: 'Invalid API key.',
      action: 'Provide a valid API key.',
    },
    userMessage: 'Invalid API key. Please contact support.',
  },
  P6003: {
    statusCode: 403,
    devMessage: {
      code: 'P6003',
      message: 'Plan usage limit exceeded.',
      action: 'Upgrade your plan or reduce usage.',
    },
    userMessage: 'Plan usage limit exceeded. Please upgrade your plan.',
  },
  P6004: {
    statusCode: 504,
    devMessage: {
      code: 'P6004',
      message: 'Query timeout exceeded.',
      action: 'Optimize your query or increase the timeout limit.',
    },
    userMessage: 'Query timeout exceeded. Please try again later.',
  },
  P6005: {
    statusCode: 400,
    devMessage: {
      code: 'P6005',
      message: 'Invalid parameters provided.',
      action: 'Check the parameters and ensure they are valid.',
    },
    userMessage: 'Invalid parameters. Please check your input and try again.',
  },
  P6006: {
    statusCode: 400,
    devMessage: {
      code: 'P6006',
      message: 'Incompatible Prisma version.',
      action: 'Use a compatible version of Prisma.',
    },
    userMessage: 'Incompatible Prisma version. Please contact support.',
  },
  P6008: {
    statusCode: 500,
    devMessage: {
      code: 'P6008',
      message: 'Engine connection error.',
      action: 'Check the engine configuration and permissions.',
    },
    userMessage: 'Engine connection error. Please try again later.',
  },
  P6009: {
    statusCode: 400,
    devMessage: {
      code: 'P6009',
      message: 'Response size limit exceeded.',
      action: 'Reduce the response size or increase the limit.',
    },
    userMessage: 'Response size limit exceeded. Please try again later.',
  },
  P6010: {
    statusCode: 403,
    devMessage: {
      code: 'P6010',
      message: 'Accelerate project disabled.',
      action: 'Enable the project in the Prisma Accelerate dashboard.',
    },
    userMessage: 'Accelerate project disabled. Please contact support.',
  },
  P5011: {
    statusCode: 429,
    devMessage: {
      code: 'P5011',
      message: 'Too many requests. Please try again later.',
      action: 'Implement a back-off strategy and retry later.',
    },
    userMessage: 'Too many requests. Please try again later.',
  },

  // Prisma Pulse Errors
  P6100: {
    statusCode: 500,
    devMessage: {
      code: 'P6100',
      message: 'Pulse server error occurred.',
      action: 'Contact support with the error details.',
    },
    userMessage: 'A server error occurred. Please try again later.',
  },
  P6101: {
    statusCode: 400,
    devMessage: {
      code: 'P6101',
      message: 'Pulse datasource error.',
      action: 'Check the datasource configuration and permissions.',
    },
    userMessage: 'Datasource error. Please contact support.',
  },
  P6102: {
    statusCode: 401,
    devMessage: {
      code: 'P6102',
      message: 'Invalid Pulse authentication.',
      action: 'Provide valid authentication credentials.',
    },
    userMessage: 'Invalid authentication. Please contact support.',
  },
  P6103: {
    statusCode: 403,
    devMessage: {
      code: 'P6103',
      message: 'Pulse project disabled.',
      action: 'Enable the project in the Prisma Pulse dashboard.',
    },
    userMessage: 'Pulse project disabled. Please contact support.',
  },
  P6104: {
    statusCode: 403,
    devMessage: {
      code: 'P6104',
      message: 'Account hold error.',
      action: 'Contact support to resolve the account hold.',
    },
    userMessage: 'Account hold error. Please contact support.',
  },
  P6105: {
    statusCode: 400,
    devMessage: {
      code: 'P6105',
      message: 'Unsupported version for Pulse.',
      action: 'Use a compatible version of Prisma.',
    },
    userMessage: 'Unsupported version. Please contact support.',
  },

  // Default fallback error
  default: {
    statusCode: 500,
    devMessage: {
      code: 'UNKNOWN',
      message: 'An unexpected error occurred. Please try again later.',
      action: 'If the issue persists, contact support with the error details.',
    },
    userMessage: 'An unexpected error occurred. Please try again later.',
  },
};
