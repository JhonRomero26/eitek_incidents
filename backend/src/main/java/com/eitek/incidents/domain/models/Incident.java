package com.eitek.incidents.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Incident {
    private Long id;
    private String title;
    private String description;
    private IncidentStatus status;
    private Long assigneeId;
    private LocalDate dateAssigned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void assignTo(Long assigneeId) {
        if (this.status != IncidentStatus.OPEN) {
            throw new IllegalStateException("Incident can only be assigned if it is in OPEN status.");
        }
        this.assigneeId = assigneeId;
        this.status = IncidentStatus.ASSIGNED;
        this.dateAssigned = LocalDate.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void unassign() {
        if (this.status == IncidentStatus.RESOLVED) {
            throw new IllegalStateException("Cannot unassign a RESOLVED incident.");
        }
        this.assigneeId = null;
        this.status = IncidentStatus.OPEN;
        this.dateAssigned = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void startResolution() {
        if (this.status != IncidentStatus.ASSIGNED || this.assigneeId == null) {
            throw new IllegalStateException(
                "Incident can only be moved to IN_PROGRESS if it's in ASSIGNED status and has an assignee."
            );
        }
        this.status = IncidentStatus.IN_PROGRESS;
        this.updatedAt = LocalDateTime.now();
    }

    public void resolve() {
        if (this.status != IncidentStatus.IN_PROGRESS) {
            throw new IllegalStateException(
                "Incident can only be resolved if it is currently IN_PROGRESS."
            );
        }
        this.status = IncidentStatus.RESOLVED;
        this.updatedAt = LocalDateTime.now();
    }

    public void reopen() {
        if (this.status != IncidentStatus.RESOLVED) {
            throw new IllegalStateException("Only RESOLVED incidents can be reopened.");
        }
        this.status = IncidentStatus.OPEN;
        this.assigneeId = null;
        this.dateAssigned = null;
        this.updatedAt = LocalDateTime.now();
    }
}
