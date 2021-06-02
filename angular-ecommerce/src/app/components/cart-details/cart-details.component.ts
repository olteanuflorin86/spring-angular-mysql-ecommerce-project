import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(): void {

    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // console.log(this.cartItems);

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    // console.log(this.totalPrice);
    // console.log(this.totalQuantity);

    // compute cart total price and total quantity
    this.cartService.computeCartTotals();

    // console.log(this.totalPrice);
    // console.log(this.totalQuantity);

  }

  incrementQuantity(theCartItem: CartItem): void {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem): void {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem): void {
    this.cartService.remove(theCartItem);
  }

}