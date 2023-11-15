/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
const AppsyncID = process.env.API_INSTAGRAM_GRAPHQLAPIIDOUTPUT;

const TableName = `User-${AppsyncID}-${env}` // TableName-AppsyncID-env

const userExists = async id => {
  const params = {
    TableName : '',
    Key: id,
  };

  try {
    const response = await docClient.get(params).promise();
    return !!response?.Item;
  } catch (error) {
    return false;
  }
  
};



const saveUser = async user => {
  const date = new Date();
  const timestamp = date.toISOString()
    const Item = {
      ...user,
      __typename: 'User',
      updatedAt: timestamp,
      createdAt: timestamp,
    };
    const params = {
      TableName,
      Item,
    };

    try {
      await docClient.put(params).promise()
    } catch (error) {
      return false
    }
};

exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger
  console.log('hey lambda function working');
  console.log(event);
  if (!event?.request?.userAttributes) {
    console.log('No user data available');
    return;
  }

  const {sub, name, email} = event.request.userAttributes; // {sub, email, name}

  const newUser = {
     id: sub,
     name,
     email
  };
  // check if the user already exists
  if (!(await userExists(newUser.id))) {
     // if not, save the user to the database
   await saveUser(newUser)
   console.log(`User ${newUser.id} has been saved to the database`);
  } else {
    console.log(`User ${newUser.id} already exists`);
  }

  return event;
};
