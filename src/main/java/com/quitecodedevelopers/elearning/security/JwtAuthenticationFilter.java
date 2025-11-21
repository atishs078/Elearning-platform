package com.quitecodedevelopers.elearning.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Jwts;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerUserDetailService userDetailService;

    private String parseJwt(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        return null;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String token = parseJwt(request);

            if (token != null) {

                String username = jwtUtil.extractUsername(token);

                if (username != null &&
                        SecurityContextHolder.getContext().getAuthentication() == null) {

                    UserDetails userDetails =
                            userDetailService.loadUserByUsername(username);

                    if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                        // 🔥 Extract role from JWT claim
                        String role = Jwts.parser()
                                .verifyWith(jwtUtil.getKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload()
                                .get("role", String.class);

                        if (role == null || role.isBlank()) {
                            System.out.println("ERROR: Token does not contain 'role' claim");
                            filterChain.doFilter(request, response);
                            return;
                        }

                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);


                        // 🔥 Set authentication in security context
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        List.of(authority)
                                );

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }

        } catch (Exception e) {
            System.out.println("JWT Filter Exception: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
