package com.eitek.incidents.application.services;

import com.eitek.incidents.application.dto.AssigneeDTO;
import com.eitek.incidents.domain.exceptions.InsufficientPermissionsException;
import com.eitek.incidents.domain.exceptions.ResourceNotFoundException;
import com.eitek.incidents.domain.models.Assignee;
import com.eitek.incidents.domain.models.AssigneeRoles;
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
                .role(assigneeDTO.getRole() != null ? assigneeDTO.getRole() : AssigneeRoles.OPERATOR)
                .isActive(true)
                .build();
        
        Assignee savedAssignee = assigneeRepository.save(assignee);
        return mapToDTO(savedAssignee);
    }

    public AssigneeDTO getAssigneeById(Long id) {
        Assignee assignee = assigneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", id));
        return mapToDTO(assignee);
    }

    public AssigneeDTO updateAssignee(Long id, AssigneeDTO assigneeDTO) {
        Assignee existingAssignee = assigneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", id));
        existingAssignee.setName(assigneeDTO.getName());
        if (assigneeDTO.getRole() != null) {
            existingAssignee.setRole(assigneeDTO.getRole());
        }
        Assignee updatedAssignee = assigneeRepository.save(existingAssignee);
        return mapToDTO(updatedAssignee);
    }

    public AssigneeDTO activateAssignee(Long id) {
        Assignee assignee = assigneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", id));
        assignee.activate();
        assignee.setUpdatedAt(java.time.LocalDateTime.now());
        Assignee savedAssignee = assigneeRepository.save(assignee);
        return mapToDTO(savedAssignee);
    }

    public AssigneeDTO deactivateAssignee(Long id) {
        Assignee assignee = assigneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", id));
        assignee.deactivate();
        assignee.setUpdatedAt(java.time.LocalDateTime.now());
        Assignee savedAssignee = assigneeRepository.save(assignee);
        return mapToDTO(savedAssignee);
    }

    public void deleteAssignee(Long id, Long deleterId) {
        Assignee assignee = assigneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee", "id", id));

        if (deleterId == null) {
            throw new ResourceNotFoundException("Deleter", "id", deleterId);
        }

        Assignee deleter = assigneeRepository.findById(deleterId)
                .orElseThrow(() -> new ResourceNotFoundException("Deleter", "id", deleterId));
        
        if (!deleter.getRole().equals(AssigneeRoles.ADMIN)) {
            throw new InsufficientPermissionsException(deleter.getName(), "delete assignees");
        }

        assigneeRepository.deleteById(id);
    }

    public List<AssigneeDTO> getAllAssignees() {
        return assigneeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AssigneeDTO> getActiveAssignees() {
        return assigneeRepository.findAll().stream()
                .filter(Assignee::isActive)
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
                .updatedAt(assignee.getUpdatedAt())
                .build();
    }
}
