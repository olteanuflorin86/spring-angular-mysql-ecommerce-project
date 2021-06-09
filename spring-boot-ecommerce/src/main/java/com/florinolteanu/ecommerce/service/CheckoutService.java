package com.florinolteanu.ecommerce.service;

import com.florinolteanu.ecommerce.dto.Purchase;
import com.florinolteanu.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
