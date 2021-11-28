export interface CloudtrailEvent {
    apiVersion: string;
    awsRegion: string;
    eventCategory: string;
    eventID: string;
    eventName: string;
    eventSource: string;
    eventTime: string;
    eventType: string;
    eventVersion: string;
    managementEvent: boolean;
    readOnly: boolean;
    recipientAccountId: string;
    requestID: string;
    requestParameters: {
        logGroupName: string;
        tags: {
            STAGE: string;
        }
    },
    responseElements?: string;
    sourceIPAddress: string;
    userAgent: string;
    userIdentity: {
        accessKeyId: string;
        accountId: string;
        arn: string;
        invokedBy: string;
        principalId: string;
        sessionContext: {
            attributes: {
                creationDate: string;
                mfaAuthenticated: string;
            },
            sessionIssuer: {},
            webIdFederationData: {}
        },
        type: string;
        userName: string;
    }
}
