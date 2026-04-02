package com.ValenMDO.managerAeroclub.controller;


import com.ValenMDO.managerAeroclub.dto.AvionDTO;
import com.ValenMDO.managerAeroclub.dto.AvionesStatsDTO;
import com.ValenMDO.managerAeroclub.dto.EstadoDTO;
import com.ValenMDO.managerAeroclub.enums.EstadosAviones;
import com.ValenMDO.managerAeroclub.model.Avion;
import com.ValenMDO.managerAeroclub.service.AvionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avion")
public class AvionController {

    @Autowired
    private AvionService avionService;

    /**
     * Obtener todos los aviones
     * GET /api/avion
     */
    @GetMapping
    public List<Avion> getAviones() {
        return avionService.obtenerAviones();
    }

    /**
     * Obtener estadísticas
     * GET /api/aviones/stats
     */
    @GetMapping("/stats")
    public AvionesStatsDTO getStats(){
        return avionService.obtenerEstadisticas();
    }

    /**
     * Crear avión
     * POST /api/avion
     */
    @PostMapping
    public Avion create(@RequestBody AvionDTO dto) {
        return avionService.crearAvion(dto);
    }

    /**
     * Cambiar estado del avión
     * PATCH /api/avion/{id}/estado
     */
    @PatchMapping("/{id}/estado")
    public Avion cambiarEstado(@PathVariable Long id, @RequestBody EstadoDTO dto) {
        return avionService.cambiarEstado(id, dto.estado);
    }

    /**
     * Actualizar un avión completo (matrícula/modelo/estado).
     *
     * Notas:
     * - El backend ya tiene PATCH para cambiar el estado, pero el frontend
     *   permite editar todo en un solo modal.
     * - Si se envía `estado`, se intenta convertirlo a `EstadosAviones`.
     */
    @PutMapping("/{id}")
    public Avion actualizar(@PathVariable Long id, @RequestBody AvionDTO dto) {
        Avion avionActualizado = avionService.actualizar(id, dto);

        // Actualizamos el estado si viene informado.
        if (dto.estado != null && !dto.estado.isBlank()) {
            try {
                EstadosAviones estado = EstadosAviones.valueOf(dto.estado);
                avionActualizado = avionService.cambiarEstado(id, estado);
            } catch (IllegalArgumentException ignored) {
                // Si el estado no coincide con el enum, dejamos el estado actual.
            }
        }

        return avionActualizado;
    }

    /**
     * Eliminar avión
     * DELETE /api/avion/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        avionService.eliminarAvion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public Avion getById(@PathVariable Long id) {
        return avionService.obtenerPorId(id);
    }
}
