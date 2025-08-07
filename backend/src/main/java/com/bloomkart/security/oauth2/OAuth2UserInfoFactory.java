package com.bloomkart.security.oauth2;

import com.bloomkart.exception.BusinessException;
import org.springframework.http.HttpStatus;

import java.util.Map;

/**
 * Factory class to create OAuth2UserInfo based on the provider
 */
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase(AuthProvider.GOOGLE.toString())) {
            return new GoogleOAuth2UserInfo(attributes);
        } else {
            throw new BusinessException("Sorry! Login with " + registrationId + " is not supported yet.", HttpStatus.BAD_REQUEST);
        }
    }
}