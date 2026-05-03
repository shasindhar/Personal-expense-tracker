package com.tracker.dto;

public class AuthResponse {
    private String token;
    private UserInfo user;

    public static class UserInfo {
        private String name;
        private String email;

        public UserInfo() {}

        public UserInfo(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public AuthResponse() {}

    // Constructor for token-only responses (login/register)
    public AuthResponse(String token) {
        this.token = token;
    }

    // Constructor for full responses (Google login)
    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }
}
