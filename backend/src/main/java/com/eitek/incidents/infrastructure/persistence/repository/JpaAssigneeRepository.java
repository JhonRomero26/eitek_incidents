package com.eitek.incidents.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eitek.incidents.infrastructure.persistence.entities.AssigneeEntity;

public interface JpaAssigneeRepository extends JpaRepository<AssigneeEntity, Long> {
}
