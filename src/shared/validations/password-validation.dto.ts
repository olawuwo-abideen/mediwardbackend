import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'PasswordMatch', async: false })
  export class PasswordMatchValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      // data
      const { password, confirmPassword } = args.object as any;
  
      // check if password and confirmPassword match
      return password === confirmPassword;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Password and confirm password must match';
    }
  }
  
  export function PasswordMatch(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: PasswordMatchValidator,
      });
    };
  }
  