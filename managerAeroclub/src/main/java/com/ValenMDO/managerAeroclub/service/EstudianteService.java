package com.ValenMDO.managerAeroclub.service;

import com.ValenMDO.managerAeroclub.model.Estudiante;
import com.ValenMDO.managerAeroclub.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudianteService {
    @Autowired
    private EstudianteRepository repository;

    public List<Estudiante> getAll() {
        return repository.findAll();
    }

    public Estudiante create(Estudiante student) {
        if (student.getHorasTotales() == null) {
            student.setHorasTotales(0.0);
        }
        return repository.save(student);
    }

    public Estudiante update(Long id, Estudiante updated) {
        Estudiante student = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        student.setNombre(updated.getNombre());
        student.setApellido(updated.getApellido());
        student.setEmail(updated.getEmail());
        student.setTelefono(updated.getTelefono());
        student.setEstado(updated.getEstado());

        return repository.save(student);
    }
}
