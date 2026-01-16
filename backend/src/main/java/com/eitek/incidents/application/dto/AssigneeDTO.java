package com.eitek.incidents.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.eitek.incidents.domain.models.AssigneeRoles;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssigneeDTO {
    private Long id;
    private String name;
    private AssigneeRoles role;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
