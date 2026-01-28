package com.moregorenine.springbootoauth2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * SvelteKit 애플리케이션 진입점 컨트롤러
 * GitHub Pages 빌드 결과를 Spring Boot에서 재사용
 */
@Controller
public class SvelteKitController {

    /**
     * Root 경로 요청을 SvelteKit index.html로 포워딩
     * 
     * GitHub Pages 빌드 결과 위치:
     * - 실제 파일: src/main/resources/static/dt-app/build/index.html
     * - 요청 경로: /dt-app/build/index.html
     * 
     * forward: 프리픽스를 사용하여 서버 내부에서 정적 파일로 포워딩
     * Spring Boot는 /static을 자동으로 정적 리소스 루트로 인식
     */
    @GetMapping("/")
    public String index() {
        return "forward:/dt-app/build/index.html";
    }
}
