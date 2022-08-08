const AWS = require( 'aws-sdk' );
const jwt = require( 'jsonwebtoken' );

const jwtKey = process.env.JWT_KEY;

const TABLENAME = process.env.DYNAMODB_TOKENS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

async function authorize( token ) {

  if ( !token ) {
    return( false );
  }

  token = token.split( 'Bearer ' )[ 1 ];

  try {
    jwt.verify( token, jwtKey );
    console.log( 'Passes the verification' );

    let dbToken = await dynamo.get( {
      TableName: TABLENAME,
      Key: {
        token: token
      }
    } ).promise();

    dbToken = dbToken.Item;

    if ( dbToken.token === token ) {
      return( true );
    }
  } catch ( err ) {
    console.error( 'Error verifying the token "' + token + '"' );
    console.error( err );
  }

  return( false );
}

exports.handler = async ( event ) => {
  const token = event.headers.authorization;

  let response = {};

  if ( await authorize( token ) ) {
    response = {
      isAuthorized: true
    };
  } else {
    response = {
      isAuthorized: false
    };
  }

  console.log( 'response' );
  console.log( response );
  return( response );
};
