/// !cdk-integ delivery-test
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CfnDeliveryDestination, Delivery } from 'aws-cdk-lib/aws-logs';

class DeliveryIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);    

    // Create L1 delivery destination using CFN resources
    const deliveryDestination = new CfnDeliveryDestination(this, 'TestDeliveryDestination', {
      name: 'test-delivery-destination',
      outputFormat: 'json',
    });
    
    // Create delivery with minimal options
    new Delivery(this, 'MinimalDelivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
    });

    // Create delivery with custom options
    new Delivery(this, 'TestDelivery', {
      deliverySourceName: 'test-delivery',
      deliveryDestinationArn: deliveryDestination.attrArn,
      fieldDelimiter: ',',
      recordFields: ['timestamp', 'message', 'requestId'],
    });
  }
}

const app = new App();
const stack = new DeliveryIntegStack(app, 'delivery-test');
new IntegTest(app, 'DeliveryIntegTest', { testCases: [stack] });
