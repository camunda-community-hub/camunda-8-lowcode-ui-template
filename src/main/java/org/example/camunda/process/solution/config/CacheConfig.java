package org.example.camunda.process.solution.config;

import java.util.List;
import javax.cache.Caching;
import org.ehcache.config.CacheConfiguration;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.jsr107.Eh107Configuration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

  @Bean
  public CacheManager ehCacheManager() {

    CacheConfiguration<Long, String> cacheConfig =
        CacheConfigurationBuilder.newCacheConfigurationBuilder(
                Long.class, String.class, ResourcePoolsBuilder.heap(10))
            .build();

    javax.cache.CacheManager cacheManager = Caching.getCachingProvider().getCacheManager();

    List<String> caches = List.of("processXmls");
    for (String cacheName : caches) {
      cacheManager.destroyCache(cacheName);
      cacheManager.createCache(
          cacheName, Eh107Configuration.fromEhcacheCacheConfiguration(cacheConfig));
    }
    return new JCacheCacheManager(cacheManager);
  }
}
