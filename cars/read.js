const AWS = require( 'aws-sdk' );

const TABLENAME = process.env.DYNAMODB_CARS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async ( event ) => {

  console.log( 'event' );
  console.log( event );

  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    switch( event.routeKey ) {

      case "GET /cars/{id}":
        body = await dynamo.get( {
          TableName: TABLENAME,
          Key: {
            id: event.pathParameters.id
          }
        } ).promise();
      break;

      case "GET /cars":
        body = await dynamo.scan( {
          TableName: TABLENAME
        } ).promise();
      break;

      default:
        throw new Error( `Unsupported route: "${event.routeKey}"` );
    }
  } catch( err ) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify( body );
  }

  return {
    statusCode,
    body,
    headers
  };
};
