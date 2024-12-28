import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DifferentFields', async: false })
export class ValidateFieldDifferent implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const relatedPropertyName = args.constraints[0];
    const relatedValue = object[relatedPropertyName];
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const relatedPropertyName = args.constraints[0];
    return `${args.property} must be different from ${relatedPropertyName}`;
  }
}
