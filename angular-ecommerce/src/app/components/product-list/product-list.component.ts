import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[]; 
  currentCategoryId: number;

  constructor(private productService: ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {

    // check if id parameter is available:
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the id parameter and convert the string value to a number using "+" operator
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } 
    else {
      // id not available, we'll set a default id to one:
      this.currentCategoryId = 1;
    }

    // get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
