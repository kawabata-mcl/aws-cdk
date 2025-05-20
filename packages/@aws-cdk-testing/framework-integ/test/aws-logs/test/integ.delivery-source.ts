/// !cdk-integ delivery-source-test
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DeliverySource, DeliverySourceLogType } from 'aws-cdk-lib/aws-logs';

class DeliverySourceIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // Create delivery source with minimal configuration
    new DeliverySource(this, 'MinimalDeliverySource', {});

    // Create delivery source with custom name and predefined log type
    new DeliverySource(this, 'TestDeliverySource', {
      name: 'test-delivery-source',
      logType: DeliverySourceLogType.APPLICATION_LOGS,
    });

    // Create delivery source with generated name and custom string log type
    new DeliverySource(this, 'CustomLogTypeDeliverySource', {
      logType: 'CUSTOM_LOG_TYPE',
    });
  }
}

const app = new App();
const stack = new DeliverySourceIntegStack(app, 'delivery-source-test');
new IntegTest(app, 'DeliverySourceIntegTest', { testCases: [stack] });
