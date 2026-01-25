package com.moregorenine.springbootoauth2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // SvelteKit 빌드 파일을 /dt-app 경로로 제공
        registry.addResourceHandler("/dt-app/**")
                .addResourceLocations("classpath:/static/dt-app/build/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // /dt-app/ 경로를 index.html로 forward
        registry.addViewController("/dt-app/").setViewName("forward:/dt-app/index.html");
    }
}
