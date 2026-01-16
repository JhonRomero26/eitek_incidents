package com.eitek.incidents.domain.repositories;

import com.eitek.incidents.domain.models.Incident;
import java.util.List;
import java.util.Optional;

public interface IncidentRepository {
    Incident save(Incident incident);
    Optional<Incident> findById(Long id);
    List<Incident> findAll();
    void deleteById(Long id);
}
