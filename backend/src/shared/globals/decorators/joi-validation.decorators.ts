import { JoiRequestValidationError } from '@global/helpers/error-handler';

import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (target, key, descriptor) => {
    const passedFunction = descriptor.value;

    // takes in the function
    // does the validation logic with it

    // custom pre-function that takes all the argument of the main function
    // does some logic, then calls the original function with its arguments

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));

      if (error?.details) throw new JoiRequestValidationError(error.details[0].message);

      return passedFunction.apply(this, args);
    };

    return descriptor;
  };
}
