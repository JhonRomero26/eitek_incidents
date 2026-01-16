package com.eitek.incidents.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import com.eitek.incidents.domain.models.AssigneeRoles;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "assignees")
@Data
public class AssigneeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AssigneeRoles role = AssigneeRoles.USER;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
