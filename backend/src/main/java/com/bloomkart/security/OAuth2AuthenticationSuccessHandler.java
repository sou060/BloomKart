package com.bloomkart.security;

import com.bloomkart.entity.User;
import com.bloomkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Value("${frontend.redirect-uri:http://localhost:5173/oauth2/redirect}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = jwtUtils.generateAccessToken(user);
            // Redirect to frontend with JWT as a query parameter
            String redirectUrl = frontendRedirectUri + "?token=" + token;
            response.sendRedirect(redirectUrl);
        } else {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(oAuth2User.getAttribute("name"));
            newUser.setRole(User.Role.USER); // Default role
            newUser.setEnabled(true); // If you have an enabled field
            // Set a dummy password for OAuth users
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            newUser.setPassword(encoder.encode("oauth2user-" + UUID.randomUUID()));
            User user = userRepository.save(newUser);
            String token = jwtUtils.generateAccessToken(user);
            // Redirect to frontend with JWT as a query parameter
            String redirectUrl = frontendRedirectUri + "?token=" + token;
            response.sendRedirect(redirectUrl);
        }
    }
} 