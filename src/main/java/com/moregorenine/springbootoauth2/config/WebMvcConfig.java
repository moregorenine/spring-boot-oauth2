package com.moregorenine.springbootoauth2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Spring MVC 설정
 * SvelteKit SPA 라우팅 지원 (새로고침 시 404 방지)
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * 정적 리소스 핸들러 설정
     * /dt-app/** 경로의 모든 요청을 정적 리소스로 처리하며,
     * 파일이 없으면 index.html로 폴백 (SPA 라우팅 지원)
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/dt-app/**")
                .addResourceLocations("classpath:/static/dt-app/")
                .resourceChain(true)
                .addResolver(new SpaResourceResolver());
    }

    /**
     * SPA 전용 ResourceResolver
     * 
     * 동작 방식:
     * 1. 요청한 파일이 존재하면 해당 파일 반환
     * 2. 파일이 없고 _app 디렉토리가 아니면 build/index.html 반환 (SPA 라우팅)
     * 3. _app 디렉토리는 실제 번들 파일만 존재하므로 404 반환
     * 
     * 예시:
     * - /dt-app/build/index.html → 파일 존재 → 반환
     * - /dt-app/_app/immutable/xxx.js → 파일 존재 → 반환
     * - /dt-app/references → 파일 없음 → build/index.html 반환 (SPA 라우팅)
     */
    private static class SpaResourceResolver extends PathResourceResolver {
        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
            Resource requestedResource = location.createRelative(resourcePath);
            
            // 파일이 존재하면 반환
            if (requestedResource.exists() && requestedResource.isReadable()) {
                return requestedResource;
            }
            
            // 파일이 없으면 index.html 반환 (SPA 라우팅)
            // 단, _app 디렉토리는 제외 (실제 번들 파일만 존재)
            if (!resourcePath.startsWith("_app/") && !resourcePath.startsWith("build/_app/")) {
                return location.createRelative("build/index.html");
            }
            
            return null;
        }
    }
}
