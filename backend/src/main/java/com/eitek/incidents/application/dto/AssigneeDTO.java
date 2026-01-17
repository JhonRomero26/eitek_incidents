package com.eitek.incidents.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.eitek.incidents.domain.models.AssigneeRoles;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssigneeDTO {
    private Long id;
    private String name;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private AssigneeRoles role;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
