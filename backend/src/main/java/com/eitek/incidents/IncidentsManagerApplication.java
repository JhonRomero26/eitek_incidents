package com.eitek.incidents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class IncidentsManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(IncidentsManagerApplication.class, args);
	}
}
