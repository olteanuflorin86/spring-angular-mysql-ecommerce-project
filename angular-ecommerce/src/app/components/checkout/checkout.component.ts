import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        // expirationYear: ['']
        expirationYear: `${new Date().getFullYear()}`
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

  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix for states:
      this.billingAddressState = this.shippingAddressState;      

    } else {
      // Clear out all of the field on the Billing Address
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states:
      this.billingAddressState = [];
    }
    
  }

  onSubmit() {
    console.log("Handling the submit form");
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
          this.shippingAddressState = data;
        } else {
          this.billingAddressState = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);

      }

    )

  }

}
