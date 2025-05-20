import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { Lazy, Names, Arn, ArnFormat } from 'aws-cdk-lib';
import { CfnDeliverySource } from './logs.generated';

/**
 * Interface for the delivery source
 */
export interface IDeliverySource extends cdk.IResource {
  /**
   * The ARN of the delivery source
   * @attribute
   */
  readonly deliverySourceArn: string;

  /**
   * The name of the delivery source
   */
  readonly deliverySourceName: string;
}

/**
 * Base class for delivery source implementations
 */
abstract class DeliverySourceBase extends cdk.Resource implements IDeliverySource {
  /**
   * The ARN of the delivery source
   */
  public abstract readonly deliverySourceArn: string;

  /**
   * The name of the delivery source
   */
  public abstract readonly deliverySourceName: string;
}

/**
 * Properties for importing an existing DeliverySource
 */
export interface DeliverySourceAttributes {
  /**
   * The ARN of the delivery source
   */
  readonly deliverySourceArn: string;

  /**
   * The name of the delivery source
   */
  readonly deliverySourceName: string;
}

/**
 * Log types for delivery sources
 */
export enum DeliverySourceLogType {
  /**
   * Application logs for various services.
   * Corresponds to: 
   * - Amazon Bedrock Application Logs
   * - Amazon SES Mail Manager Application Log
   */
  APPLICATION_LOGS = 'APPLICATION_LOGS',

  /**
   * Amazon CloudFront access logs
   */
  ACCESS_LOGS = 'ACCESS_LOGS',

  /**
   * Amazon CodeWhisperer event logs
   */
  CODEWHISPERER_EVENT_LOGS = 'CODEWHISPERER_EVENT_LOGS',

  /**
   * Elemental MediaPackage egress access logs
   */
  EGRESS_ACCESS_LOGS = 'EGRESS_ACCESS_LOGS',

  /**
   * Elemental MediaPackage ingress access logs
   */
  INGRESS_ACCESS_LOGS = 'INGRESS_ACCESS_LOGS',

  /**
   * Elemental MediaTailor ad decision server logs
   */
  AD_DECISION_SERVER_LOGS = 'AD_DECISION_SERVER_LOGS',

  /**
   * Elemental MediaTailor manifest service logs
   */
  MANIFEST_SERVICE_LOGS = 'MANIFEST_SERVICE_LOGS',

  /**
   * Elemental MediaTailor transcode logs
   */
  TRANSCODE_LOGS = 'TRANSCODE_LOGS',

  /**
   * IAM Identity Center error logs
   */
  ERROR_LOGS = 'ERROR_LOGS',

  /**
   * Amazon Q event logs
   */
  AMAZON_Q_EVENT_LOGS = 'AMAZON_Q_EVENT_LOGS',

  /**
   * Amazon WorkMail access control logs
   */
  ACCESS_CONTROL_LOGS = 'ACCESS_CONTROL_LOGS',

  /**
   * Amazon WorkMail authentication logs
   */
  AUTHENTICATION_LOGS = 'AUTHENTICATION_LOGS',

  /**
   * Amazon WorkMail availability provider logs
   */
  WORKMAIL_AVAILABILITY_PROVIDER_LOGS = 'WORKMAIL_AVAILABILITY_PROVIDER_LOGS',

  /**
   * Amazon WorkMail mailbox access logs
   */
  WORKMAIL_MAILBOX_ACCESS_LOGS = 'WORKMAIL_MAILBOX_ACCESS_LOGS',

  /**
   * Amazon WorkMail personal access token logs
   */
  WORKMAIL_PERSONAL_ACCESS_TOKEN_LOGS = 'WORKMAIL_PERSONAL_ACCESS_TOKEN_LOGS',
}

/**
 * Properties for creating a new DeliverySource
 */
export interface DeliverySourceProps {
  /**
   * The name of the delivery source
   * @default - CloudFormation-generated name
   */
  readonly name?: string;

  /**
   * The log type for the delivery source
   * 
   * It's recommended to use the DeliverySourceLogType enum for known AWS service log types.
   * For new or unsupported log types, use a string value according to the AWS service's documentation.
   */
  readonly logType?: DeliverySourceLogType | string;

  /**
   * The resource ARN (Optional for certain log types)
   * @default - undefined
   */
  readonly resourceArn?: string;

  /**
   * The tags to apply to the delivery source
   * @default - No tags
   */
  readonly tags?: cdk.CfnTag[];
}

/**
 * A CloudWatch Logs Delivery Source
 */
export class DeliverySource extends DeliverySourceBase {
  /**
   * Import an existing delivery source based on its ARN and name
   */
  public static fromDeliverySourceAttributes(scope: Construct, id: string, attrs: DeliverySourceAttributes): IDeliverySource {
    class Import extends DeliverySourceBase {
      public readonly deliverySourceArn = attrs.deliverySourceArn;
      public readonly deliverySourceName = attrs.deliverySourceName;
    }

    return new Import(scope, id);
  }

  public readonly deliverySourceArn: string;
  public readonly deliverySourceName: string;

  constructor(scope: Construct, id: string, props: DeliverySourceProps) {
    super(scope, id, {
      physicalName: props.name ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    if (props.name && !cdk.Token.isUnresolved(props.name)) {
      if (props.name.length > 60) {
        throw new Error(`Delivery source name can not be longer than 64 characters but has ${props.name.length} characters.`);
      }
      
      if (!/^[\w-]*$/.test(props.name)) {
        throw new Error('Delivery source name can only contain alphanumeric characters, underscores, and hyphens');
      }
    }

    // Validate logType if provided as a string
    if (props.logType && typeof props.logType === 'string' && !cdk.Token.isUnresolved(props.logType)) {
      if (props.logType.length < 1 || props.logType.length > 255) {
        throw new Error('LogType must be between 1 and 255 characters');
      }
      if (!/^[\w-]*$/.test(props.logType)) {
        throw new Error('LogType can only contain alphanumeric characters, underscores, and hyphens');
      }
    }

    // Validate resourceArn if provided
    if (props.resourceArn && !cdk.Token.isUnresolved(props.resourceArn)) {
      if (props.resourceArn.length < 16 || props.resourceArn.length > 2048) {
        throw new Error('ResourceArn must be between 16 and 2048 characters');
      }

      // Verify it's a valid ARN format using core Arn class
      try {
        Arn.split(props.resourceArn, ArnFormat.COLON_RESOURCE_NAME);
      } catch (e) {
        throw new Error('ResourceArn must be a valid ARN format');
      }
    }

    // Create the L1 resource
    const resource = new CfnDeliverySource(this, 'Resource', {
      name: this.physicalName,
      logType: props.logType,
      resourceArn: props.resourceArn,
      tags: props.tags,
    });

    this.deliverySourceArn = resource.attrArn;
    this.deliverySourceName = resource.name;
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
