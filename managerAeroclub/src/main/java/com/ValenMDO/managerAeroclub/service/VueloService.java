package com.ValenMDO.managerAeroclub.service;

import com.ValenMDO.managerAeroclub.dto.VueloDTO;
import com.ValenMDO.managerAeroclub.enums.TiposDeVuelo;
import com.ValenMDO.managerAeroclub.model.Avion;
import com.ValenMDO.managerAeroclub.model.Estudiante;
import com.ValenMDO.managerAeroclub.model.Usuario;
import com.ValenMDO.managerAeroclub.model.Vuelo;
import com.ValenMDO.managerAeroclub.repository.AvionRepository;
import com.ValenMDO.managerAeroclub.repository.EstudianteRepository;
import com.ValenMDO.managerAeroclub.repository.UsuarioRepository;
import com.ValenMDO.managerAeroclub.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class VueloService {

    @Autowired
    private VueloRepository vueloRepository;

    @Autowired
    private AvionRepository avionRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Vuelo> getAll() {
        return vueloRepository.findAll();
    }

    /**
     * Crea un vuelo y actualiza horas automáticamente
     */
    public Vuelo createFlight(VueloDTO dto) {

        Avion avion = avionRepository.findById(dto.aircraftId)
                .orElseThrow(() -> new RuntimeException("Avión no encontrado"));

        Estudiante estudiante = estudianteRepository.findById(dto.studentId)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        Usuario instructor = usuarioRepository.findById(dto.instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor no encontrado"));

        Vuelo vuelo = new Vuelo();
        vuelo.setAvion(avion);
        vuelo.setStudent(estudiante);
        vuelo.setInstructor(instructor);
        vuelo.setHorasVuelo(dto.horasVuelo);
        vuelo.setTipoVuelo(TiposDeVuelo.valueOf(dto.tipoVuelo));
        vuelo.setObservaciones(dto.observaciones);
        vuelo.setFecha(LocalDate.now());

        // Actualizar horas
        avion.setHorasTotales(avion.getHorasTotales() + dto.horasVuelo);
        estudiante.setHorasTotales(estudiante.getHorasTotales() + dto.horasVuelo);

        avionRepository.save(avion);
        estudianteRepository.save(estudiante);

        return vueloRepository.save(vuelo);
    }
}
