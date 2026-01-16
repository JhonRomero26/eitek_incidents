package com.eitek.incidents.infrastructure.persistence.adapters;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.eitek.incidents.domain.models.Incident;
import com.eitek.incidents.domain.repositories.IncidentRepository;
import com.eitek.incidents.infrastructure.persistence.entities.IncidentEntity;
import com.eitek.incidents.infrastructure.persistence.repository.JpaAssigneeRepository;
import com.eitek.incidents.infrastructure.persistence.repository.JpaIncidentRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class IncidentRepositoryImpl implements IncidentRepository {
    private final JpaIncidentRepository incidentJpaRepository;
    private final JpaAssigneeRepository assigneeJpaRepository;

    @Override
    public Incident save(Incident incident) {
        IncidentEntity incidentEntity = toEntity(incident);
        IncidentEntity savedEntity = incidentJpaRepository.save(incidentEntity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Incident> findById(Long id) {
        return incidentJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Incident> findAll() {
        return incidentJpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public void deleteById(Long id) {
        incidentJpaRepository.deleteById(id);
    };

    private IncidentEntity toEntity(Incident domain) {
        IncidentEntity entity = new IncidentEntity();
        entity.setId(domain.getId());
        entity.setTitle(domain.getTitle());
        entity.setDescription(domain.getDescription());
        entity.setStatus(domain.getStatus());
        entity.setDateAssigned(domain.getDateAssigned());
        
        if (domain.getAssigneeId() != null) {
            assigneeJpaRepository.findById(domain.getAssigneeId())
                .ifPresent(entity::setAssignee);
        }
        
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    private Incident toDomain(IncidentEntity incident) {
        return Incident.builder()
            .id(incident.getId())
            .title(incident.getTitle())
            .description(incident.getDescription())
            .status(incident.getStatus())
            .assigneeId(incident.getAssignee() != null ? incident.getAssignee().getId() : null)
            .dateAssigned(incident.getDateAssigned())
            .createdAt(incident.getCreatedAt())
            .updatedAt(incident.getUpdatedAt())
            .build();
    }
}
