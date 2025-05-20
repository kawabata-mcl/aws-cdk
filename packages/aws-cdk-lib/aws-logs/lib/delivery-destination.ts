import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { Lazy, Names } from 'aws-cdk-lib';
import { CfnDeliveryDestination } from './logs.generated';
import { Arn, ArnFormat } from 'aws-cdk-lib/core';

/**
 * Interface for the delivery destination
 */
export interface IDeliveryDestination extends cdk.IResource {
  /**
   * The ARN of the delivery destination
   * @attribute
   */
  readonly deliveryDestinationArn: string;

  /**
   * The name of the delivery destination
   */
  readonly deliveryDestinationName: string;
}

/**
 * Base class for delivery destination implementations
 */
abstract class DeliveryDestinationBase extends cdk.Resource implements IDeliveryDestination {
  /**
   * The ARN of the delivery destination
   */
  public abstract readonly deliveryDestinationArn: string;

  /**
   * The name of the delivery destination
   */
  public abstract readonly deliveryDestinationName: string;
}

/**
 * Properties for importing an existing DeliveryDestination
 */
export interface DeliveryDestinationAttributes {
  /**
   * The ARN of the delivery destination
   */
  readonly deliveryDestinationArn: string;

  /**
   * The name of the delivery destination
   */
  readonly deliveryDestinationName: string;
}

/**
 * Output formats for delivery destinations
 */
export enum DeliveryDestinationOutputFormat {
  /**
   * JSON format
   */
  JSON = 'json',

  /**
   * Plain text format
   */
  PLAIN = 'plain',

  /**
   * W3C format
   */
  W3C = 'w3c',

  /**
   * Parquet format
   */
  PARQUET = 'parquet',

  /**
   * ORC format
   */
  ORC = 'orc',
}

/**
 * Properties for creating a new DeliveryDestination
 */
export interface DeliveryDestinationProps {
  /**
   * The name of the delivery destination
   * @default - CloudFormation-generated name
   */
  readonly name?: string;

  /**
   * The ARN of the AWS destination that this delivery destination represents.
   * That AWS destination can be a log group in CloudWatch Logs, an Amazon S3 bucket, or a Firehose stream.
   */
  readonly destinationResourceArn?: string;

  /**
   * The output format of the delivery destination
   * @default DeliveryDestinationOutputFormat.JSON
   */
  readonly outputFormat?: DeliveryDestinationOutputFormat;

  /**
   * An IAM policy that grants permissions to CloudWatch Logs to deliver logs cross-account to a specified destination in this account
   * @default - No policy
   */
  readonly deliveryDestinationPolicy?: any | cdk.IResolvable;

  /**
   * The tags to apply to the delivery destination
   * @default - No tags
   */
  readonly tags?: cdk.CfnTag[];
}

/**
 * A CloudWatch Logs Delivery Destination
 */
export class DeliveryDestination extends DeliveryDestinationBase {
  /**
   * Import an existing delivery destination based on its ARN and name
   */
  public static fromDeliveryDestinationAttributes(scope: Construct, id: string, attrs: DeliveryDestinationAttributes): IDeliveryDestination {
    class Import extends DeliveryDestinationBase {
      public readonly deliveryDestinationArn = attrs.deliveryDestinationArn;
      public readonly deliveryDestinationName = attrs.deliveryDestinationName;
    }

    return new Import(scope, id);
  }

  public readonly deliveryDestinationArn: string;
  public readonly deliveryDestinationName: string;

  constructor(scope: Construct, id: string, props: DeliveryDestinationProps) {
    super(scope, id, {
      physicalName: props.name ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    // Validate name if provided
    if (props.name && !cdk.Token.isUnresolved(props.name)) {
      if (props.name.length > 60) {
        throw new Error(`Delivery destination name can not be longer than 60 characters but has ${props.name.length} characters.`);
      }
      
      if (!/^[\w-]*$/.test(props.name)) {
        throw new Error('Delivery destination name can only contain alphanumeric characters, underscores, and hyphens');
      }
    }

    // Validate output format length if provided
    if (props.outputFormat && !cdk.Token.isUnresolved(props.outputFormat)) {
      const format = props.outputFormat.toString();
      if (!/^[0-9A-Za-z]+$/.test(format)) {
        throw new Error('Output format must contain only alphanumeric characters');
      }
      if (format.length < 1 || format.length > 12) {
        throw new Error('Output format must be between 1 and 12 characters');
      }
    }

    // Validate destinationResourceArn if provided
    if (props.destinationResourceArn && !cdk.Token.isUnresolved(props.destinationResourceArn)) {
      if (props.destinationResourceArn.length < 16 || props.destinationResourceArn.length > 2048) {
        throw new Error('DestinationResourceArn must be between 16 and 2048 characters');
      }

      // Verify it's a valid ARN format using core Arn class
      try {
        Arn.split(props.destinationResourceArn, ArnFormat.COLON_RESOURCE_NAME);
      } catch (e) {
        throw new Error('DestinationResourceArn must be a valid ARN format');
      }
    }

    // Validate deliveryDestinationPolicy if provided
    if (props.deliveryDestinationPolicy && !cdk.Token.isUnresolved(props.deliveryDestinationPolicy)) {
      // If it's a concrete policy object (not a CDK token), we can do some basic validation
      if (typeof props.deliveryDestinationPolicy === 'object' && !cdk.Tokenization.isResolvable(props.deliveryDestinationPolicy)) {
        try {
          // Simple structure validation - this is a very basic check
          const policy = props.deliveryDestinationPolicy;
          if (!policy.Version || !policy.Statement) {
            throw new Error('Delivery destination policy must have Version and Statement properties');
          }
        } catch (e: any) {
          throw new Error(`Invalid delivery destination policy: ${e.message || 'Unknown error'}`);
        }
      }
    }

    // Create the L1 resource
    const resource = new CfnDeliveryDestination(this, 'Resource', {
      name: this.physicalName,
      destinationResourceArn: props.destinationResourceArn,
      outputFormat: props.outputFormat,
      deliveryDestinationPolicy: props.deliveryDestinationPolicy,
      tags: props.tags,
    });

    this.deliveryDestinationArn = resource.attrArn;
    this.deliveryDestinationName = resource.name;
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
