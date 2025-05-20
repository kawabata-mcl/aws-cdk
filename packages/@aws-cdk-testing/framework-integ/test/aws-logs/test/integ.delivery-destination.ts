/// !cdk-integ delivery-destination-test
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DeliveryDestination, DeliveryDestinationOutputFormat, LogGroup } from 'aws-cdk-lib/aws-logs';

class DeliveryDestinationIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // Create a log group as a destination resource
    const logGroup = new LogGroup(this, 'DestinationLogGroup');
    
    // Create delivery destination with minimal configuration
    new DeliveryDestination(this, 'MinimalDeliveryDestination', {
      destinationResourceArn: logGroup.logGroupArn,
    });

    // Create delivery destination with custom name and JSON output format
    new DeliveryDestination(this, 'TestDeliveryDestination', {
      name: 'test-delivery-destination',
      destinationResourceArn: logGroup.logGroupArn,
      outputFormat: DeliveryDestinationOutputFormat.JSON,
    });

    // Create delivery destination with W3C output format
    new DeliveryDestination(this, 'W3CDeliveryDestination', {
      name: 'w3c-delivery-destination',
      destinationResourceArn: logGroup.logGroupArn,
      outputFormat: DeliveryDestinationOutputFormat.W3C,
    });

    // Create delivery destination with a policy
    new DeliveryDestination(this, 'PolicyDeliveryDestination', {
      name: 'policy-delivery-destination',
      destinationResourceArn: logGroup.logGroupArn,
      deliveryDestinationPolicy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { Service: 'logs.amazonaws.com' },
            Action: 'logs:PutDeliveryDestination',
            Resource: '*',
          },
        ],
      },
    });
  }
}

const app = new App();
const stack = new DeliveryDestinationIntegStack(app, 'delivery-destination-test');
new IntegTest(app, 'DeliveryDestinationIntegTest', { testCases: [stack] });
