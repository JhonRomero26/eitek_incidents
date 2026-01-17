package com.eitek.incidents.application.dto;

import com.eitek.incidents.domain.models.IncidentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

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
public class IncidentDTO {
    private Long id;
    private String title;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private IncidentStatus status;
    
    private String description;
    private Long assigneeId;
    private AssigneeDTO assignee;
    private Long assignerId;
    private LocalDate dateAssigned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
