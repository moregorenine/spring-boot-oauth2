package com.moregorenine.springbootoauth2.controller.oauth;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OAuth2LoginController {

    @GetMapping("/")
    public String index(@RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,
                        @AuthenticationPrincipal OAuth2User oauth2User) {
        // OAuth2 인증 후 SvelteKit 앱으로 리다이렉트
        return "redirect:/dt-app/";
    }
}
