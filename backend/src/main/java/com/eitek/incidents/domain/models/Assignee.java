package com.eitek.incidents.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assignee {
    private Long id;
    private String name;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
}
