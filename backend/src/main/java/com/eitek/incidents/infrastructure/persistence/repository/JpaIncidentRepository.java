package com.eitek.incidents.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eitek.incidents.domain.models.IncidentStatus;
import com.eitek.incidents.infrastructure.persistence.entities.IncidentEntity;

public interface JpaIncidentRepository extends JpaRepository<IncidentEntity, Long> {
    List<IncidentEntity> findByStatus(IncidentStatus status);
}
