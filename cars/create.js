const AWS = require( 'aws-sdk' );

const TABLENAME = process.env.DYNAMODB_CARS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async ( event ) => {
  const response = {
    'Content-Type': 'application/json'
  };

  let body = {};
  try {
    if ( event.body ) {
      body = JSON.parse( event.body );
    }
  } catch( err ) {
    response.statusCode = 400;
    response.body = JSON.stringify( {
      message: 'The received data is not correct, please check it'
    } );

    return( response );
  }

  try {
    await dynamo.put( {
      TableName: TABLENAME,
      Item: {
        id: body.id,
        name: body.name,
        brand: body.brand,
        color: body.color,
        price: body.price,
        active: body.active
      }
    } ).promise();

    response.statusCode = 201;
    response.body = JSON.stringify( {
      message: 'The car was created correctly!'
    } );
  } catch( err ) {
    console.error( 'Error trying to save the data' );
    console.error( err );

    response.statusCode = 500;
    response.body = JSON.stringify( {
      message: 'Error trying to save the data'
    } );
  }

  return( response );
};
