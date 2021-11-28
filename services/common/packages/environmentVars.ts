export interface EnvironmentVars {
    env: {
        LOG_LEVEL?: string;
        IS_LOCAL?: string;

        // env for dynamicSubscriber lambda function
        REGION?: string;
        KINESIS_ARN?: string;
        KINESIS_ROLE_ARN?: string;
        FUNCTION_NAME?: string;
    }
}
