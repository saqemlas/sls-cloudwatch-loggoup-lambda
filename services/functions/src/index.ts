import {Context} from 'aws-lambda/handler';
import {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {logger} from '@aws-template/common/packages/logger/logger';

export const handler = async (event: APIGatewayProxyEventV2, context?: Context): Promise<APIGatewayProxyStructuredResultV2> => {
    logger.info('Event', {event});
    const {requestContext, headers, body} = event;

    return {
        statusCode: 200,
        ...headers,
        body: JSON.stringify({
            id: requestContext.requestId,
            message: 'Execution succeeded!'
        })
    };
};
