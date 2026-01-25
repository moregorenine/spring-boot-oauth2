package com.moregorenine.springbootoauth2.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // JWT 서명에 사용할 비밀키 (실제 운영 환경에서는 환경변수나 설정 파일에서 관리)
    // 최소 256비트(32바이트) 이상의 키 필요
    private static final String SECRET = "your-256-bit-secret-key-change-this-in-production-environment-please";
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    
    // 토큰 유효 시간: 24시간
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    /**
     * OAuth2User 정보로 JWT 토큰 생성
     */
    public String generateToken(OAuth2User oauth2User) {
        Map<String, Object> claims = new HashMap<>();
        
        // 기본 정보만 추출 (직렬화 가능한 타입만)
        claims.put("name", oauth2User.getName());
        
        // email 추출 (null 체크)
        Object email = oauth2User.getAttribute("email");
        if (email != null) {
            claims.put("email", email.toString());
        }
        
        // picture 추출 (선택사항)
        Object picture = oauth2User.getAttribute("picture");
        if (picture != null) {
            claims.put("picture", picture.toString());
        }
        
        // 전체 attributes는 넣지 않음 (java.time.Instant 등 직렬화 불가능한 타입 포함)
        
        return createToken(claims, oauth2User.getName());
    }

    /**
     * JWT 토큰 생성
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(SECRET_KEY)
                .compact();
    }

    /**
     * JWT 토큰에서 사용자명 추출
     */
    public String getUserNameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * JWT 토큰에서 모든 클레임 추출
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * JWT 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * JWT 토큰 만료 여부 확인
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getClaimsFromToken(token).getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
