import { Template } from '../../assertions';
import * as cdk from '../../core';
import { DeliveryDestination, DeliveryDestinationOutputFormat } from '../lib';

describe('DeliveryDestination', () => {
  // Basic property tests
  test('with only name specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {
      name: 'MyDeliveryDestination'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'MyDeliveryDestination'
    });
  });

  test('with name and output format specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {
      name: 'MyDeliveryDestination',
      outputFormat: DeliveryDestinationOutputFormat.JSON
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'MyDeliveryDestination',
      OutputFormat: 'json'
    });
  });

  test('with name and destination resource ARN specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {
      name: 'MyDeliveryDestination',
      destinationResourceArn: 'arn:aws:s3:::my-bucket'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'MyDeliveryDestination',
      DestinationResourceArn: 'arn:aws:s3:::my-bucket'
    });
  });

  test('with name and tags specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {
      name: 'MyDeliveryDestination',
      tags: [{ key: 'Environment', value: 'Production' }]
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'MyDeliveryDestination',
      Tags: [{ Key: 'Environment', Value: 'Production' }]
    });
  });

  test('with all properties specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {
      name: 'MyDeliveryDestination',
      outputFormat: DeliveryDestinationOutputFormat.PARQUET,
      destinationResourceArn: 'arn:aws:s3:::my-bucket',
      deliveryDestinationPolicy: {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            Service: 'logs.amazonaws.com',
          },
          Action: 'logs:*',
          Resource: '*',
        }],
      },
      tags: [{ key: 'Environment', value: 'Production' }]
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'MyDeliveryDestination',
      OutputFormat: 'parquet',
      DestinationResourceArn: 'arn:aws:s3:::my-bucket',
      DeliveryDestinationPolicy: {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            Service: 'logs.amazonaws.com',
          },
          Action: 'logs:*',
          Resource: '*',
        }],
      },
      Tags: [{ Key: 'Environment', Value: 'Production' }]
    });
  });

  test('with custom output format', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {
      name: 'MyDeliveryDestination',
      outputFormat: 'custom' as any
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'MyDeliveryDestination',
      OutputFormat: 'custom'
    });
  });

  // Auto-generated name test
  test('uses auto-generated name when name is not provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DeliveryDestination(stack, 'DeliveryDestination', {});

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {});
  });

  // Reference to existing delivery destination test
  test('fromDeliveryDestinationAttributes creates a reference to an existing delivery destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const arn = 'arn:aws:logs:us-east-1:123456789012:delivery-destination:ImportedDestination';
    const name = 'ImportedDestination';

    // WHEN
    const deliveryDestination = DeliveryDestination.fromDeliveryDestinationAttributes(stack, 'ImportedDeliveryDestination', {
      deliveryDestinationArn: arn,
      deliveryDestinationName: name,
    });

    // THEN
    expect(deliveryDestination.deliveryDestinationArn).toEqual(arn);
    expect(deliveryDestination.deliveryDestinationName).toEqual(name);
  });

  // DeliveryDestinationOutputFormat values test
  describe('DeliveryDestinationOutputFormat Values', () => {
    test.each([
      [DeliveryDestinationOutputFormat.JSON, 'json'],
      [DeliveryDestinationOutputFormat.PLAIN, 'plain'],
      [DeliveryDestinationOutputFormat.W3C, 'w3c'],
      [DeliveryDestinationOutputFormat.PARQUET, 'parquet'],
      [DeliveryDestinationOutputFormat.ORC, 'orc'],
    ])('%s translates to %s', (enumValue, expectedOutputFormat) => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new DeliveryDestination(stack, 'DeliveryDestination', {
        name: 'MyDeliveryDestination',
        outputFormat: enumValue,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
        Name: 'MyDeliveryDestination',
        OutputFormat: expectedOutputFormat,
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
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'a'.repeat(61),
        });
      }).toThrow(/Delivery destination name can not be longer than 60 characters/);
    });

    test('throws when name contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'Invalid@Name',
        });
      }).toThrow(/Delivery destination name can only contain alphanumeric characters/);
    });

    test('throws when outputFormat contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'MyDeliveryDestination',
          outputFormat: 'Invalid@Format' as any,
        });
      }).toThrow(/Output format must contain only alphanumeric characters/);
    });

    test('throws when outputFormat exceeds 12 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'MyDeliveryDestination',
          outputFormat: 'a'.repeat(13) as any,
        });
      }).toThrow(/Output format must be between 1 and 12 characters/);
    });

    test('throws when destinationResourceArn is less than 16 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'MyDeliveryDestination',
          destinationResourceArn: 'arn:aws:short',
        });
      }).toThrow(/DestinationResourceArn must be between 16 and 2048 characters/);
    });

    test('throws when destinationResourceArn exceeds 2048 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'MyDeliveryDestination',
          destinationResourceArn: 'arn:aws:service:' + 'a'.repeat(2048) + ':resource',
        });
      }).toThrow(/DestinationResourceArn must be between 16 and 2048 characters/);
    });

    test('throws when destinationResourceArn has invalid format', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'MyDeliveryDestination',
          destinationResourceArn: 'not-an-arn-format',
        });
      }).toThrow(/DestinationResourceArn must be a valid ARN format/);
    });

    test('throws when deliveryDestinationPolicy is missing Version or Statement', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new DeliveryDestination(stack, 'DeliveryDestination', {
          name: 'MyDeliveryDestination',
          deliveryDestinationPolicy: { Invalid: 'Policy' },
        });
      }).toThrow(/Delivery destination policy must have Version and Statement properties/);
    });
  });

  // Token validation skipping tests
  describe('Token Validation', () => {
    test('skips validation when name is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliveryDestination = new DeliveryDestination(stack, 'DeliveryDestination', {
        name: cdk.Lazy.string({ produce: () => 'Invalid@Name' }),
        outputFormat: DeliveryDestinationOutputFormat.JSON,
      });

      // THEN
      expect(deliveryDestination).toBeDefined();
    });

    test('skips validation when outputFormat is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliveryDestination = new DeliveryDestination(stack, 'DeliveryDestination', {
        name: 'MyDeliveryDestination',
        outputFormat: cdk.Lazy.string({ produce: () => 'Invalid@Format' }) as any,
      });

      // THEN
      expect(deliveryDestination).toBeDefined();
    });

    test('skips validation when destinationResourceArn is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliveryDestination = new DeliveryDestination(stack, 'DeliveryDestination', {
        name: 'MyDeliveryDestination',
        destinationResourceArn: cdk.Lazy.string({ produce: () => 'short' }),
      });

      // THEN
      expect(deliveryDestination).toBeDefined();
    });

    test('skips validation when deliveryDestinationPolicy is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliveryDestination = new DeliveryDestination(stack, 'DeliveryDestination', {
        name: 'MyDeliveryDestination',
        deliveryDestinationPolicy: cdk.Lazy.any({ produce: () => ({ Invalid: 'Policy' }) }),
      });

      // THEN
      expect(deliveryDestination).toBeDefined();
    });

    test('skips validation when all properties are tokens', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const deliveryDestination = new DeliveryDestination(stack, 'DeliveryDestination', {
        name: cdk.Lazy.string({ produce: () => 'Invalid@Name' }),
        outputFormat: cdk.Lazy.string({ produce: () => 'Invalid@Format' }) as any,
        destinationResourceArn: cdk.Lazy.string({ produce: () => 'short' }),
        deliveryDestinationPolicy: cdk.Lazy.any({ produce: () => ({ Invalid: 'Policy' }) }),
      });

      // THEN
      expect(deliveryDestination).toBeDefined();
    });
  });
});
