import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService, private cartService: CartService) { }


  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
        email: new FormControl('', 
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]  
        )
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        // expirationYear: ['']
        expirationYear: [`${new Date().getFullYear()}`]
      }),
      reviewYourOrder: this.formBuilder.group({
        totalQuantity: 0,
        shipping: 'FREE',
        totalPrice: '$'+'0.00'
      })
    });


    // populate credit card months
    // Old way of doing things:
    // let startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);
    // this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
    //   data => {
    //     console.log("Retrieved credit card months: " + JSON.stringify(data));
    //     this.creditCardMonths = data;
    //   }
    // );
    // New way of doing things:
    this.handleMonthsAndYears();

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card yearss: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );


    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.reviewCartDetails();    

  }


  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }



  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix for states:
      this.billingAddressStates = this.shippingAddressStates;      

    } else {
      // Clear out all of the field on the Billing Address
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states:
      this.billingAddressStates = [];
    }
    
  }

  onSubmit() {

    console.log("Handling the submit form");


    // We check for form field validation on submit
    // (Touching all fields triggers the display of the errors messages)
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log("CheckoutFormGroup is valid: " + this.checkoutFormGroup.valid);


    // we console.log the form data, only for customer part of the form this time:
    console.log(this.checkoutFormGroup.get('customer').value);
    // we can get only the email from all the values:
    console.log("The email address is: " + this.checkoutFormGroup.get('customer').value.email);

    // we check the selected country code and country name/ state name:
    console.log("The shipping address country name is: " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address country code is: " + this.checkoutFormGroup.get('shippingAddress').value.country.code);
    console.log("The shipping address state name is: " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
    console.log("The billing address country name is: " + this.checkoutFormGroup.get('billingAddress').value.country.name);
    console.log("The billing address country code is: " + this.checkoutFormGroup.get('billingAddress').value.country.code);
    console.log("The shipping address state name is: " + this.checkoutFormGroup.get('billingAddress').value.state.name);


  }

  
  handleMonthsAndYears(): void {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    console.log(currentYear);
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    console.log(selectedYear);

    // if the current year equals the selected year, then start with current month
    
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }


  getStates(formGroupName: string) {
    
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;

    // just for debugging purposes:
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country code: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(

      data => {

        if(formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);

      }

    )

  }

  reviewCartDetails() {

    console.log('reviewCartDetails');

    // subscribe to the cart status totalPrice
    this.cartService.totalPriceCheckout.subscribe(
      data => this.totalPrice = data
    )

    // subscribe to the cart status totalQuantity
    this.cartService.totalQuantityCheckout.subscribe(
      data => this.totalQuantity = data
    )

  }


}
