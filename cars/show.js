const AWS = require( 'aws-sdk' );

const TABLENAME = process.env.DYNAMODB_CARS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async ( event ) => {
  const response = {
    'Content-Type': 'application/json'
  };

  const id = event.pathParameters.id;

  try {
    const car = await dynamo.get( {
      TableName: TABLENAME,
      Key: {
        id: id
      }
    } ).promise();

    response.statusCode = 200;
    response.body = JSON.stringify( car.Item );
  } catch( err ) {
    console.error( 'Error trying to get the car with the id: "' + id + '"' );
    console.error( err );

    response.statusCode = 400;
    response.body = JSON.stringify( {
      message: 'Error trying to get the car with the id "' + id + '" data'
    } );
  }

  return( response );
};
