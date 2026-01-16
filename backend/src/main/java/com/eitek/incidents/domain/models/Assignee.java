package com.eitek.incidents.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.checkerframework.checker.units.qual.A;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assignee {
    private Long id;
    private String name;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public void deactivate() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.isActive = true;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Verifica si este assignee puede asignar incidentes a otros
     * Solo admin y support tienen permisos de asignación
     */
    public boolean canAssignIncidents() {
        return AssigneeRoles.ADMIN.name().equalsIgnoreCase(this.role) ||
               AssigneeRoles.SUPPORT.name().equalsIgnoreCase(this.role);
    }
    
    /**
     * Verifica si este assignee puede asignar a un rol específico
     */
    public boolean canAssignToRole(String targetRole) {
        if (!canAssignIncidents()) {
            return false; // Sin permisos de asignación
        }
        return true; // admin y support pueden asignar a cualquier rol
    }
    
    /**
     * Verifica si este assignee puede eliminar incidentes
     * Solo admin tiene permisos de eliminación
     */
    public boolean canDeleteIncidents() {
        return AssigneeRoles.ADMIN.name().equalsIgnoreCase(this.role) ||
               AssigneeRoles.SUPPORT.name().equalsIgnoreCase(this.role);
    }

    public boolean isAdmin() {
        return AssigneeRoles.ADMIN.name().equalsIgnoreCase(this.role);
    }
}
