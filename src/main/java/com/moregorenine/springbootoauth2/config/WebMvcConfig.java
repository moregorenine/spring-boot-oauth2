package com.moregorenine.springbootoauth2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // SvelteKit 빌드 파일을 루트 경로에서 제공
        // API 경로를 제외한 모든 요청을 SvelteKit으로 라우팅
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/dt-app/build/")
                .resourceChain(false);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 루트 경로를 index.html로 forward
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
