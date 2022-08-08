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

      case "POST /cars":
        let requestJSON = JSON.parse( event.body );
        await dynamo.put( {
          TableName: TABLENAME,
          Item: {
            id: requestJSON.id,
            name: requestJSON.name,
            brand: requestJSON.brand,
            color: requestJSON.color,
            price: requestJSON.price,
            active: requestJSON.active
          }
        } ).promise();
        body = `Put item ${requestJSON.id}`;
      break;

      default:
        throw new Error( `Unsupported route: "${event.routeKey}"` );
    }
  } catch (err) {
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
