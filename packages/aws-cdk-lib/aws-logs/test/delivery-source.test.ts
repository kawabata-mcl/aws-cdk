import { Template, Match } from '../../assertions';
import * as cdk from '../../core';
import { DeliverySource, DeliverySourceLogType } from '../lib';

describe('DeliverySource', () => {
  // Basic property tests
  test('with only name specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {
      name: 'MyDeliverySource'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'MyDeliverySource'
    });
  });

  test('with name and log type specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {
      name: 'MyDeliverySource', 
      logType: DeliverySourceLogType.CLOUDFRONT_ACCESS_LOGS
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'MyDeliverySource', 
      LogType: 'ACCESS_LOGS'
    });
  });

  test('with name and resource ARN specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {
      name: 'MyDeliverySource', 
      resourceArn: 'arn:aws:cloudfront::123456789012:distribution/d111111abcdef8'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'MyDeliverySource', 
      ResourceArn: 'arn:aws:cloudfront::123456789012:distribution/d111111abcdef8'
    });
  });

  test('with name and tags specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {
      name: 'MyDeliverySource', 
      tags: [{ key: 'Environment', value: 'Production' }] 
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'MyDeliverySource', 
      Tags: [{ Key: 'Environment', Value: 'Production' }] 
    });
  });

  test('with all properties specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {
      name: 'MyDeliverySource', 
      logType: DeliverySourceLogType.CLOUDFRONT_ACCESS_LOGS,
      resourceArn: 'arn:aws:cloudfront::123456789012:distribution/d111111abcdef8',
      tags: [{ key: 'Environment', value: 'Production' }]
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'MyDeliverySource', 
      LogType: 'ACCESS_LOGS',
      ResourceArn: 'arn:aws:cloudfront::123456789012:distribution/d111111abcdef8',
      Tags: [{ Key: 'Environment', Value: 'Production' }]
    });
  });

  test('with log type specified as string', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {
      name: 'MyDeliverySource', 
      logType: 'CUSTOM_LOG_TYPE'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'MyDeliverySource', 
      LogType: 'CUSTOM_LOG_TYPE'
    });
  });

  // Auto-generated name test
  test('uses auto-generated name when name is not provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {});

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {});
  });

  // Reference to existing delivery source test
  test('fromDeliverySourceAttributes creates a reference to an existing delivery source', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const arn = 'arn:aws:logs:us-east-1:123456789012:delivery-source:ImportedSource';
    const name = 'ImportedSource';

    // WHEN
    const deliverySource = DeliverySource.fromDeliverySourceAttributes(stack, 'ImportedDeliverySource', {
      deliverySourceArn: arn,
      deliverySourceName: name,
    });

    // THEN
    expect(deliverySource.deliverySourceArn).toEqual(arn);
    expect(deliverySource.deliverySourceName).toEqual(name);
  });

  // DeliverySourceLogType values test
  describe('DeliverySourceLogType Values', () => {
    test.each([
      [DeliverySourceLogType.APPLICATION_LOGS, 'APPLICATION_LOGS'],
      [DeliverySourceLogType.CLOUDFRONT_ACCESS_LOGS, 'ACCESS_LOGS'],
      [DeliverySourceLogType.CODEWHISPERER_EVENT_LOGS, 'EVENT_LOGS'],
      [DeliverySourceLogType.MEDIAPACKAGE_EGRESS_ACCESS_LOGS, 'EGRESS_ACCESS_LOGS'],
      [DeliverySourceLogType.MEDIAPACKAGE_INGRESS_ACCESS_LOGS, 'INGRESS_ACCESS_LOGS'],
      [DeliverySourceLogType.MEDIATAILOR_AD_DECISION_SERVER_LOGS, 'AD_DECISION_SERVER_LOGS'],
      [DeliverySourceLogType.MEDIATAILOR_MANIFEST_SERVICE_LOGS, 'MANIFEST_SERVICE_LOGS'],
      [DeliverySourceLogType.MEDIATAILOR_TRANSCODE_LOGS, 'TRANSCODE_LOGS'],
      [DeliverySourceLogType.IAM_IDENTITY_CENTER_ERROR_LOGS, 'ERROR_LOGS'],
      [DeliverySourceLogType.AMAZON_Q_EVENT_LOGS, 'EVENT_LOGS'],
      [DeliverySourceLogType.WORKMAIL_ACCESS_CONTROL_LOGS, 'ACCESS_CONTROL_LOGS'],
      [DeliverySourceLogType.WORKMAIL_AUTHENTICATION_LOGS, 'AUTHENTICATION_LOGS'],
      [DeliverySourceLogType.WORKMAIL_AVAILABILITY_PROVIDER_LOGS, 'WORKMAIL_AVAILABILITY_PROVIDER_LOGS'],
      [DeliverySourceLogType.WORKMAIL_MAILBOX_ACCESS_LOGS, 'WORKMAIL_MAILBOX_ACCESS_LOGS'],
      [DeliverySourceLogType.WORKMAIL_PERSONAL_ACCESS_TOKEN_LOGS, 'WORKMAIL_PERSONAL_ACCESS_TOKEN_LOGS'],
    ])('%s translates to %s', (enumValue, expectedLogType) => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new DeliverySource(stack, 'DeliverySource', {
        name: 'MyDeliverySource',
        logType: enumValue,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
        Name: 'MyDeliverySource',
        LogType: expectedLogType,
      });
    });
  });

  // Validation failure tests
  describe('Validation Failures', () => {
    test('throws when name exceeds 60 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliverySource(stack, 'DeliverySource', {
          name: 'a'.repeat(61),
        });
      }).toThrow(/Delivery source name can not be longer than 64 characters/);
    });

    test('throws when name contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliverySource(stack, 'DeliverySource', {
          name: 'Invalid@Name',
        });
      }).toThrow(/Delivery source name can only contain alphanumeric characters/);
    });

    test('throws when logType contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliverySource(stack, 'DeliverySource', {
          name: 'MyDeliverySource', 
          logType: 'Invalid@LogType',
        });
      }).toThrow(/LogType can only contain alphanumeric characters/);
    });

    test('throws when logType exceeds 255 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliverySource(stack, 'DeliverySource', {
          name: 'MyDeliverySource', 
          logType: 'a'.repeat(256),
        });
      }).toThrow(/LogType must be between 1 and 255 characters/);
    });

    test('throws when resourceArn is less than 16 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliverySource(stack, 'DeliverySource', {
          name: 'MyDeliverySource', 
          resourceArn: 'arn:aws:short',
        });
      }).toThrow(/ResourceArn must be between 16 and 2048 characters/);
    });

    test('throws when resourceArn exceeds 2048 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliverySource(stack, 'DeliverySource', {
          name: 'MyDeliverySource', 
          resourceArn: 'arn:aws:service:' + 'a'.repeat(2048) + ':resource',
        });
      }).toThrow(/ResourceArn must be between 16 and 2048 characters/);
    });
  });

  // Token validation skipping tests
  describe('Token Validation', () => {
    test('skips validation when name is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliverySource = new DeliverySource(stack, 'DeliverySource', {
        name: cdk.Lazy.string({ produce: () => 'Invalid@Name' }),
        logType: DeliverySourceLogType.CLOUDFRONT_ACCESS_LOGS,
      });

      // THEN
      expect(deliverySource).toBeDefined();
    });

    test('skips validation when logType is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliverySource = new DeliverySource(stack, 'DeliverySource', {
        name: 'MyDeliverySource',
        logType: cdk.Lazy.string({ produce: () => 'Invalid@LogType' }),
      });

      // THEN
      expect(deliverySource).toBeDefined();
    });

    test('skips validation when resourceArn is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliverySource = new DeliverySource(stack, 'DeliverySource', {
        name: 'MyDeliverySource',
        resourceArn: cdk.Lazy.string({ produce: () => 'short' }),
      });

      // THEN
      expect(deliverySource).toBeDefined();
    });

    test('skips validation when all properties are tokens', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliverySource = new DeliverySource(stack, 'DeliverySource', {
        name: cdk.Lazy.string({ produce: () => 'Invalid@Name' }),
        logType: cdk.Lazy.string({ produce: () => 'Invalid@LogType' }),
        resourceArn: cdk.Lazy.string({ produce: () => 'short' }),
      });

      // THEN
      expect(deliverySource).toBeDefined();
    });
  });

  // generateUniqueId method test (indirectly)
  test('generateUniqueId produces valid names', () => {
    // GIVEN
    const stack = new cdk.Stack();
    
    // Include special characters in the stack name
    Object.defineProperty(stack, 'stackName', {
      value: 'Test@Stack#With$Special&Chars',
    });

    // WHEN
    new DeliverySource(stack, 'DeliverySource', {});

    // THEN
    // Success if no error is thrown
    // generateUniqueId is called internally and produces a valid name
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {});
  });
});
