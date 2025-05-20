import { Template } from '../../assertions';
import * as cdk from '../../core';
import { Delivery } from '../lib';

describe('Delivery', () => {
  // Basic property tests
  test('with required properties only', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Delivery(stack, 'Delivery', { 
      deliverySourceName: 'MyDeliverySource', 
      deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', { 
      DeliverySourceName: 'MyDeliverySource', 
      DeliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination'
    });
  });

  test('with all properties specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Delivery(stack, 'Delivery', { 
      deliverySourceName: 'MyDeliverySource',
      deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      fieldDelimiter: ',',
      recordFields: ['field1', 'field2', 'field3'],
      s3EnableHiveCompatiblePath: true,
      s3SuffixPath: 'logs/year={timestamp:yyyy}/month={timestamp:MM}/day={timestamp:dd}/',
      tags: [{ key: 'Environment', value: 'Production' }]
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', { 
      DeliverySourceName: 'MyDeliverySource', 
      DeliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      FieldDelimiter: ',',
      RecordFields: ['field1', 'field2', 'field3'],
      S3EnableHiveCompatiblePath: true,
      S3SuffixPath: 'logs/year={timestamp:yyyy}/month={timestamp:MM}/day={timestamp:dd}/',
      Tags: [{ Key: 'Environment', Value: 'Production' }]
    });
  });

  test('with required properties and field delimiter', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Delivery(stack, 'Delivery', { 
      deliverySourceName: 'MyDeliverySource', 
      deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      fieldDelimiter: ','
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', { 
      DeliverySourceName: 'MyDeliverySource', 
      DeliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      FieldDelimiter: ','
    });
  });

  test('with required properties and record fields', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Delivery(stack, 'Delivery', { 
      deliverySourceName: 'MyDeliverySource', 
      deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      recordFields: ['field1', 'field2', 'field3']
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', { 
      DeliverySourceName: 'MyDeliverySource', 
      DeliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      RecordFields: ['field1', 'field2', 'field3']
    });
  });

  test('with required properties and S3 settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Delivery(stack, 'Delivery', { 
      deliverySourceName: 'MyDeliverySource', 
      deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      s3EnableHiveCompatiblePath: true,
      s3SuffixPath: 'logs/year={timestamp:yyyy}/month={timestamp:MM}/day={timestamp:dd}/'
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', { 
      DeliverySourceName: 'MyDeliverySource', 
      DeliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      S3EnableHiveCompatiblePath: true,
      S3SuffixPath: 'logs/year={timestamp:yyyy}/month={timestamp:MM}/day={timestamp:dd}/'
    });
  });

  // Auto-generated name test
  test('auto-generates deliverySourceName when not provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Delivery(stack, 'Delivery', {
      deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      DeliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
    });
  });

  // Reference to existing delivery test
  test('fromDeliveryAttributes creates a reference to an existing delivery', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const arn = 'arn:aws:logs:us-east-1:123456789012:delivery:ImportedDelivery';
    const name = 'ImportedDelivery';

    // WHEN
    const delivery = Delivery.fromDeliveryAttributes(stack, 'ImportedDelivery', {
      deliveryArn: arn,
      deliverySourceName: name,
    });

    // THEN
    expect(delivery.deliveryArn).toEqual(arn);
    expect(delivery.deliverySourceName).toEqual(name);
  });

  // Validation failure tests
  describe('Validation Failures', () => {
    test('throws when deliverySourceName exceeds 60 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'a'.repeat(61),
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination'
        });
      }).toThrow(/Delivery name can not be longer than 60 characters/);
    });

    test('throws when deliverySourceName contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'Invalid@Name',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination'
        });
      }).toThrow(/Delivery name can only contain alphanumeric characters/);
    });

    test('throws when deliveryDestinationArn is less than 16 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:short'
        });
      }).toThrow(/deliveryDestinationArn must be between 16 and 2048 characters/);
    });

    test('throws when deliveryDestinationArn exceeds 2048 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:service:' + 'a'.repeat(2048) + ':resource'
        });
      }).toThrow(/deliveryDestinationArn must be between 16 and 2048 characters/);
    });

    test('throws when fieldDelimiter is less than 1 character', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          fieldDelimiter: ''
        });
      }).toThrow(/fieldDelimiter must be between 1 and 5 characters/);
    });

    test('throws when fieldDelimiter exceeds 5 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          fieldDelimiter: 'abcdef'
        });
      }).toThrow(/fieldDelimiter must be between 1 and 5 characters/);
    });

    test('throws when recordFields has more than 128 items', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          recordFields: Array(129).fill('field')
        });
      }).toThrow(/recordFields array cannot contain more than 128 items/);
    });

    test('throws when recordField name exceeds 255 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          recordFields: ['field1', 'a'.repeat(256)]
        });
      }).toThrow(/Each record field name must be between 1 and 255 characters/);
    });

    test('throws when recordField name contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          recordFields: ['field1', 'invalid@field']
        });
      }).toThrow(/Record field names can only contain alphanumeric characters/);
    });

    test('throws when s3SuffixPath exceeds 256 characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          s3SuffixPath: 'a'.repeat(257)
        });
      }).toThrow(/s3SuffixPath must not exceed 256 characters/);
    });

    test('throws when s3SuffixPath contains invalid characters', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN/THEN
      expect(() => {
        new Delivery(stack, 'Delivery', { 
          deliverySourceName: 'MyDeliverySource',
          deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
          s3SuffixPath: 'logs/invalid@path'
        });
      }).toThrow(/s3SuffixPath contains invalid characters/);
    });
  });

  // Token validation skipping tests
  describe('Token Validation', () => {
    test('skips validation when deliverySourceName is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const delivery = new Delivery(stack, 'Delivery', {
        deliverySourceName: cdk.Lazy.string({ produce: () => 'Invalid@Name' }),
        deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
      });

      // THEN
      expect(delivery).toBeDefined();
    });

    test('skips validation when deliveryDestinationArn is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const delivery = new Delivery(stack, 'Delivery', {
        deliverySourceName: 'MyDeliverySource',
        deliveryDestinationArn: cdk.Lazy.string({ produce: () => 'short' }),
      });

      // THEN
      expect(delivery).toBeDefined();
    });

    test('skips validation when fieldDelimiter is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const delivery = new Delivery(stack, 'Delivery', {
        deliverySourceName: 'MyDeliverySource',
        deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
        fieldDelimiter: cdk.Lazy.string({ produce: () => 'abcdef' }),
      });

      // THEN
      expect(delivery).toBeDefined();
    });

    test('skips validation when recordFields is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const delivery = new Delivery(stack, 'Delivery', {
        deliverySourceName: 'MyDeliverySource',
        deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
        recordFields: cdk.Lazy.any({ produce: () => ['field1', 'invalid@field'] }) as any,
      });

      // THEN
      expect(delivery).toBeDefined();
    });

    test('skips validation when s3SuffixPath is a token', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const delivery = new Delivery(stack, 'Delivery', {
        deliverySourceName: 'MyDeliverySource',
        deliveryDestinationArn: 'arn:aws:logs:us-east-1:123456789012:delivery-destination:MyDestination',
        s3SuffixPath: cdk.Lazy.string({ produce: () => 'logs/invalid@path' }),
      });

      // THEN
      expect(delivery).toBeDefined();
    });

    test('skips validation when all properties are tokens', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN - validation is skipped for tokens, so no error should be thrown
      const delivery = new Delivery(stack, 'Delivery', {
        deliverySourceName: cdk.Lazy.string({ produce: () => 'Invalid@Name' }),
        deliveryDestinationArn: cdk.Lazy.string({ produce: () => 'short' }),
        fieldDelimiter: cdk.Lazy.string({ produce: () => 'abcdef' }),
        recordFields: cdk.Lazy.any({ produce: () => ['field1', 'invalid@field'] }) as any,
        s3SuffixPath: cdk.Lazy.string({ produce: () => 'logs/invalid@path' }),
      });

      // THEN
      expect(delivery).toBeDefined();
    });
  });
});
