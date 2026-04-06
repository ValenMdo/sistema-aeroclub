package com.ValenMDO.managerAeroclub.service;

import com.ValenMDO.managerAeroclub.dto.AvionDTO;
import com.ValenMDO.managerAeroclub.dto.AvionesStatsDTO;
import com.ValenMDO.managerAeroclub.enums.EstadosAviones;
import com.ValenMDO.managerAeroclub.model.Avion;
import com.ValenMDO.managerAeroclub.repository.AvionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ValenMDO.managerAeroclub.excepciones.ResourceNotFoundException;
import com.ValenMDO.managerAeroclub.excepciones.RequestException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
public class AvionService {

    @Autowired
    private AvionRepository repository;

    public List<Avion> obtenerAviones() {
        return repository.findAll();
    }

    public Avion crearAvion(AvionDTO dto){
        if (dto.matricula == null || dto.matricula.isBlank()) {
            throw new RequestException("P-400", HttpStatus.BAD_REQUEST, "La matrícula es obligatoria");
        }

        Avion avion = new Avion();
        avion.setMatricula(dto.matricula);
        avion.setModelo(dto.modelo);
        // El frontend envía `estado` como string. El backend necesita el enum.
        // Si no viene, se asume DISPONIBLE.
        EstadosAviones estado = EstadosAviones.DISPONIBLE;
        if (dto.estado != null && !dto.estado.isBlank()) {
            String normalized = dto.estado.trim().toUpperCase();
            // Soportamos valores tipo "FUERA SERVICIO" (sin guion) por si el frontend
            // manda una variante en español con espacios.
            normalized = normalized.replace(' ', '_').replace('-', '_');

            if ("DISPONIBLE".equals(normalized)) {
                estado = EstadosAviones.DISPONIBLE;
            } else if ("MANTENIMIENTO".equals(normalized)) {
                estado = EstadosAviones.MANTENIMIENTO;
            } else if ("FUERA_SERVICIO".equals(normalized)) {
                estado = EstadosAviones.FUERA_SERVICIO;
            } else {
                // Intento final por si el string coincide exactamente con el enum.
                try {
                    estado = EstadosAviones.valueOf(normalized);
                } catch (IllegalArgumentException ignored) {
                    // Si no coincide, dejamos DISPONIBLE.
                }
            }
        }

        avion.setEstado(estado);
        avion.setHorasTotales(0.0);

        return repository.save(avion);
    }

    public Avion cambiarEstado(Long id, EstadosAviones estado){
        Avion avion = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Avión no encontrado"));
        avion.setEstado(estado);

        return repository.save(avion);
    }

    public AvionesStatsDTO obtenerEstadisticas(){
        long total = repository.count();
        long disponibles = repository.countByEstado(EstadosAviones.DISPONIBLE);
        long mantenimiento = repository.countByEstado(EstadosAviones.MANTENIMIENTO);
        long fuera = repository.countByEstado(EstadosAviones.FUERA_SERVICIO);

        return new AvionesStatsDTO(total, disponibles, mantenimiento, fuera);
    }

    public void eliminarAvion(Long id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Avión no encontrado");
        }
        repository.deleteById(id);
    }

    public Avion obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avión no encontrado"));
    }

    public Avion actualizar(Long id, AvionDTO dto) {

        Avion avion = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avión no encontrado"));

        avion.setModelo(dto.modelo);
        avion.setMatricula(dto.matricula);

        return repository.save(avion);
    }

    public List<Avion> obtenerPorEstado(EstadosAviones estado) {
        return repository.findByEstado(estado);
    }

}
