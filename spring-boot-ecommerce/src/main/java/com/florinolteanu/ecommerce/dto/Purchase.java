package com.florinolteanu.ecommerce.dto;

import com.florinolteanu.ecommerce.entity.Address;
import com.florinolteanu.ecommerce.entity.Customer;
import com.florinolteanu.ecommerce.entity.Order;
import com.florinolteanu.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
