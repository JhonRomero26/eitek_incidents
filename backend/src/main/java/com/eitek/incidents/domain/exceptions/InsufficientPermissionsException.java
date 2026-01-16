package com.eitek.incidents.domain.exceptions;

/**
 * Excepción lanzada cuando un usuario no tiene permisos
 * para realizar una operación
 */
public class InsufficientPermissionsException extends RuntimeException {
    
    public InsufficientPermissionsException(String message) {
        super(message);
    }
    
    public InsufficientPermissionsException(String role, String action) {
        super(String.format("El rol '%s' no tiene permisos para %s", role, action));
    }
}
