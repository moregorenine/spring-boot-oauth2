package com.moregorenine.springbootoauth2.controller.api;

import com.moregorenine.springbootoauth2.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserApiController {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 현재 인증된 사용자 정보 반환
     */
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Claims claims = jwtUtil.getClaimsFromToken(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("name", claims.get("name"));
            response.put("email", claims.get("email"));
            response.put("picture", claims.get("picture"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * 인증 상태 확인
     */
    @GetMapping("/auth/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        
        Map<String, Object> response = new HashMap<>();
        
        if (token != null && jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
            Claims claims = jwtUtil.getClaimsFromToken(token);
            response.put("authenticated", true);
            response.put("name", claims.get("name"));
        } else {
            response.put("authenticated", false);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * JWT 토큰 갱신
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 현재는 토큰 갱신 로직이 간단하지만, 실제로는 Refresh Token 패턴 사용 권장
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Token is still valid");
        response.put("token", token);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 로그아웃 (클라이언트 측에서 토큰 삭제)
     */
    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * HTTP 요청에서 JWT 토큰 추출
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        
        return null;
    }
}
