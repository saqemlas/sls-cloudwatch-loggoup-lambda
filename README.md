# Auto-Subscribe Lambda to Cloudwatch Log Groups


## Architecture

<p align="center">
  <img src="/architecture-diagram.drawio.svg" />
</p>

## Info

During the execution of a Lambda function, whatever is stdout (*eg. using console.log() in Node.js or print() in Python*) will be captured by Lambda and sent to CloudWatch Logs asynchronously in the background, without adding any overhead to Lambda function execution time. All logs for Lambda functions in CloudWatch Logs are organised into log groups (one log group per function) and then log streams (one log stream per container instance).

> Using a (stdout) logging library to control how messages are logged (ie JSON object rather than multi line) are essential for lowering Cloudwatch Log costs

- Centralised logging is useful for holistically monitoring various systems as well as back up data. 
    - One approach is to send these logs to CloudWatch Logs yourself via the PutLogEvents operation.
    - Another approach would be to send them to your preferred log aggregation service such as Splunk or Elasticsearch. 

The problem with these approaches is that everything has to be done during a function’s invocation. When making additional network calls during the invocation for the logging, this will need additional execution time, which means clients would have to wait that much longer for the API to respond. **As an alternative, process the logs from CloudWatch Logs after the execution time.**

This project handles deployment of two stacks; the first stack deploys a Lambda function, Cloudtrail, Kinesis, S3 Bucket, S3 Bucket Access Policy, and Iam Role, the second stack deploys a lambda function. Cloudtrail is an amazon web service that records AWS API calls for an AWS account, such as when a Lambda is invoked or DynamoDB table deleted.

The process is as follows...
- (New) Lambda function is deployed on aws account and encompasses using the CreateLogGroup api action.
- Dynamic Subscriber Lambda function auto-subscribes Cloudwatch Log Group to whatever configuration requirements needed, ie attaching metric filters or subscription filters for centralised logging.


For more information...
- [AWS Documentation: What is Cloudtrail?](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
- [AWS Documentation: Cloudtrail Cloudformation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html)
- [AWS Documentation: Cloudwatch Logs Subscription Filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)
- [AWS Documentation: Cloudwatch Logs Metric Filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)


## Development

### Install:
```bash
yarn install
```

### To Test:

#### Step 1
```bash
yarn run deploy
```
*Deploys services/common, then services/functions (deployment bucket dependant)*

#### Step 2
- Uncomment example2 function in services/functions/serverless.yml (line 76)
```bash
yarn run deploy
```
*Deploys services/functions (skips services/common due to no code change) with new function to create log group*

#### Step 3
- Check dynamicSubscriber function deployed from services/common/serverless.yml (line 80)
- Check (new) example2 function's log group configurations

### Remove:
```bash
yarn run remove
```
