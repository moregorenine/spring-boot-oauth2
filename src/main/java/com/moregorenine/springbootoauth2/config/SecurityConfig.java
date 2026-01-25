package com.moregorenine.springbootoauth2.config;

import com.moregorenine.springbootoauth2.security.JwtAuthenticationFilter;
import com.moregorenine.springbootoauth2.security.OAuth2AuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // CORS 설정
            .cors().and()
            
            // CSRF 비활성화 (JWT 사용 시)
            .csrf().disable()
            
            // 세션 정책: OAuth2 로그인 시에만 세션 사용, 이후 Stateless
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .and()
            
            // 요청 권한 설정
            .authorizeRequests()
                // 정적 리소스는 인증 없이 접근 가능
                .antMatchers("/dt-app/**", "/favicon.ico", "/service-worker.js", "/error").permitAll()
                // OAuth2 로그인 엔드포인트는 인증 없이 접근 가능
                .antMatchers("/oauth2/**", "/login/**").permitAll()
                // API 엔드포인트는 인증 필요
                .antMatchers("/api/**").authenticated()
                // 나머지 요청은 OAuth2 인증 필요
                .anyRequest().authenticated()
                .and()
            
            // OAuth2 로그인 설정
            .oauth2Login()
                .successHandler(oauth2AuthenticationSuccessHandler)
                .and()
            
            // JWT 필터 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
