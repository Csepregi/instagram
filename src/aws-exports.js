/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "eu-central-1",
    "aws_appsync_graphqlEndpoint": "https://5oqygev2urbdtd2etoni3p42ri.appsync-api.eu-central-1.amazonaws.com/graphql",
    "aws_appsync_region": "eu-central-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_cognito_identity_pool_id": "eu-central-1:8e7a3b3f-687c-4b9c-9763-751393324676",
    "aws_cognito_region": "eu-central-1",
    "aws_user_pools_id": "eu-central-1_LnLwVjRbt",
    "aws_user_pools_web_client_id": "5d6qre6ajhuj6m40ve7djtnomv",
    "oauth": {
        "domain": "053wlzdl9a5u-staging.auth.eu-central-1.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "csepregisphotos://",
        "redirectSignOut": "csepregisphotos://",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [
        "FACEBOOK",
        "GOOGLE"
    ],
    "aws_cognito_signup_attributes": [
        "EMAIL",
        "NAME"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_LOWERCASE",
            "REQUIRES_NUMBERS",
            "REQUIRES_UPPERCASE"
        ]
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_user_files_s3_bucket": "csepregis-gallery",
    "aws_user_files_s3_bucket_region": "eu-central-1"
};


export default awsmobile;