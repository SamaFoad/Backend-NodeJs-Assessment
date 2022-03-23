#!/bin/sh
if [ "$NODE_ENV" == "test" ]; then
    echo "copying the .env.test file to .env"
    cp .env.test .env
    exit
elif [ "$NODE_ENV" == "development" ]; then
    echo "copying the .env.dev file to .env"
    cp .env.dev .env
    exit
elif [ "$NODE_ENV" == "production" ]; then
    echo "copying the .env.prod file to .env"
    cp .env.prod .env
    exit
else
    echo "NODE_ENV is not found"
fi
