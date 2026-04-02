package com.ValenMDO.managerAeroclub.controller;

import com.ValenMDO.managerAeroclub.dto.VueloDTO;
import com.ValenMDO.managerAeroclub.model.Vuelo;
import com.ValenMDO.managerAeroclub.service.VueloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vuelos")
public class VueloController {

    @Autowired
    private VueloService service;

    @GetMapping
    public List<Vuelo> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Vuelo create(@RequestBody VueloDTO dto) {
        return service.createFlight(dto);
    }
}
