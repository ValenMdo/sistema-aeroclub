package com.ValenMDO.managerAeroclub.controller;


import com.ValenMDO.managerAeroclub.model.Estudiante;
import com.ValenMDO.managerAeroclub.service.EstudianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService service;

    @GetMapping
    public List<Estudiante> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Estudiante create(@RequestBody Estudiante estudiante) {
        return service.create(estudiante);
    }

    @PutMapping("/{id}")
    public Estudiante update(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        return service.update(id, estudiante);
    }
}
