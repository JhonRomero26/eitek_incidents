package com.eitek.incidents.application.services;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.eitek.incidents.application.dto.IncidentDTO;
import com.eitek.incidents.domain.exceptions.InsufficientPermissionsException;
import com.eitek.incidents.domain.exceptions.ResourceNotFoundException;
import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.models.Incident;
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
                .status(incidentDTO.getStatus())
                .description(incidentDTO.getDescription())
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

        existingIncident.setTitle(incidentDTO.getTitle());
        existingIncident.setStatus(incidentDTO.getStatus());
        existingIncident.setDescription(incidentDTO.getDescription());
        
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
                throw new InsufficientPermissionsException("auto-asignarse esta incidencia");
            }
        } else {
            // Asignación a otro
            Assignee assigner = assigneeRepository.findById(assignerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", assignerId));
            
            if (!assignmentValidator.canAssign(assigner, targetAssignee, incident)) {
                throw new InsufficientPermissionsException(assigner.getRole(), "asignar incidentes");
            }
        }
        
        incident.setAssigneeId(targetAssigneeId);
        incident.setDateAssigned(LocalDate.now());
    }

    public void deleteIncident(Long id) {
        incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));
        incidentRepository.deleteById(id);
    }

    public IncidentDTO mapToDTO(Incident incident) {
        return IncidentDTO.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .status(incident.getStatus())
                .description(incident.getDescription())
                .assigneeId(incident.getAssigneeId())
                .dateAssigned(incident.getDateAssigned())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .build();        
    }
}
