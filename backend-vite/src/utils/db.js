import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDoc = DynamoDBDocumentClient.from(client);

// Export both the client and the command classes
export default ddbDoc;
export { QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand };