package com.SpringAi.Ollama.with.SpringAi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
public class OllamaWithSpringAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OllamaWithSpringAiApplication.class, args);
	}

}
