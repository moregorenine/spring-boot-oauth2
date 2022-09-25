package com.moregorenine.springbootoauth2.controller.example;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HelloSecurityController {

    @GetMapping("/example/hello-security")
    public String helloSecurity() {
        return "example/hello-security";
    }
}
