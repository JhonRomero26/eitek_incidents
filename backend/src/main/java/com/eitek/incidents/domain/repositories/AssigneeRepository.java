package com.eitek.incidents.domain.repositories;

import com.eitek.incidents.domain.models.Assignee;
import java.util.List;
import java.util.Optional;

public interface AssigneeRepository {
    Assignee save(Assignee assignee);
    Optional<Assignee> findById(Long id);
    List<Assignee> findAll();
    List<Assignee> findActiveAssignees();
}
