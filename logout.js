const AWS = require( 'aws-sdk' );

const TABLENAME = process.env.DYNAMODB_TOKENS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

async function logout( token ) {

  try {
     await dynamo.delete( {
      TableName: TABLENAME,
      Key: {
        token: token
      }
    } ).promise();

    return( true );
  } catch ( err ) {
    console.error( 'Error trying to delete the connection with the token "' + token + '" from DynamoDB' );
    console.error( err );
  }

  return( false );
}

exports.handler = async ( event ) => {
  let token = event.headers.authorization;
  token = token.split( 'Bearer ' )[ 1 ];

  let response = {};

  if ( token === undefined ) {
    response = {
      statusCode: 400,
      body: JSON.stringify( {
        message: 'No token received'
      } )
    };
    return( response );
  }

  if ( await logout( token ) ) {
    response = {
      statusCode: 200
    };
  } else {
    response = {
      statusCode: 500
    };
  }

  return( response );
};
