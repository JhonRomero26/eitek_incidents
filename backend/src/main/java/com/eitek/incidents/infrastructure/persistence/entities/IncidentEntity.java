package com.eitek.incidents.infrastructure.persistence.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.eitek.incidents.domain.models.IncidentStatus;

@Entity
@Table(name = "incidents")
@Data
public class IncidentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IncidentStatus status = IncidentStatus.OPEN;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private AssigneeEntity assignee;

    @Column(name = "date_assigned")
    private LocalDate dateAssigned;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
