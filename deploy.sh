export AWS_PROFILE=lguisadom-iamadmin

FUNCTION_NAME_CREATE_ORDER=create-order
FUNCTION_NAME_GET_ORDER=get-order
FUNCTION_NAME_RESERVE_INVENTORY=reserve-inventory
FUNCTION_NAME_AUTHORIZE_PAYMENT=authorize-payment
FUNCTION_NAME_COMPLETE_ORDER=complete-order
FUNCTION_NAME_FAIL_ORDER=fail-order

REGION=us-east-2

echo "Starting deployment process"

echo "Cleaning previous build artifacts"
rm -rf dist

echo "Installing dependencies"
npm install

echo "Building functions"
npm run build

echo "Packaging functions"
npm run zip

echo "Deploying to AWS Lambda function $FUNCTION_NAME_CREATE_ORDER"
aws lambda update-function-code --function-name $FUNCTION_NAME_CREATE_ORDER \
  --zip-file fileb://dist/$FUNCTION_NAME_CREATE_ORDER/app.zip \
  --region $REGION

echo "Deploying to AWS Lambda function $FUNCTION_NAME_GET_ORDER"
aws lambda update-function-code --function-name $FUNCTION_NAME_GET_ORDER \
  --zip-file fileb://dist/$FUNCTION_NAME_GET_ORDER/app.zip \
  --region $REGION

echo "Deploying to AWS Lambda function $FUNCTION_NAME_RESERVE_INVENTORY"
aws lambda update-function-code --function-name $FUNCTION_NAME_RESERVE_INVENTORY \
  --zip-file fileb://dist/$FUNCTION_NAME_RESERVE_INVENTORY/app.zip \
  --region $REGION

echo "Deploying to AWS Lambda function $FUNCTION_NAME_AUTHORIZE_PAYMENT"
aws lambda update-function-code --function-name $FUNCTION_NAME_AUTHORIZE_PAYMENT \
  --zip-file fileb://dist/$FUNCTION_NAME_AUTHORIZE_PAYMENT/app.zip \
  --region $REGION

echo "Deploying to AWS Lambda function $FUNCTION_NAME_COMPLETE_ORDER"
aws lambda update-function-code --function-name $FUNCTION_NAME_COMPLETE_ORDER \
  --zip-file fileb://dist/$FUNCTION_NAME_COMPLETE_ORDER/app.zip \
  --region $REGION

echo "Deploying to AWS Lambda function $FUNCTION_NAME_FAIL_ORDER"
aws lambda update-function-code --function-name $FUNCTION_NAME_FAIL_ORDER \
  --zip-file fileb://dist/$FUNCTION_NAME_FAIL_ORDER/app.zip \
  --region $REGION  

echo "Deployment process completed successfully"
