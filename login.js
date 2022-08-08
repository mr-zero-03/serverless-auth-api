const AWS = require( 'aws-sdk' );
const jwt = require( 'jsonwebtoken' );

const jwtKey = process.env.JWT_KEY;

const TABLENAME = process.env.DYNAMODB_USERS_TABLE;
const TOKENS_TABLENAME = process.env.DYNAMODB_TOKENS_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();

async function createToken( user ) {
  const token = jwt.sign( user, jwtKey, { expiresIn: '7 days' } );

  try {
    await dynamo.put( {
      TableName: TOKENS_TABLENAME,
      Item: {
        token: token
      }
    } ).promise();
  } catch( error ) {
    console.error( 'Error trying to create the token "' + token + '" on DynamoDB' );
    console.error( error );
  }

  return( token );
}

async function authenticate( user ) {

  if ( ( user.email === undefined ) || ( user.password === undefined ) ) {
    return( false );
  }

  try {
    let dbUser = await dynamo.get( {
      TableName: TABLENAME,
      Key: {
        email: user.email
      }
    } ).promise();

    dbUser = dbUser.Item;

    if ( ( dbUser.email === user.email ) && ( dbUser.password === user.password ) ) {
      const token = await createToken( user );
      return( token );
    }
  } catch ( error ) {
    console.error( 'Error trying to get the user with the email "' + user.email + '" from DynamoDB' );
    console.error( error );
  }

  return( false );
}

exports.handler = async ( event ) => {
  let body = {};
  try {
    if ( event.body ) {
      body = JSON.parse( event.body );
    }
  } catch ( err ) {
    //
  }

  const user = {
    email: body.email,
    password: body.password
  };

  const token = await authenticate( user );

  let response = {};

  if ( token ) {
    response = {
      statusCode: 200,
      'Content-Type': 'application/json',
      body: JSON.stringify( {
        token: token
      } )
    };
  } else {
    response = {
      statusCode: 401
    };
  }

  return( response );
};
