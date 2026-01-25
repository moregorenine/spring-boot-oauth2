package com.moregorenine.springbootoauth2.controller.oauth;

import org.springframework.stereotype.Controller;

@Controller
public class OAuth2LoginController {
    // OAuth2 로그인은 /oauth2/authorization/google 경로를 통해 시작됩니다
    // 성공 시 OAuth2AuthenticationSuccessHandler가 /dt-app/?token={jwt}로 리다이렉트합니다
}
