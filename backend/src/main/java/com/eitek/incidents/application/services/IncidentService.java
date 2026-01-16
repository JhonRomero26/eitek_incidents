package com.eitek.incidents.application.services;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

import com.eitek.incidents.application.dto.IncidentDTO;
import com.eitek.incidents.domain.exceptions.ResourceNotFoundException;
import com.eitek.incidents.domain.models.Incident;
import com.eitek.incidents.domain.repositories.IncidentRepository;

@Service
@RequiredArgsConstructor
public class IncidentService {
    private final IncidentRepository incidentRepository;

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
        existingIncident.setAssigneeId(incidentDTO.getAssigneeId());
        existingIncident.setDateAssigned(incidentDTO.getDateAssigned());

        Incident updatedIncident = incidentRepository.save(existingIncident);
        return mapToDTO(updatedIncident);
    }

    public void deleteIncident(Long id) {
        Incident existingIncident = incidentRepository.findById(id)
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
