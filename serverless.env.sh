#!/bin/sh

FILE="serverless.env.yml"

echo "dev:" > $FILE
echo "  CUSTOM_DOMAIN: $CUSTOM_DOMAIN_DEV" >> $FILE
echo "  BUCKET_NAME: $BUCKET_NAME_DEV" >> $FILE
echo "  ACM_CERT_ARN: $ACM_CERT_ARN_DEV" >> $FILE
echo "prod:" >> $FILE
echo "  CUSTOM_DOMAIN: $CUSTOM_DOMAIN_PROD" >> $FILE
echo "  BUCKET_NAME: $BUCKET_NAME_PROD" >> $FILE
echo "  ACM_CERT_ARN: $ACM_CERT_ARN_PROD" >> $FILE
echo "HOSTED_ZONE_NAME: $HOSTED_ZONE_NAME" >> $FILE
