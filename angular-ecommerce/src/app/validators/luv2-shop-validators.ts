import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

  // whitespace validation
  static notOnlyWhitespace(control: FormControl): ValidationErrors {

    // check if string only contains whitespace
    // (we wrote something in the field && we wrote only whitespaces)
    if ((control.value != null) && (control.value.trim().length === 0)) {
      // invalid, return error object
      return {'notOnlyWhitespace': true}
    } else {
      // valid, return null
      return null;
    }

  } 

}
