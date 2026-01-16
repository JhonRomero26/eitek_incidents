package com.eitek.incidents.infrastructure.persistence.adapters;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.repositories.AssigneeRepository;
import com.eitek.incidents.infrastructure.persistence.entities.AssigneeEntity;
import com.eitek.incidents.infrastructure.persistence.repository.JpaAssigneeRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AssigneeRepositoryImpl implements AssigneeRepository {
    private final JpaAssigneeRepository assigneeJpaRepository;
    
    @Override
    public Assignee save(Assignee assignee) {
        AssigneeEntity entity = toEntity(assignee);
        AssigneeEntity savedEntity = assigneeJpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Assignee> findById(Long id) {
        return assigneeJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Assignee> findAll() {
        return assigneeJpaRepository
            .findAll()
            .stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public List<Assignee> findActiveAssignees() {
        return assigneeJpaRepository
            .findAll()
            .stream()
            .filter(AssigneeEntity::isActive)
            .map(this::toDomain)
            .toList();
    }
    
    private Assignee toDomain(AssigneeEntity entity) {
        return Assignee.builder()
            .id(entity.getId())
            .name(entity.getName())
            .isActive(entity.isActive())
            .role(entity.getRole())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }

    private AssigneeEntity toEntity(Assignee assignee) {
        AssigneeEntity entity = new AssigneeEntity();
        entity.setId(assignee.getId());
        entity.setName(assignee.getName());
        entity.setRole(assignee.getRole());
        entity.setActive(assignee.isActive());
        entity.setCreatedAt(assignee.getCreatedAt());
        entity.setUpdatedAt(assignee.getUpdatedAt());
        return entity;
    }
}
