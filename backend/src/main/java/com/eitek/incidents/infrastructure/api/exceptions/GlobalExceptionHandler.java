package com.eitek.incidents.infrastructure.api.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.eitek.incidents.domain.exceptions.InsufficientPermissionsException;
import com.eitek.incidents.domain.exceptions.ResourceNotFoundException;

/**
 * Manejador global de excepciones para la API REST
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Recurso no encontrado");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InsufficientPermissionsException.class)
    public ResponseEntity<Map<String, Object>> handleInsufficientPermissionsException(
            InsufficientPermissionsException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.FORBIDDEN.value());
        body.put("error", "Acceso denegado");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Datos inválidos");
        
        String message = "El formato de los datos enviados es incorrecto";
        Throwable cause = ex.getCause();
        if (cause != null && cause.getMessage() != null) {
            String causeMsg = cause.getMessage().toLowerCase();
            if (causeMsg.contains("enum") || causeMsg.contains("assigneeroles") || causeMsg.contains("incidentstatus")) {
                message = "El valor del campo rol o estado no es válido. Valores permitidos: ADMIN, SUPPORT, TECHNICAL, OPERATOR, USER";
            } else if (causeMsg.contains("json")) {
                message = "El formato JSON es inválido";
            }
        }
        
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Error de validación");
        
        StringBuilder messages = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            messages.append(error.getField()).append(": ").append(error.getDefaultMessage()).append(". ");
        });
        
        body.put("message", messages.length() > 0 ? messages.toString() : "Error de validación en los datos");
        body.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Argumento inválido");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(
            Exception ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Error interno del servidor");
        body.put("message", "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.");
        body.put("path", request.getDescription(false).replace("uri=", ""));
        
        // Log the actual error for debugging
        System.err.println("Error no manejado: " + ex.getClass().getName() + " - " + ex.getMessage());
        ex.printStackTrace();
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
