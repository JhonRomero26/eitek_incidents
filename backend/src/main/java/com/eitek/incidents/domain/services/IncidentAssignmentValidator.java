package com.eitek.incidents.domain.services;

import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.models.Incident;

/**
 * Servicio de dominio que encapsula las reglas de negocio
 * para la asignación de incidentes
 */
public class IncidentAssignmentValidator {
    
    /**
     * Valida si un assignee puede asignar un incidente a otro assignee
     * 
     * Reglas:
     * - Solo admin y support pueden asignar incidentes
     * - admin y support pueden asignar a cualquier rol
     * - Otros roles no pueden asignar incidentes
     * 
     * @param assigner El assignee que intenta hacer la asignación
     * @param targetAssignee El assignee al que se quiere asignar
     * @param incident La incidencia a asignar
     * @return true si la asignación está permitida
     */
    public boolean canAssign(Assignee assigner, Assignee targetAssignee, Incident incident) {
        if (assigner == null) {
            return false;
        }
        
        if (!assigner.isActive()) {
            return false;
        }
        
        if (!assigner.canAssignIncidents()) {
            return false; 
        }
        
        if (targetAssignee != null && !targetAssignee.isActive()) {
            return false; 
        }
        
        return true;
    }
    
    /**
     * Valida si se puede auto-asignar una incidencia
     */
    public boolean canSelfAssign(Assignee assigner, Incident incident) {
        if (assigner == null || !assigner.isActive()) {
            return false;
        }
        
        return true;
    }
}
