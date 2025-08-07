package com.yourpackage.security;

import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Interface that defines a filter chain which is capable of being matched against an HttpServletRequest.
 * Used to configure a SecurityFilterChain in a security config.
 */
public interface SecurityFilterChain {
    
    /**
     * Returns if this SecurityFilterChain should be matched against the supplied request.
     * @param request the request to check for a match
     * @return true if the request matches, false otherwise
     */
    boolean matches(HttpServletRequest request);
    
    /**
     * Gets the filters that are associated with this SecurityFilterChain.
     * @return the List of Filters for this chain
     */
    List<Filter> getFilters();
}
