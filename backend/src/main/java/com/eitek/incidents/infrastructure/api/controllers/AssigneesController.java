package com.eitek.incidents.infrastructure.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eitek.incidents.application.dto.AssigneeDTO;
import com.eitek.incidents.application.services.AssigneeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/assignees")
@RequiredArgsConstructor
public class AssigneesController {
    private final AssigneeService assigneeService;

    @GetMapping
    public ResponseEntity<List<AssigneeDTO>> getAllAssignees() {
        List<AssigneeDTO> assignees = assigneeService.getAllAssignees();
        return ResponseEntity.ok(assignees);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AssigneeDTO>> getActiveAssignees() {
        List<AssigneeDTO> assignees = assigneeService.getActiveAssignees();
        return ResponseEntity.ok(assignees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssigneeDTO> getAssigneeById(@PathVariable Long id) {
        AssigneeDTO assignee = assigneeService.getAssigneeById(id);
        return ResponseEntity.ok(assignee);
    }

    @PostMapping
    public ResponseEntity<AssigneeDTO> createAssignee(@RequestBody AssigneeDTO dto) {
        AssigneeDTO createdAssignee = assigneeService.createAssignee(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAssignee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssigneeDTO> updateAssignee(@PathVariable Long id, @RequestBody AssigneeDTO dto) {
        AssigneeDTO updatedAssignee = assigneeService.updateAssignee(id, dto);
        return ResponseEntity.ok(updatedAssignee);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<AssigneeDTO> activateAssignee(@PathVariable Long id) {
        AssigneeDTO activatedAssignee = assigneeService.activateAssignee(id);
        return ResponseEntity.ok(activatedAssignee);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<AssigneeDTO> deactivateAssignee(@PathVariable Long id) {
        AssigneeDTO deactivatedAssignee = assigneeService.deactivateAssignee(id);
        return ResponseEntity.ok(deactivatedAssignee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignee(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId
    ) {
        assigneeService.deleteAssignee(id, userId);
        return ResponseEntity.noContent().build();
    }
}
