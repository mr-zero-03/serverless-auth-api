const AWS = require( 'aws-sdk' );

const TABLENAME = process.env.DYNAMODB_CARS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async ( event ) => {
  const response = {
    'Content-Type': 'application/json'
  };

  const id = event.pathParameters.id

  try {
    await dynamo.delete( {
      TableName: TABLENAME,
      Key: {
        id: id
      }
    } ).promise();

    response.statusCode = 200;
    response.body = JSON.stringify( {
      message: 'The car with the id: "' + id + '" was deleted correctly'
    } );
  } catch( err ) {
    console.error( 'Error trying to delete the car with the id: "' + id + '"' );
    console.error( err );

    response.statusCode = 500;
    response.body = JSON.stringify( {
      message: 'Error trying to delete the car with the id: "' + id + '"'
    } );
  }

  return( response );
};
