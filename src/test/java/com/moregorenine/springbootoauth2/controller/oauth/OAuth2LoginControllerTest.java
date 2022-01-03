package com.moregorenine.springbootoauth2.controller.oauth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OAuth2LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rootWhenAuthenticatedReturnsUserAndClient() throws Exception {
        // @formatter:off
        this.mockMvc.perform(get("/").with(oauth2Login()))
                .andExpect(model().attribute("userName", "user"))
                .andExpect(model().attribute("clientName", "test"))
                .andExpect(model().attribute("userAttributes", Collections.singletonMap("sub", "user")));
        // @formatter:on
    }

}
