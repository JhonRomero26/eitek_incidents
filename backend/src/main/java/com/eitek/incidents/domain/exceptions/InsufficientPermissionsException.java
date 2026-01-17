package com.eitek.incidents.domain.exceptions;

/**
 * Excepción lanzada cuando un usuario no tiene permisos
 * para realizar una operación
 */
public class InsufficientPermissionsException extends RuntimeException {
    
    public InsufficientPermissionsException(String message) {
        super(message);
    }
    
    public InsufficientPermissionsException(String userName, String action) {
        super(String.format("El usuario '%s' no tiene permisos para %s", userName, action));
    }
}
