package com.moregorenine.springbootoauth2.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 설정
 * SvelteKit 정적 리소스 허용 + OAuth2 인증
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 인증 규칙 설정
            .authorizeRequests(authorize -> authorize
                // ⭐ SvelteKit 정적 리소스 허용 (순서 중요!)
                .antMatchers(
                    "/dt-app/**",           // SvelteKit 모든 리소스
                    "/favicon.svg",         // 파비콘
                    "/favicon.ico"
                ).permitAll()
                
                // OAuth2 공개 엔드포인트
                .antMatchers(
                    "/login",               // 로그인 페이지
                    "/oauth2/**",           // OAuth2 콜백
                    "/error"                // 에러 페이지
                ).permitAll()
                
                // "/" 경로는 인증 필요 (OAuth2 로그인 후 SvelteKit 접근)
                .antMatchers("/").authenticated()
                
                // 나머지 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            
            // OAuth2 로그인 설정
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/", true)  // 로그인 성공 시 "/" (SvelteKit)로 리다이렉트
                .failureUrl("/login?error=true")
            )
            
            // 로그아웃 설정
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            
            // CSRF 설정 (SvelteKit 정적 리소스 제외)
            .csrf(csrf -> csrf
                .ignoringAntMatchers("/dt-app/**")
            );

        return http.build();
    }
}
