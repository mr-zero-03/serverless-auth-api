# Serverless

## serverless.yml
 - On the *serverless.yml* file you should put your *org*
 - By default the Serverless Framework creates a S3 Bucket, if you want to set your own Bucket for the deployments, please set the Bucket name on: *provider.deploymentBucket.name*

## Deploy
You will need to have the *serverless* command installed:
```
$ npm install -g serverless
```
Do not forget to have the node modules installed:
```
$ npm install
```
Deploy the App with the command:
```
$ serverless deploy
```

At the end of the deploy Serverless will print on the screen your endpoints!