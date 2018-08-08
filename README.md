# aws-codepieline-slack
Post to Slack when CodePipeline changed state.

## Getting started.

### Create stack

```bash
# Packages the local artifacts that template references.
$ yarn package --s3-bucket ${BUCKET_NAME} [--profile ${PROFILE}]

# Deploys the specified template by creating and then executing a change set. 
$ yarn deploy --s3-bucket ${BUCKET_NAME} --stack-name ${STACK_NAME} --parameter-overrides SlackWebhookUrl=${SlackWebhookUrl} [--profile ${PROFILE}]
```

Parameters that can be specified with `--parameter-overrides`

* Require
  * **SlackWebhookUrl**
* Optional
  * **SlackUsername**
  * **SlackIconUrl**
  * **SlackIconEmoji**
  * **SlackChannel**
  * **TargetState**
    * Default: `CANCELED,FAILED,RESUMED,STARTED,SUCCEEDED`

### Delete stack

```bash
# Deletes a specified stack.
$ aws cloudformation delete-stack --stack-name ${STACK_NAME} [--profile ${PROFILE}]
```