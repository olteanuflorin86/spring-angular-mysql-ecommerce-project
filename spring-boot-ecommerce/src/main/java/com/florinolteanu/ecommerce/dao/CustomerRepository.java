package com.florinolteanu.ecommerce.dao;

import com.florinolteanu.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
