package com.ValenMDO.managerAeroclub.controller;

import com.ValenMDO.managerAeroclub.dto.MantenimientoDTO;
import com.ValenMDO.managerAeroclub.model.Mantenimiento;
import com.ValenMDO.managerAeroclub.service.MantenimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimiento")
public class MantenimientoController {

    @Autowired
    private MantenimientoService service;

    @GetMapping
    public List<Mantenimiento> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Mantenimiento create(@RequestBody MantenimientoDTO dto) {
        return service.create(dto);
    }
}
