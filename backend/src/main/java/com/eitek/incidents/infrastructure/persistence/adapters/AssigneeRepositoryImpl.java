package com.eitek.incidents.infrastructure.persistence.adapters;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.models.AssigneeRoles;
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
            .filter(entity -> Boolean.TRUE.equals(entity.getIsActive()))
            .map(this::toDomain)
            .toList();
    }

    @Override
    public void deleteById(Long id) {
        assigneeJpaRepository.deleteById(id);
    }
    
    private Assignee toDomain(AssigneeEntity entity) {
        return Assignee.builder()
            .id(entity.getId())
            .name(entity.getName())
            .isActive(Boolean.TRUE.equals(entity.getIsActive()))
            .role(entity.getRole())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }

    private AssigneeEntity toEntity(Assignee assignee) {
        AssigneeEntity entity = new AssigneeEntity();
        entity.setId(assignee.getId());
        entity.setName(assignee.getName());
        entity.setRole(assignee.getRole() != null ? assignee.getRole() : AssigneeRoles.USER);
        entity.setIsActive(assignee.isActive());
        LocalDateTime now = LocalDateTime.now();
        entity.setCreatedAt(assignee.getCreatedAt() != null ? assignee.getCreatedAt() : now);
        entity.setUpdatedAt(assignee.getUpdatedAt() != null ? assignee.getUpdatedAt() : now);
        return entity;
    }
}
