package com.eitek.incidents.application.services;

import com.eitek.incidents.application.dto.AssigneeDTO;
import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.repositories.AssigneeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssigneeService {

    private final AssigneeRepository assigneeRepository;

    public AssigneeDTO createAssignee(AssigneeDTO assigneeDTO) {
        Assignee assignee = Assignee.builder()
                .name(assigneeDTO.getName())
                .role(assigneeDTO.getRole())
                .isActive(assigneeDTO.isActive())
                .build();
        
        Assignee savedAssignee = assigneeRepository.save(assignee);
        return mapToDTO(savedAssignee);
    }

    public List<AssigneeDTO> getAllAssignees() {
        return assigneeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AssigneeDTO mapToDTO(Assignee assignee) {
        return AssigneeDTO.builder()
                .id(assignee.getId())
                .name(assignee.getName())
                .role(assignee.getRole())
                .isActive(assignee.isActive())
                .createdAt(assignee.getCreatedAt())
                .build();
    }
}
