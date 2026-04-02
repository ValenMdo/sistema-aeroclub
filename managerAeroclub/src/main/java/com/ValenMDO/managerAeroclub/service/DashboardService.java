package com.ValenMDO.managerAeroclub.service;

import com.ValenMDO.managerAeroclub.dto.DashboardDTO;
import com.ValenMDO.managerAeroclub.model.Vuelo;
import com.ValenMDO.managerAeroclub.repository.AvionRepository;
import com.ValenMDO.managerAeroclub.repository.MantenimientoRepository;
import com.ValenMDO.managerAeroclub.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private VueloRepository vueloRepository;

    @Autowired
    private AvionRepository avionRepository;

    @Autowired
    private MantenimientoRepository mantenimientoRepository;

    public DashboardDTO getStats() {

        DashboardDTO dto = new DashboardDTO();

        LocalDate today = LocalDate.now();

        List<Vuelo> vuelosHoy = vueloRepository.findAll()
                .stream()
                .filter(f -> f.getFecha().equals(today))
                .toList();

        dto.vuelosHoy = vuelosHoy.size();

        dto.horasVoladas = vuelosHoy.stream()
                .mapToDouble(Vuelo::getHorasVuelo)
                .sum();

        dto.avionesDisponibles = (int) avionRepository.findAll()
                .stream()
                .filter(a -> a.getEstado().name().equals("DISPONIBLE"))
                .count();

        dto.mantenimientosPendientes = mantenimientoRepository.findAll().size();

        return dto;
    }
}
