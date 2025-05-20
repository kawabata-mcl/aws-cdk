import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { CfnDelivery } from './logs.generated';
import { Lazy, Names, Arn, ArnFormat } from 'aws-cdk-lib/core';

/**
 * Interface for the delivery
 */
export interface IDelivery extends cdk.IResource {
  /**
   * The ARN of the delivery
   * @attribute
   */
  readonly deliveryArn: string;

  /**
   * The name of the delivery
   */
  readonly deliverySourceName: string;
}

/**
 * Base class for delivery implementations
 */
abstract class DeliveryBase extends cdk.Resource implements IDelivery {
  /**
   * The ARN of the delivery
   */
  public abstract readonly deliveryArn: string;

  /**
   * The name of the delivery
   */
  public abstract readonly deliverySourceName: string;
}

/**
 * Properties for importing an existing Delivery
 */
export interface DeliveryAttributes {
  /**
   * The ARN of the delivery
   */
  readonly deliveryArn: string;

  /**
   * The name of the delivery
   */
  readonly deliverySourceName: string;
}

/**
 * Properties for creating a new Delivery
 */
export interface DeliveryProps {
  /**
   * The delivery source for this delivery
   */
  readonly deliverySourceName?: string;

  /**
   * The delivery destination for this delivery
   */
  readonly deliveryDestinationArn: string;

  /**
   * The field delimiter for this delivery (used with some output formats)
   * @default - No delimiter
   */
  readonly fieldDelimiter?: string;
  
  /**
   * The record fields for this delivery (used with some output formats)
   * @default - No record fields
   */
  readonly recordFields?: string[];
  
  /**
   * Enable Hive compatible path for S3 delivery
   * @default - false
   */
  readonly s3EnableHiveCompatiblePath?: boolean;

  /**
   * The S3 suffix path for this delivery
   * @default - No suffix path
   */
  readonly s3SuffixPath?: string;

  /**
   * The tags to apply to the delivery
   * @default - No tags
   */
  readonly tags?: cdk.CfnTag[];
}

/**
 * A CloudWatch Logs Delivery
 * 
 * Represents a connection between a delivery source and a delivery destination.
 */
export class Delivery extends DeliveryBase {
  /**
   * Import an existing delivery based on its ARN and name
   */
  public static fromDeliveryAttributes(scope: Construct, id: string, attrs: DeliveryAttributes): IDelivery {
    class Import extends DeliveryBase {
      public readonly deliveryArn = attrs.deliveryArn;
      public readonly deliverySourceName = attrs.deliverySourceName;
    }

    return new Import(scope, id);
  }

  public readonly deliveryArn: string;
  public readonly deliverySourceName: string;

  constructor(scope: Construct, id: string, props: DeliveryProps) {
    super(scope, id, {
      physicalName: props.deliverySourceName ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    // Validate required parameters
    if (!props.deliveryDestinationArn) {
      throw new Error('deliveryDestinationArn is required');
    }

    // Validate deliverySourceName if provided
    if (props.deliverySourceName && !cdk.Token.isUnresolved(props.deliverySourceName)) {
      if (props.deliverySourceName.length > 60) {
        throw new Error(`Delivery name can not be longer than 60 characters but has ${props.deliverySourceName.length} characters.`);
      }
      
      if (!/^[a-zA-Z0-9._-]+$/.test(props.deliverySourceName)) {
        throw new Error('Delivery name can only contain alphanumeric characters, dots, underscores, and hyphens');
      }
    }

    // Validate deliveryDestinationArn format
    if (!cdk.Token.isUnresolved(props.deliveryDestinationArn)) {
      if (props.deliveryDestinationArn.length < 16 || props.deliveryDestinationArn.length > 2048) {
        throw new Error('deliveryDestinationArn must be between 16 and 2048 characters');
      }

      // Verify it's a valid ARN format using core Arn class
      try {
        Arn.split(props.deliveryDestinationArn, ArnFormat.COLON_RESOURCE_NAME);
      } catch (e) {
        throw new Error('deliveryDestinationArn must be a valid ARN format');
      }
    }

    // Validate fieldDelimiter if provided
    if (props.fieldDelimiter !== undefined && !cdk.Token.isUnresolved(props.fieldDelimiter)) {
      if (props.fieldDelimiter.length < 1 || props.fieldDelimiter.length > 5) {
        throw new Error('fieldDelimiter must be between 1 and 5 characters');
      }
    }

    // Validate recordFields if provided
    if (props.recordFields && !cdk.Token.isUnresolved(props.recordFields)) {
      if (props.recordFields.length > 128) {
        throw new Error('recordFields array cannot contain more than 128 items');
      }
      
      // Validate each field name
      for (const field of props.recordFields) {
        if (!cdk.Token.isUnresolved(field)) {
          if (field.length < 1 || field.length > 255) {
            throw new Error('Each record field name must be between 1 and 255 characters');
          }
          if (!/^[a-zA-Z0-9._-]+$/.test(field)) {
            throw new Error('Record field names can only contain alphanumeric characters, dots, underscores, and hyphens');
          }
        }
      }
    }

    // Validate s3SuffixPath if provided
    if (props.s3SuffixPath && !cdk.Token.isUnresolved(props.s3SuffixPath)) {
      if (props.s3SuffixPath.length > 256) {
        throw new Error('s3SuffixPath must not exceed 256 characters');
      }
      
      // Check that the suffix path format is valid
      if (!/^[a-zA-Z0-9!_.*'()\/ \-{}:=]+$/.test(props.s3SuffixPath)) {
        throw new Error('s3SuffixPath contains invalid characters. Allowed characters include alphanumeric characters, spaces, path separators (/), and special characters (!_.*\'()/-=). Variable patterns like {timestamp:yyyy} are also allowed.');
      }

      // Validate timestamp variable patterns if present
      const timestampPattern = /{timestamp:(yyyy|MM|dd)}/g;
      const matches = props.s3SuffixPath.match(timestampPattern);
      if (matches) {
        // All timestamp patterns must be valid
        const validPatterns = matches.every(pattern => 
          ['{timestamp:yyyy}', '{timestamp:MM}', '{timestamp:dd}'].includes(pattern)
        );
        if (!validPatterns) {
          throw new Error('Invalid timestamp pattern in s3SuffixPath. Valid patterns are {timestamp:yyyy}, {timestamp:MM}, and {timestamp:dd}');
        }
      }
    }

    // Create the L1 resource
    const resource = new CfnDelivery(this, 'Resource', {
      deliveryDestinationArn: props.deliveryDestinationArn,
      deliverySourceName: this.physicalName,
      fieldDelimiter: props.fieldDelimiter,
      recordFields: props.recordFields,
      s3EnableHiveCompatiblePath: props.s3EnableHiveCompatiblePath,
      s3SuffixPath: props.s3SuffixPath,
      tags: props.tags,
    });

    this.deliveryArn = resource.attrArn;
    this.deliverySourceName = resource.deliverySourceName;
  }

  private generateUniqueId(): string {
    const name = Names.uniqueId(this);
    // Ensure the name only contains valid characters
    const sanitizedName = name.replace(/[^\w-]/g, '');
    
    // Ensure the name is not longer than 60 characters
    if (sanitizedName.length > 60) {
      return sanitizedName.substring(0, 30) + sanitizedName.substring(sanitizedName.length - 30);
    }
    return sanitizedName;
  }
}
