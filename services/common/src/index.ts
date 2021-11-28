import {Context} from 'aws-lambda/handler';
import {EventBridgeEvent} from 'aws-lambda/trigger/eventbridge';
import {CloudtrailEvent} from './types/cloudtrailEvent';
import {logger} from '@aws-template/common/packages/logger/logger';
import {CloudWatchLogsClient, PutMetricFilterCommand, PutSubscriptionFilterCommand} from '@aws-sdk/client-cloudwatch-logs'; 
import {EnvironmentVars} from '../packages/environmentVars';

declare const process: EnvironmentVars;

const region: string = process.env.REGION || 'eu-west-1';
const kinesisArn: string = process.env.KINESIS_ARN || '';
const kinesisRoleArn: string = process.env.KINESIS_ROLE_ARN || '';
const functionName: string = process.env.FUNCTION_NAME || '';

const cloudwatchClient: CloudWatchLogsClient = new CloudWatchLogsClient({region});

export const handler = async (event: EventBridgeEvent<'AWS API Call via CloudTrail', CloudtrailEvent>, context?: Context): Promise<void> => {
    logger.info('Event', {event});

    if (event.detail.eventName !== 'CreateLogGroup'){
        return;
    }

    const logGroupName: string = event.detail.requestParameters.logGroupName;

    if (!logGroupName.startsWith('/aws/lambda')){
        return;
    }

    if (logGroupName === `/aws/lambda/${functionName}`){
        return;
    }

    const response = await Promise.all([
        await cloudwatchClient.send(new PutMetricFilterCommand({
            logGroupName,
            filterName: 'TaskTimedOutMetric',
            filterPattern: 'Task timed out after',
            metricTransformations: [{
                metricName: 'TaskTimedOut',
                metricNamespace: 'Lambda',
                metricValue: '1',
                defaultValue: 0
            }]
        })),
        await cloudwatchClient.send(new PutSubscriptionFilterCommand({
            logGroupName,
            filterName : 'kinesis-subscription',
            filterPattern : '[timestamp=*Z, request_id="*-*", event]',
            destinationArn : kinesisArn,
            roleArn: kinesisRoleArn,
        }))
    ]);

    logger.info('Succeeded!', {response});
    return;
};
