package com.moregorenine.springbootoauth2.controller.oauth;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * OAuth2 사용자 정보 컨트롤러
 * 
 * ⚠️ 주의: "/" 경로는 SvelteKitController에서 처리합니다.
 * 이 컨트롤러는 OAuth2 사용자 정보를 Thymeleaf로 표시하는 별도 페이지입니다.
 */
@Controller
public class OAuth2LoginController {

    /**
     * OAuth2 사용자 정보 페이지
     * Thymeleaf 템플릿으로 사용자 정보 표시
     */
    @GetMapping("/oauth2/user-info")
    public String userInfo(@RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,
                           @AuthenticationPrincipal OAuth2User oauth2User,
                           Model model) {
        model.addAttribute("userName", oauth2User.getName());
        model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());
        model.addAttribute("userAttributes", oauth2User.getAttributes());
        return "index";
    }
}
