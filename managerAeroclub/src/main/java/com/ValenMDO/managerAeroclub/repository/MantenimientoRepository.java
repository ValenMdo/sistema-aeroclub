package com.ValenMDO.managerAeroclub.repository;

import com.ValenMDO.managerAeroclub.model.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {
}
