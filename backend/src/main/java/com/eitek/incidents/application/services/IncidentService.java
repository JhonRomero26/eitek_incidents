package com.eitek.incidents.application.services;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.eitek.incidents.application.dto.AssigneeDTO;
import com.eitek.incidents.application.dto.IncidentDTO;
import com.eitek.incidents.domain.exceptions.InsufficientPermissionsException;
import com.eitek.incidents.domain.exceptions.ResourceNotFoundException;
import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.models.Incident;
import com.eitek.incidents.domain.models.IncidentStatus;
import com.eitek.incidents.domain.repositories.AssigneeRepository;
import com.eitek.incidents.domain.repositories.IncidentRepository;
import com.eitek.incidents.domain.services.IncidentAssignmentValidator;

@Service
@RequiredArgsConstructor
public class IncidentService {
    private final IncidentRepository incidentRepository;
    private final AssigneeRepository assigneeRepository;
    private final IncidentAssignmentValidator assignmentValidator = new IncidentAssignmentValidator();

    public IncidentDTO createIncident(IncidentDTO incidentDTO) {
        Incident incident = Incident.builder()
                .title(incidentDTO.getTitle())
                .status(incidentDTO.getStatus() != null ? incidentDTO.getStatus() : IncidentStatus.OPEN)
                .description(incidentDTO.getDescription() != null ? incidentDTO.getDescription() : "")
                .build();
        Incident savedIncident = incidentRepository.save(incident);
        return mapToDTO(savedIncident);
    }

    public IncidentDTO getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));
        return mapToDTO(incident);
    }

    public List<IncidentDTO> getAllIncidents() {
        List<Incident> incidents = incidentRepository.findAll();
        return incidents.stream()
                .map(this::mapToDTO)
                .toList();
    }

    public IncidentDTO updateIncident(Long id, IncidentDTO incidentDTO) {
        Incident existingIncident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));

        if (incidentDTO.getTitle() != null) {
            existingIncident.setTitle(incidentDTO.getTitle());
        }
        if (incidentDTO.getStatus() != null) {
            existingIncident.setStatus(incidentDTO.getStatus());
        }
        if (incidentDTO.getDescription() != null) {
            existingIncident.setDescription(incidentDTO.getDescription());
        }
        
        // Actualizar updatedAt
        existingIncident.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Si se está asignando a alguien, validar permisos
        if (incidentDTO.getAssigneeId() != null) {
            assignIncident(existingIncident, incidentDTO.getAssigneeId(), incidentDTO.getAssignerId());
        }

        Incident updatedIncident = incidentRepository.save(existingIncident);
        return mapToDTO(updatedIncident);
    }
    
    /**
     * Asigna una incidencia validando los permisos del assignee
     * @param incident La incidencia a asignar
     * @param targetAssigneeId ID del assignee al que se asigna
     * @param assignerId ID del assignee que hace la asignación (puede ser null para auto-asignación)
     */
    private void assignIncident(Incident incident, Long targetAssigneeId, Long assignerId) {
        Assignee targetAssignee = assigneeRepository.findById(targetAssigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", targetAssigneeId));
        
        // Auto-asignación
        if (assignerId == null || assignerId.equals(targetAssigneeId)) {
            if (!assignmentValidator.canSelfAssign(targetAssignee, incident)) {
                throw new InsufficientPermissionsException("No puede auto-asignarse esta incidencia");
            }
        } else {
            // Asignación a otro
            Assignee assigner = assigneeRepository.findById(assignerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", assignerId));
            
            if (!assigner.isAdmin()) {
                throw new InsufficientPermissionsException(assigner.getRole().name(), "asignar incidentes");
            }
        }
        
        incident.setAssigneeId(targetAssigneeId);
        incident.setDateAssigned(LocalDate.now());
    }

    public void deleteIncident(Long id, Long deleterId) {
        // Verificar que la incidencia existe
        incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));
        
        // Validar permisos de eliminación
        if (deleterId == null) {
            throw new InsufficientPermissionsException("Se requiere autenticación para eliminar incidentes");
        }
        
        Assignee deleter = assigneeRepository.findById(deleterId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", deleterId));
        
        if (!deleter.isAdmin()) {
            throw new InsufficientPermissionsException(deleter.getRole().name(), "eliminar incidentes");
        }
        
        incidentRepository.deleteById(id);
    }

    public IncidentDTO mapToDTO(Incident incident) {
        AssigneeDTO assigneeDTO = null;
        
        if (incident.getAssigneeId() != null) {
            assigneeDTO = assigneeRepository.findById(incident.getAssigneeId())
                .map(assignee -> AssigneeDTO.builder()
                    .id(assignee.getId())
                    .name(assignee.getName())
                    .role(assignee.getRole())
                    .isActive(assignee.isActive())
                    .createdAt(assignee.getCreatedAt())
                    .updatedAt(assignee.getUpdatedAt())
                    .build())
                .orElse(null);
        }
        
        return IncidentDTO.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .status(incident.getStatus())
                .description(incident.getDescription())
                .assigneeId(incident.getAssigneeId())
                .assignee(assigneeDTO)
                .dateAssigned(incident.getDateAssigned())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .build();        
    }
}
