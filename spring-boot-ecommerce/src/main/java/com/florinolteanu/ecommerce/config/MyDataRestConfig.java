package com.florinolteanu.ecommerce.config;

import com.florinolteanu.ecommerce.entity.Country;
import com.florinolteanu.ecommerce.entity.Product;
import com.florinolteanu.ecommerce.entity.ProductCategory;
import com.florinolteanu.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer  {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};

        // disable HTTP methods for Product: POST, PUT and DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        // disable HTTP methods for ProductCategory: POST, PUT and DELETE
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        // disable HTTP methods for Country: POST, PUT and DELETE
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        // disable HTTP methods for State: POST, PUT and DELETE
        disableHttpMethods(State.class, config, theUnsupportedActions);

        // call an internal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // expose entity ids:

        // - get a list of all the entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        // If we print it:
        // System.out.println(entities);
        // we get:
        // [Product, ProductCategory]

        // - create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        // - get the entity types for the entities
        for(EntityType tempEntityType: entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }
        // If we print it:
        // System.out.println(entityClasses);
        // we get:
        // [class com.florinolteanu.ecommerce.entity.ProductCategory, class com.florinolteanu.ecommerce.entity.Product]

        // - expose the entity ids for the array of entity/ domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
