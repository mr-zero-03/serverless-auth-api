const AWS = require( 'aws-sdk' );

const TABLENAME = process.env.DYNAMODB_CARS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async ( event ) => {
  const response = {
    'Content-Type': 'application/json'
  };

  try {
    const cars = await dynamo.scan( {
      TableName: TABLENAME
    } ).promise();

    response.statusCode = 200;
    response.body = JSON.stringify( cars );
  } catch( err ) {
    console.error( 'Error trying to get the cars data' );
    console.error( err );

    response.statusCode = 500;
    response.body = JSON.stringify( {
      message: 'Error trying to get the cars data'
    } );
  }

  return( response );
};
