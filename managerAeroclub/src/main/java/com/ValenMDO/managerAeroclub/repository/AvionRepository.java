package com.ValenMDO.managerAeroclub.repository;

import com.ValenMDO.managerAeroclub.enums.EstadosAviones;
import com.ValenMDO.managerAeroclub.model.Avion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvionRepository extends JpaRepository<Avion, Long> {
    long countByEstado(EstadosAviones estado);
    List<Avion> findByEstado(EstadosAviones estado);
}
