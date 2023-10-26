#!/bin/bash

# This init file creates S3 buckets required by the application

# List buckets
# aws --endpoint-url=http://localhost:4566 s3api list-buckets

aws --endpoint-url=http://localhost:4566 s3api create-bucket \
    --bucket cat-images-dev \
    --region eu-central-1
