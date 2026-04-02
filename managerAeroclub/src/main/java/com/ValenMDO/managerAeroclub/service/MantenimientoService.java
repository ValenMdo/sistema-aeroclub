package com.ValenMDO.managerAeroclub.service;

import com.ValenMDO.managerAeroclub.dto.MantenimientoDTO;
import com.ValenMDO.managerAeroclub.model.Avion;
import com.ValenMDO.managerAeroclub.model.Mantenimiento;
import com.ValenMDO.managerAeroclub.repository.AvionRepository;
import com.ValenMDO.managerAeroclub.repository.MantenimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class MantenimientoService {

    @Autowired
    private MantenimientoRepository repository;

    @Autowired
    private AvionRepository aircraftRepository;

    public List<Mantenimiento> getAll() {
        return repository.findAll();
    }

    public Mantenimiento create(MantenimientoDTO dto) {

        Avion aircraft = aircraftRepository.findById(dto.aircraftId)
                .orElseThrow(() -> new RuntimeException("Avión no encontrado"));

        Mantenimiento m = new Mantenimiento();
        m.setAvion(aircraft);
        m.setTipo(dto.tipo);
        m.setDescripcion(dto.descripcion);
        m.setFecha(LocalDate.parse(dto.fecha));
        m.setHorasAvion(dto.horasAvion);

        return repository.save(m);
    }
}
